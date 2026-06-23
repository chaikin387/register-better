'use server'

import prisma from '@/lib/prisma'
import {
  AdminProductCategoryAttributeItem,
  adminProductCategoryAttributeSelect,
} from '@/types/admin-product-category-attribute.selects'

export async function getAdminProductCategoryAttribute(
  categoryId: string
): Promise<AdminProductCategoryAttributeItem[]> {
  try {
    return await prisma.categoryAttribute.findMany({
      where: { categoryId },
      orderBy: { sortOrder: 'asc' },
      select: adminProductCategoryAttributeSelect,
    })
  } catch (error) {
    console.error(error)
    return []
  }
}
