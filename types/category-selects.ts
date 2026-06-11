import { Prisma } from '@/app/generated/prisma/client'

// 1. Для карточки категории в каталоге
export const categoryCardSelect = {
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
        select: {
          id: true,
        },
      },
    },
  },
} satisfies Prisma.CategorySelect

// 2. Для CatalogMenu в Header (полные 4 уровня вложенности активных категорий)
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

// 4. Для динамической страницы /catalog/[slug]
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
    select: {
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
            select: {
              id: true,
            },
          },
        },
      },
    },
  },
  products: {
    where: { isActive: true },
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.CategorySelect

export type CategoryCardSelect = Prisma.CategoryGetPayload<{
  select: typeof categoryCardSelect
}>

export type CategoryTreeSelect = Prisma.CategoryGetPayload<{
  select: typeof categoryTreeSelect
}>

export type CategoryCatalogSelect = Prisma.CategoryGetPayload<{
  select: typeof categoryCatalogSelect
}>

export type CategoryPageSelect = Prisma.CategoryGetPayload<{
  select: typeof categoryPageSelect
}>
