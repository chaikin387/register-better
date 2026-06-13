'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function deleteAdminAttribute(id: string): Promise<ActionResult> {
  try {
    const hasValues = await prisma.attributeValue.findFirst({
      where: { attributeId: id },
      select: { id: true },
    })

    if (hasValues) {
      return {
        success: false,
        error: 'Нельзя удалить атрибут — у него есть значения.',
      }
    }

    const hasCategories = await prisma.categoryAttribute.findFirst({
      where: { attributeId: id },
      select: { id: true },
    })

    if (hasCategories) {
      return {
        success: false,
        error: 'Нельзя удалить атрибут — он привязан к категориям.',
      }
    }

    await prisma.attribute.delete({ where: { id } })

    revalidatePath('/admin-panel/attributes')

    return { success: true, id }
  } catch (error) {
    console.error('Ошибка при удалении атрибута:', error)
    return { success: false, error: 'Не удалось удалить атрибут.' }
  }
}
