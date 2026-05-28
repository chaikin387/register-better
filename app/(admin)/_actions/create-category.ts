'use server'

import { CreateCategorySchema } from '@/components/admin-panel/admin-catalog/create-category.schema'
import prisma from '@/lib/prisma'
import { adminCategoryTreeSelect } from '@/types/admin-category-selects'

/**
 * Создание новой категории в админке
 */
export async function createAdminCategory(
  input: CreateCategorySchema & { parentId: number | null }
) {
  // Декларативно запрашиваем максимальный sortOrder среди детей текущего parentId
  const aggregation = await prisma.category.aggregate({
    where: { parentId: input.parentId },
    _max: { sortOrder: true },
  })

  // Если детей еще нет, _max.sortOrder вернет null. (-1 + 1 = 0)
  const nextSortOrder = (aggregation._max.sortOrder ?? -1) + 1

  return prisma.category.create({
    data: {
      name: input.name,
      slug: input.slug,
      isActive: input.isActive,
      parentId: input.parentId,
      sortOrder: nextSortOrder,
    },
    select: adminCategoryTreeSelect,
  })
}
