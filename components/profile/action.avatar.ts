'use server'

import { avatarSchema } from '@/components/profile/avatar.schema'

import { getServerSession } from '@/lib/auth-session'
import prisma from '@/lib/prisma'
import { s3 } from '@/lib/s3'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { revalidatePath } from 'next/cache'

const BUCKET = process.env.YANDEX_S3_BUCKET!
const ENDPOINT = process.env.YANDEX_S3_ENDPOINT!.replace(/\/$/, '')

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const buildS3Url = (key: string) => `${ENDPOINT}/${BUCKET}/${key}`

function extractS3Key(url: string | null): string | null {
  if (!url) return null
  try {
    const path = new URL(url).pathname
    const prefix = `/${BUCKET}/`
    const idx = path.indexOf(prefix)
    return idx !== -1 ? path.slice(idx + prefix.length) : null
  } catch {
    return null
  }
}

async function deleteS3Object(key: string | null): Promise<void> {
  if (!key) return
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
  } catch (e) {
    console.warn('[s3] failed to delete:', key, e)
  }
}

async function getUserImage(userId: string): Promise<string | null> {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: { image: true },
  })
  return row?.image ?? null
}

async function requireUserId(): Promise<string | null> {
  const session = await getServerSession()
  return session?.user?.id ?? null
}

type ActionResult = { url?: string; ok?: true; error?: string }

export async function uploadAvatar(formData: FormData): Promise<ActionResult> {
  const userId = await requireUserId()
  if (!userId) return { error: 'Не авторизован' }

  const parsed = avatarSchema.safeParse({ file: formData.get('avatar') })
  if (!parsed.success) return { error: parsed.error.issues[0]!.message }

  const { file } = parsed.data
  const ext = MIME_TO_EXT[file.type]
  if (!ext) return { error: 'Неподдерживаемый формат' }

  const key = `avatars/${userId}-${Date.now()}.${ext}`
  const url = buildS3Url(key)
  const oldKey = extractS3Key(await getUserImage(userId))

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    })
  )

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { image: url },
    })
  } catch (e) {
    console.error('[uploadAvatar] db error:', e)
    await deleteS3Object(key)
    return { error: 'Ошибка сохранения в базу данных' }
  }

  void deleteS3Object(oldKey)
  revalidatePath('/', 'layout')
  return { url }
}

export async function resetAvatar(): Promise<ActionResult> {
  const userId = await requireUserId()
  if (!userId) return { error: 'Не авторизован' }

  const oldKey = extractS3Key(await getUserImage(userId))

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { image: null },
    })
  } catch (e) {
    console.error('[resetAvatar] db error:', e)
    return { error: 'Ошибка удаления из базы данных' }
  }

  void deleteS3Object(oldKey)
  revalidatePath('/', 'layout')
  return { ok: true }
}
