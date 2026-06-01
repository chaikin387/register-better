'use server'

import prisma from '@/lib/prisma'
import {
  adminCategorySelect,
  AdminCategoryTreeSelect,
} from '@/types/admin-category-selects'

/**
 * Получение полного дерева категорий для управления в админке
 */
export async function getAdminCategories(): Promise<AdminCategoryTreeSelect[]> {
  try {
    return await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: 'asc' },
      select: adminCategorySelect,
    })
  } catch (error) {
    console.error('Ошибка при получении дерева категорий:', error)
    return []
  }
}
