import { Prisma } from '@/app/generated/prisma/client'

// ── Для CategoryCard — минимальный набор полей ────────────────────────────────
export const categoryBaseSelect = {
  id: true,
  slug: true,
  name: true,
  icon: true,
  image: true,
} satisfies Prisma.CategorySelect

// ── Для CatalogMenu — 4 уровня вложенности ───────────────────────────────────
export const categoryTreeSelect = {
  id: true,
  slug: true,
  name: true,
  icon: true,
  image: true,
  sortOrder: true,
  children: {
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      sortOrder: true,
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          slug: true,
          name: true,
          sortOrder: true,
          children: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              slug: true,
              name: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CategorySelect

// ── Для страницы /catalog — корневые + 2 уровня детей (hover эффект) ──────────
export const categoryCatalogSelect = {
  id: true,
  slug: true,
  name: true,
  icon: true,
  image: true,
  children: {
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.CategorySelect

// ── Для страницы /catalog/[slug] — категория + предки + дети ─────────────────
export const categoryPageSelect = {
  id: true,
  slug: true,
  name: true,
  icon: true,
  image: true,
  parentId: true,
  parent: {
    select: {
      id: true,
      slug: true,
      name: true,
      parent: {
        select: {
          id: true,
          slug: true,
          name: true,
          parent: {
            select: {
              id: true,
              slug: true,
              name: true,
              parent: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  },
  children: {
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, slug: true, name: true, image: true, icon: true },
  },
} satisfies Prisma.CategorySelect

// ── Типы ─────────────────────────────────────────────────────────────────────
export type CategoryBase = Prisma.CategoryGetPayload<{
  select: typeof categoryBaseSelect
}>

export type CategoryTree = Prisma.CategoryGetPayload<{
  select: typeof categoryTreeSelect
}>

export type CategoryCatalog = Prisma.CategoryGetPayload<{
  select: typeof categoryCatalogSelect
}>

export type CategoryPage = Prisma.CategoryGetPayload<{
  select: typeof categoryPageSelect
}>
