import { Prisma } from '@/app/generated/prisma/client'

export const adminCategorySelect = {
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

export type AdminCategoryTreeSelect = Prisma.CategoryGetPayload<{
  select: typeof adminCategorySelect
}>
