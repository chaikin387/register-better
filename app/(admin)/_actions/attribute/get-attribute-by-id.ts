'use server'

import prisma from '@/lib/prisma'
import {
  adminAttributeSelect,
  type AdminAttributeSelectItem,
} from '@/types/admin-attribute.selects'

export async function getAdminAttributeById(
  id: string
): Promise<AdminAttributeSelectItem | null> {
  try {
    return await prisma.attribute.findUnique({
      where: { id },
      select: adminAttributeSelect,
    })
  } catch (error) {
    console.error(`Ошибка при получении атрибута ${id}:`, error)
    return null
  }
}
