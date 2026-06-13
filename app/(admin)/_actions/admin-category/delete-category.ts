'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function deleteAdminCategory(id: string): Promise<ActionResult> {
  try {
    const hasChildren = await prisma.category.findFirst({
      where: { parentId: id },
      select: { id: true },
    })

    if (hasChildren) {
      return {
        success: false,
        error: 'Нельзя удалить категорию — она содержит подкатегории.',
      }
    }

    const hasProducts = await prisma.product.findFirst({
      where: { categoryId: id },
      select: { id: true },
    })

    if (hasProducts) {
      return {
        success: false,
        error: 'Нельзя удалить категорию — к ней привязаны товары.',
      }
    }

    await prisma.category.delete({ where: { id } })

    revalidatePath('/admin-panel/categories')
    revalidatePath('/')

    return { success: true, id }
  } catch (error) {
    console.error('Ошибка при удалении категории:', error)
    return { success: false, error: 'Не удалось удалить категорию.' }
  }
}
