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
      slug: true,
      name: true,
      parent: {
        select: {
          id: true,
          slug: true,
          name: true,
          parent: {
            select: {
              id: true,
              slug: true,
              name: true,
              parent: {
                select: { id: true, slug: true, name: true },
              },
            },
          },
        },
      },
    },
  },

  brand: {
    select: { id: true, name: true },
  },

  variants: {
    select: {
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
    },
  },

  attributes: {
    select: {
      attributeValueId: true,
      attributeValue: {
        select: {
          id: true,
          value: true,
          attributeId: true,
          attribute: { select: { id: true, name: true } },
        },
      },
    },
  },

  _count: {
    select: { attributes: true },
  },
} satisfies Prisma.ProductSelect

export type AdminProductItemSelect = Prisma.ProductGetPayload<{
  select: typeof adminProductSelect
}>
