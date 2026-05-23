'use server'

import { auth } from '@/lib/auth'
import { getServerSession } from '@/lib/auth-session'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { nameSchema } from './name.schema'

type ActionResult = { ok?: true; error?: string }

export async function updateName(name: string): Promise<ActionResult> {
  const session = await getServerSession()
  if (!session?.user?.id) return { error: 'Не авторизован' }

  const parsed = nameSchema.safeParse({ name })
  if (!parsed.success) return { error: parsed.error.issues[0]!.message }

  try {
    await auth.api.updateUser({
      body: { name: parsed.data.name },
      headers: await headers(),
    })
  } catch (e) {
    console.error('[updateName] error:', e)
    return { error: 'Ошибка сохранения имени' }
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}
