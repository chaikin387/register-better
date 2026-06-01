import { Prisma } from '@/app/generated/prisma/client'

export const adminProductSelect = {
  id: true,
  slug: true,
  name: true,
  isActive: true,
  createdAt: true,

  category: {
    select: {
      id: true,
      name: true,
    },
  },

  brand: {
    select: {
      id: true,
      name: true,
    },
  },

  variants: {
    select: {
      id: true,
      sku: true,
      price: true,
      stock: true,
      isActive: true,
    },
  },
} satisfies Prisma.ProductSelect

export type AdminProductItemSelect = Prisma.ProductGetPayload<{
  select: typeof adminProductSelect
}>
