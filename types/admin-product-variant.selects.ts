import { Prisma } from '@/app/generated/prisma/client'

export const adminProductVariantSelect = {
  id: true,
  sku: true,
  price: true,
  weight: true,
  stock: true,
  isActive: true,
  attributes: {
    select: {
      attributeValueId: true,
      attributeValue: {
        select: {
          id: true,
          value: true,
          attributeId: true,
        },
      },
    },
  },
} satisfies Prisma.ProductVariantSelect

export type AdminProductVariantItem = Prisma.ProductVariantGetPayload<{
  select: typeof adminProductVariantSelect
}>
