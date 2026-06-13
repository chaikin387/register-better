import { Prisma } from '@/app/generated/prisma/client'

const categoryAttributeCount = {
  _count: {
    select: { categoryAttributes: true },
  },
} as const

export const adminCategorySelect = {
  id: true,
  slug: true,
  name: true,
  icon: true,
  image: true,
  isActive: true,
  sortOrder: true,
  parentId: true,
  ...categoryAttributeCount,
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
      ...categoryAttributeCount,
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
          ...categoryAttributeCount,
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
              ...categoryAttributeCount,
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
