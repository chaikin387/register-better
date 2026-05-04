import { Prisma } from '@/app/generated/prisma/client'

export const categoryBaseSelect = {
  id: true,
  slug: true,
  name: true,
  icon: true,
} satisfies Prisma.CategorySelect

export const categoryTreeSelect = {
  id: true,
  slug: true,
  name: true,
  icon: true,
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

export type CategoryBase = Prisma.CategoryGetPayload<{
  select: typeof categoryBaseSelect
}>

export type CategoryTree = Prisma.CategoryGetPayload<{
  select: typeof categoryTreeSelect
}>
