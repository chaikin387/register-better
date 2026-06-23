'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'
import {
  adminCategoryAttributeSelect,
  type AdminCategoryAttributeSelectItem,
} from '@/types/admin-category-attribute'

type ActionResult =
  | { success: true; data: AdminCategoryAttributeSelectItem[] }
  | { success: false; error: string }

export async function swapCategoryAttributeOrder(
  idA: string,
  sortOrderA: number,
  idB: string,
  sortOrderB: number,
  categoryId: string
): Promise<ActionResult> {
  try {
    await prisma.$transaction([
      prisma.categoryAttribute.update({
        where: { id: idA },
        data: { sortOrder: sortOrderB },
      }),
      prisma.categoryAttribute.update({
        where: { id: idB },
        data: { sortOrder: sortOrderA },
      }),
    ])

    const data = await prisma.categoryAttribute.findMany({
      where: { categoryId },
      orderBy: { sortOrder: 'asc' },
      select: adminCategoryAttributeSelect,
    })

    revalidatePath('/admin-panel/categories')

    return { success: true, data }
  } catch (error) {
    console.error('Ошибка при изменении порядка атрибутов категории:', error)
    return { success: false, error: 'Не удалось изменить порядок атрибутов.' }
  }
}
