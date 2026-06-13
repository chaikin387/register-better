import { Prisma } from '@/app/generated/prisma/client'

export const adminCategoryAttributeSelect = {
  id: true,
  sortOrder: true,
  attribute: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.CategoryAttributeSelect

export type AdminCategoryAttributeSelectItem =
  Prisma.CategoryAttributeGetPayload<{
    select: typeof adminCategoryAttributeSelect
  }>
