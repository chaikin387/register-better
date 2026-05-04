import prisma from '@/lib/prisma'
import { CategoryTree, categoryTreeSelect } from './category-selects'

export async function getCatalogMenu(): Promise<CategoryTree[]> {
  return prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: categoryTreeSelect,
  })
}
