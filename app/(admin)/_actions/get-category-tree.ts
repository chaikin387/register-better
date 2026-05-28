'use server'

import prisma from '@/lib/prisma'
import { adminCategoryTreeSelect } from '@/types/admin-category-selects'

/**
 * Получение полного дерева категорий для управления в админке
 */
export async function getAdminCategoriesTree() {
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: 'asc' },
    select: adminCategoryTreeSelect,
  })
}
