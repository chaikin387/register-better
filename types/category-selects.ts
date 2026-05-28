import { Prisma } from '@/app/generated/prisma/client'

// 1. Для простых карточек категорий (например, популярные на главной)
export const categoryBaseSelect = {
  id: true,
  slug: true,
  name: true,
  icon: true,
  image: true,
} satisfies Prisma.CategorySelect

// 2. Для CatalogMenu в шапке сайта (полные 4 уровня вложенности активных категорий)
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

// 3. Для большой страницы /catalog (корневые + 2 уровня детей для hover-сетки)
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

// 4. Для динамической страницы /catalog/[slug] (категория + предки для крошек + прямые дети)
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

// ── Автоматически сгенерированные типы на основе селектов ────────────────────
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
