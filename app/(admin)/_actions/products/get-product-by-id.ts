'use server'

import prisma from '@/lib/prisma'
import {
  type AdminProductItemSelect,
  adminProductSelect,
} from '@/types/admin-product-selects'

/**
 * Получение одного товара по ID для админ-панели
 */
export async function getAdminProductById(
  id: number
): Promise<AdminProductItemSelect | null> {
  try {
    return await prisma.product.findUnique({
      where: { id },
      select: adminProductSelect,
    })
  } catch (error) {
    console.error(`Ошибка при получении товара с ID ${id}:`, error)
    return null
  }
}
