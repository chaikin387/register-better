'use server'

import prisma from '@/lib/prisma'
import {
  AdminProductItemSelect,
  adminProductSelect,
} from '@/types/admin-product-selects'

/**
 * Получение списка всех товаров для админ-панели
 */
export async function getAdminProducts(): Promise<AdminProductItemSelect[]> {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      select: adminProductSelect,
    })
  } catch (error) {
    console.error('Ошибка при получении списка товаров:', error)
    return []
  }
}
