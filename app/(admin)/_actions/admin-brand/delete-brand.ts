'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function deleteAdminBrand(id: string): Promise<ActionResult> {
  try {
    const hasProducts = await prisma.product.findFirst({
      where: { brandId: id },
      select: { id: true },
    })

    if (hasProducts) {
      return {
        success: false,
        error: 'Нельзя удалить бренд — к нему привязаны товары.',
      }
    }

    await prisma.brand.delete({ where: { id } })

    revalidatePath('/admin-panel/brands')

    return { success: true, id }
  } catch (error) {
    console.error('Ошибка при удалении бренда:', error)
    return { success: false, error: 'Не удалось удалить бренд.' }
  }
}
