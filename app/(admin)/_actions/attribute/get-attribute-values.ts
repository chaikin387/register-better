'use server'

import prisma from '@/lib/prisma'
import {
  adminAttributeValueSelect,
  type AdminAttributeValueSelectItem,
} from '@/types/admin-attribute-value.selects'

export async function getAdminAttributeValues(
  attributeId: string
): Promise<AdminAttributeValueSelectItem[]> {
  try {
    return await prisma.attributeValue.findMany({
      where: { attributeId },
      orderBy: { sortOrder: 'asc' },
      select: adminAttributeValueSelect,
    })
  } catch (error) {
    console.error(
      `Ошибка при получении значений атрибута ${attributeId}:`,
      error
    )
    return []
  }
}
