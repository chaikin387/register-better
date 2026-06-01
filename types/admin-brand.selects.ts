import { Prisma } from '@/app/generated/prisma/client'

export const adminBrandSelectItem = {
  id: true,
  name: true,
  slug: true,
  isActive: true,
  createdAt: true,
} satisfies Prisma.BrandSelect

export type AdminBrandSelectItem = Prisma.BrandGetPayload<{
  select: typeof adminBrandSelectItem
}>
