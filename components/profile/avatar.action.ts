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
const ENDPOINT = process.env.YANDEX_S3_ENDPOINT!

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const satisfies Record<string, string>

const extractS3Key = (url: string) => {
  const parsed = URL.parse(url)
  const prefix = `/${BUCKET}/`
  return parsed?.pathname.startsWith(prefix)
    ? parsed.pathname.slice(prefix.length)
    : null
}

const deleteS3 = (key: string | null) =>
  key
    ? s3
        .send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
        .catch(() => {})
    : undefined

const deleteOldAvatar = (url: string | null) =>
  deleteS3(extractS3Key(url ?? ''))

const getImage = async (userId: string) => {
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
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const file = parsed.data.file
  const key = `avatars/${session.user.id}-${Date.now()}.${MIME_TO_EXT[file.type as keyof typeof MIME_TO_EXT]}`
  const imageUrl = new URL(`/${BUCKET}/${key}`, ENDPOINT).toString()

  const uploadError = await s3
    .send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    )
    .then(() => null)
    .catch(() => 'Не удалось загрузить файл в хранилище')

  if (uploadError) return { error: uploadError }

  const oldImage = await getImage(session.user.id)

  const dbError = await db
    .update(user)
    .set({ image: imageUrl })
    .where(eq(user.id, session.user.id))
    .then(() => null)
    .catch(async () => {
      await deleteS3(key)
      return 'Не удалось сохранить аватар в базе данных'
    })

  if (dbError) return { error: dbError }

  await deleteOldAvatar(oldImage)
  revalidatePath('/', 'layout')

  return { url: imageUrl }
}

export async function resetAvatar() {
  const session = await getServerSession()
  if (!session?.user) return { error: 'Не авторизован' }

  const oldImage = await getImage(session.user.id)

  const dbError = await db
    .update(user)
    .set({ image: null })
    .where(eq(user.id, session.user.id))
    .then(() => null)
    .catch(() => 'Не удалось сбросить аватар в базе данных')

  if (dbError) return { error: dbError }

  await deleteOldAvatar(oldImage)
  revalidatePath('/', 'layout')

  return { success: true }
}
