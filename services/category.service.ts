import prisma from '@/lib/prisma'
import {
  categoryCatalogSelect,
  categoryPageSelect,
  categoryTreeSelect,
  type CategoryCatalog,
  type CategoryPage,
  type CategoryTree,
} from '@/types/category-selects'

export async function getCategoriesMenu(): Promise<CategoryTree[]> {
  return prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: categoryTreeSelect,
  })
}

export async function getCategoriesCatalog(): Promise<CategoryCatalog[]> {
  return prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: categoryCatalogSelect,
  })
}

export async function getCategoryBySlug(
  slug: string
): Promise<CategoryPage | null> {
  return prisma.category.findUnique({
    where: { slug, isActive: true },
    select: categoryPageSelect,
  })
}
