'use server'

import { avatarSchema } from '@/components/profile/avatar.schema'
import { db } from '@/db'
import { user } from '@/db/schema'
import { getServerSession } from '@/lib/auth-session'
import { s3 } from '@/lib/s3'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// ─── Константы ────────────────────────────────────────────────────────────────

const BUCKET = process.env.YANDEX_S3_BUCKET!
const ENDPOINT = process.env.YANDEX_S3_ENDPOINT!

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const satisfies Record<string, string>

// ─── Утилиты ──────────────────────────────────────────────────────────────────

function extractS3Key(url: string | null): string | null {
  if (!url) return null
  const prefix = `/${BUCKET}/`
  const pathname = URL.parse(url)?.pathname ?? ''
  return pathname.startsWith(prefix) ? pathname.slice(prefix.length) : null
}

/**
 * Удаляет файл из S3 с экспоненциальным retry через рекурсию.
 * Падение не критично — БД уже консистентна к моменту вызова.
 * Retry покрывает временные сбои сети/S3 без внешних очередей.
 */
async function deleteFromS3(url: string | null, retries = 3): Promise<void> {
  const key = extractS3Key(url)
  if (!key) return

  const attempt = async (remaining: number): Promise<void> => {
    try {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
    } catch (error) {
      if (remaining === 1) {
        console.warn(
          '[S3] Не удалось удалить после',
          retries,
          'попыток:',
          key,
          error
        )
        return
      }
      // 500ms → 1000ms → 2000ms
      await new Promise((r) => setTimeout(r, 500 * 2 ** (retries - remaining)))
      await attempt(remaining - 1)
    }
  }

  await attempt(retries)
}

async function getCurrentImage(userId: string): Promise<string | null> {
  const [row] = await db
    .select({ image: user.image })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)
  return row?.image ?? null
}

// ─── Server Actions ───────────────────────────────────────────────────────────

export async function uploadAvatar(formData: FormData) {
  try {
    const session = await getServerSession()
    if (!session?.user) return { error: 'Не авторизован' }

    const parsed = avatarSchema.safeParse({ file: formData.get('avatar') })
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? 'Ошибка валидации' }
    }

    const { file } = parsed.data
    const ext = MIME_TO_EXT[file.type as keyof typeof MIME_TO_EXT]
    const key = `avatars/${session.user.id}-${Date.now()}.${ext}`
    const imageUrl = new URL(`/${BUCKET}/${key}`, ENDPOINT).toString()

    // Читаем старый аватар ДО любых изменений
    const oldImage = await getCurrentImage(session.user.id)

    // Шаг 1: Загружаем новый файл в S3
    // Если упадёт — БД не тронута, orphan невозможен
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    )

    // Шаг 2: Обновляем БД
    // Если упадёт — откатываем S3, чтобы не было orphan
    try {
      await db
        .update(user)
        .set({ image: imageUrl })
        .where(eq(user.id, session.user.id))
    } catch (error) {
      console.error('[DB] Ошибка обновления аватара:', error)
      // Откат: удаляем только что загруженный файл
      await deleteFromS3(imageUrl)
      return { error: 'Не удалось сохранить аватар' }
    }

    // Шаг 3: Удаляем старый ПОСЛЕ успешной записи в БД
    // БД уже консистентна — retry покрывает временные сбои S3
    await deleteFromS3(oldImage)

    revalidatePath('/', 'layout')
    return { url: imageUrl }
  } catch (error) {
    console.error('[uploadAvatar]:', error)
    return { error: 'Произошла непредвиденная ошибка' }
  }
}

export async function resetAvatar() {
  try {
    const session = await getServerSession()
    if (!session?.user) return { error: 'Не авторизован' }

    // Читаем старый аватар ДО любых изменений
    const oldImage = await getCurrentImage(session.user.id)

    // Шаг 1: Обновляем БД
    // Если упадёт — S3 не тронут, всё консистентно
    try {
      await db
        .update(user)
        .set({ image: null })
        .where(eq(user.id, session.user.id))
    } catch (error) {
      console.error('[DB] Ошибка сброса аватара:', error)
      return { error: 'Не удалось сбросить аватар' }
    }

    // Шаг 2: Удаляем из S3 ПОСЛЕ успешной записи в БД
    // БД уже консистентна — retry покрывает временные сбои S3
    await deleteFromS3(oldImage)

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('[resetAvatar]:', error)
    return { error: 'Произошла непредвиденная ошибка' }
  }
}
