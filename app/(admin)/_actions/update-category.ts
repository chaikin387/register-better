'use server'

import { UpdateCategorySchema } from '@/components/admin-panel/admin-catalog/update-category.schema'
import prisma from '@/lib/prisma'
import { adminCategoryTreeSelect } from '@/types/admin-category-selects'

/**
 * Обновление существующей категории в админке
 */
export async function updateAdminCategory(input: UpdateCategorySchema) {
  return prisma.category.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      slug: input.slug,
      isActive: input.isActive,
    },
    select: adminCategoryTreeSelect,
  })
}
