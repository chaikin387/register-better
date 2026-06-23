'use server'

import prisma from '@/lib/prisma'
import {
  adminCategoryAttributeSelect,
  AdminCategoryAttributeSelectItem,
} from '@/types/admin-category-attribute'

export async function getAdminCategoryAttributes(
  categoryId: string
): Promise<AdminCategoryAttributeSelectItem[]> {
  try {
    return await prisma.categoryAttribute.findMany({
      where: { categoryId },
      orderBy: { sortOrder: 'asc' },
      select: adminCategoryAttributeSelect,
    })
  } catch (error) {
    console.error(
      `Ошибка при получении атрибутов категории ${categoryId}:`,
      error
    )
    return []
  }
}
