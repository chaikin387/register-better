'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function deleteAdminCategoryAttribute(
  id: string
): Promise<ActionResult> {
  try {
    await prisma.categoryAttribute.delete({ where: { id } })

    revalidatePath('/admin-panel/categories')

    return { success: true, id }
  } catch (error) {
    console.error('Ошибка при удалении связи атрибута и категории:', error)
    return { success: false, error: 'Не удалось удалить атрибут из категории.' }
  }
}
