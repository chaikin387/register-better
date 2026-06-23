import { Prisma } from '@/app/generated/prisma/client'

const categoryAttributesPreview = {
  _count: { select: { categoryAttributes: true } },
  categoryAttributes: {
    orderBy: { sortOrder: 'asc' as const },
    select: { attribute: { select: { name: true } } },
  },
} as const

const level4 = {
  id: true,
  slug: true,
  name: true,
  icon: true,
  image: true,
  isActive: true,
  sortOrder: true,
  parentId: true,
  ...categoryAttributesPreview,
} as const

export const adminCategorySelect = {
  ...level4,
  children: {
    orderBy: { sortOrder: 'asc' as const },
    select: {
      ...level4,
      children: {
        orderBy: { sortOrder: 'asc' as const },
        select: {
          ...level4,
          children: {
            orderBy: { sortOrder: 'asc' as const },
            select: level4,
          },
        },
      },
    },
  },
} satisfies Prisma.CategorySelect

export type AdminCategoryTreeSelect = Prisma.CategoryGetPayload<{
  select: typeof adminCategorySelect
}>
