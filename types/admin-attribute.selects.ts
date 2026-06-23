import { Prisma } from '@/app/generated/prisma/client'

export const adminAttributeSelect = {
  id: true,
  name: true,
  slug: true,
  sortOrder: true,
  createdAt: true,
  values: {
    select: { value: true },
    orderBy: { sortOrder: 'asc' },
  },
  _count: {
    select: { values: true },
  },
} satisfies Prisma.AttributeSelect

export type AdminAttributeSelectItem = Prisma.AttributeGetPayload<{
  select: typeof adminAttributeSelect
}>
