'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function deleteAdminAttributeValue(
  id: string,
  attributeId: string
): Promise<ActionResult> {
  try {
    await prisma.attributeValue.delete({ where: { id } })

    revalidatePath(`/admin-panel/attributes/${attributeId}`)

    return { success: true, id }
  } catch (error) {
    console.error('Ошибка при удалении значения атрибута:', error)
    return { success: false, error: 'Не удалось удалить значение.' }
  }
}
