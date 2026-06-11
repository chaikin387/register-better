'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function deleteAdminAttribute(id: string): Promise<ActionResult> {
  try {
    await prisma.attribute.delete({ where: { id } })

    revalidatePath('/admin-panel/attributes')

    return { success: true, id }
  } catch (error) {
    console.error('Ошибка при удалении атрибута:', error)
    return { success: false, error: 'Не удалось удалить атрибут.' }
  }
}
