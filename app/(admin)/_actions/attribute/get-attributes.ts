'use server'

import prisma from '@/lib/prisma'
import {
  adminAttributeSelect,
  type AdminAttributeSelectItem,
} from '@/types/admin-attribute.selects'

export async function getAdminAttributes(): Promise<
  AdminAttributeSelectItem[]
> {
  try {
    return await prisma.attribute.findMany({
      orderBy: { name: 'asc' },
      select: adminAttributeSelect,
    })
  } catch (error) {
    console.error('Ошибка при получении атрибутов:', error)
    return []
  }
}
