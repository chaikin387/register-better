'use server'

import prisma from '@/lib/prisma'
import {
  adminBrandSelectItem,
  AdminBrandSelectItem,
} from '@/types/admin-brand.selects'

export async function getAdminBrands(): Promise<AdminBrandSelectItem[]> {
  try {
    return await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: adminBrandSelectItem,
    })
  } catch (error) {
    console.error('Ошибка при получении брендов:', error)
    return []
  }
}
