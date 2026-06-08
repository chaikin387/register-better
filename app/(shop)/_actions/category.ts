'use server'

import prisma from '@/lib/prisma'
import {
  categoryCatalogSelect,
  categoryPageSelect,
  categoryTreeSelect,
} from '@/types/category-selects'

export async function getCategoryTree() {
  return prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: categoryTreeSelect,
  })
}

export async function getCategoryCatalog() {
  return prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: categoryCatalogSelect,
  })
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id, isActive: true },
    select: categoryPageSelect,
  })
}
