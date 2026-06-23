import { Prisma } from '@/app/generated/prisma/client'

export const adminProductCategoryAttributeSelect = {
  id: true,
  sortOrder: true,
  attribute: {
    select: {
      id: true,
      name: true,
      values: {
        orderBy: { sortOrder: 'asc' as const },
        select: { id: true, value: true },
      },
    },
  },
} satisfies Prisma.CategoryAttributeSelect

export type AdminProductCategoryAttributeItem =
  Prisma.CategoryAttributeGetPayload<{
    select: typeof adminProductCategoryAttributeSelect
  }>
