'use server'

import prisma from '@/lib/prisma'
import {
  categoryCatalogSelect,
  categoryPageSelect,
  categoryTreeSelect,
} from '@/types/category-selects'

/**
 * Получение облегченного дерева для CatalogMenu в шапке (до 4-х уровней)
 */
export async function getCategoryTree() {
  return prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: categoryTreeSelect,
  })
}

/**
 * Получение структуры для главной страницы каталога /catalog
 */
export async function getCategoryCatalog() {
  return prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: categoryCatalogSelect,
  })
}

/**
 * Получение конкретной категории по слагу для страницы /catalog/[slug]
 */
export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug, isActive: true },
    select: categoryPageSelect,
  })
}
