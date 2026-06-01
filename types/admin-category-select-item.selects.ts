import { Prisma } from '@/app/generated/prisma/client'

export const adminCategorySelectTree = {
  id: true,
  name: true,
  children: {
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      children: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          name: true,
          children: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CategorySelect

export type AdminCategorySelectItem = Prisma.CategoryGetPayload<{
  select: typeof adminCategorySelectTree
}>
