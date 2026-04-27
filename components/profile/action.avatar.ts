'use server'

import { avatarSchema } from '@/components/profile/avatar.schema'
import { db } from '@/db'
import { user } from '@/db/schema'
import { getServerSession } from '@/lib/auth-session'
import { s3 } from '@/lib/s3'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const BUCKET = process.env.YANDEX_S3_BUCKET!
const ENDPOINT = process.env.YANDEX_S3_ENDPOINT!.replace(/\/$/, '')

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const buildUrl = (key: string) => `${ENDPOINT}/${BUCKET}/${key}`

function extractKey(url: string | null) {
  if (!url) return null
  try {
    const path = new URL(url).pathname
    const prefix = `/${BUCKET}/`
    const i = path.indexOf(prefix)
    return i !== -1 ? path.slice(i + prefix.length) : null
  } catch {
    return null
  }
}

async function deleteFromS3(key: string | null) {
  if (!key) return
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
  } catch (e) {
    console.warn('[s3:delete]', key, e)
  }
}

async function getImage(userId: string) {
  const [row] = await db
    .select({ image: user.image })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)
  return row?.image ?? null
}

export async function uploadAvatar(formData: FormData) {
  const session = await getServerSession()
  if (!session?.user) return { error: 'Не авторизован' }

  const parsed = avatarSchema.safeParse({ file: formData.get('avatar') })
  if (!parsed.success) return { error: parsed.error.issues[0]!.message }

  const { file } = parsed.data
  const ext = MIME_TO_EXT[file.type]
  if (!ext) return { error: 'Неподдерживаемый формат' }

  const key = `avatars/${session.user.id}-${Date.now()}.${ext}`
  const url = buildUrl(key)
  const oldKey = extractKey(await getImage(session.user.id))

  // 1. Загрузка в S3
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    })
  )

  // 2. Обновление БД
  try {
    await db
      .update(user)
      .set({ image: url })
      .where(eq(user.id, session.user.id))
  } catch (e) {
    // ВАЖНО: Ждем завершения удаления, чтобы не оставить "мусор" при сбое БД
    await deleteFromS3(key)
    return { error: 'Ошибка сохранения в базу данных' }
  }

  // 3. Успех: фоновая очистка старого файла
  void deleteFromS3(oldKey)
  revalidatePath('/', 'layout')
  return { url }
}

export async function resetAvatar() {
  const session = await getServerSession()
  if (!session?.user) return { error: 'Не авторизован' }

  const oldKey = extractKey(await getImage(session.user.id))

  try {
    await db
      .update(user)
      .set({ image: null })
      .where(eq(user.id, session.user.id))
  } catch (e) {
    return { error: 'Ошибка удаления из базы данных' }
  }

  // Очистка старого файла
  void deleteFromS3(oldKey)
  revalidatePath('/', 'layout')
  return { ok: true }
}
