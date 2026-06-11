import { Prisma } from '@/app/generated/prisma/client'

export const adminAttributeValueSelect = {
  id: true,
  value: true,
  slug: true,
  attributeId: true,
  sortOrder: true,
} satisfies Prisma.AttributeValueSelect

export type AdminAttributeValueSelectItem = Prisma.AttributeValueGetPayload<{
  select: typeof adminAttributeValueSelect
}>
