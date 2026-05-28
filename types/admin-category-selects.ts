import { Prisma } from '@/app/generated/prisma/client'

// Полное дерево категорий для управления структурой (БЕЗ фильтрации isActive)
export const adminCategoryTreeSelect = {
  id: true,
  slug: true,
  name: true,
  icon: true,
  image: true,
  isActive: true,
  sortOrder: true,
  parentId: true,
  children: {
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      icon: true,
      image: true,
      isActive: true,
      sortOrder: true,
      parentId: true,
      children: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          slug: true,
          name: true,
          icon: true,
          image: true,
          isActive: true,
          sortOrder: true,
          parentId: true,
          children: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              slug: true,
              name: true,
              icon: true,
              image: true,
              isActive: true,
              sortOrder: true,
              parentId: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CategorySelect

// Тип генерируется автоматически по селекту и идеально подходит для рекурсивного стейта
export type AdminCategoryTree = Prisma.CategoryGetPayload<{
  select: typeof adminCategoryTreeSelect
}>
