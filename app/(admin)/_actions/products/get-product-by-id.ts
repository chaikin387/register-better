'use server'

import prisma from '@/lib/prisma'
import {
  type AdminProductItemSelect,
  adminProductSelect,
} from '@/types/admin-product-selects'

export async function getAdminProductById(
  id: string
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
