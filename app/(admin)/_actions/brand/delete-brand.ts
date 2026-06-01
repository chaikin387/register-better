'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

type ActionResult =
  | { success: true; id: number }
  | { success: false; error: string }

export async function deleteAdminBrand(id: number): Promise<ActionResult> {
  try {
    const hasProducts = await prisma.product.findFirst({
      where: { brandId: id },
      select: { id: true },
    })

    if (hasProducts) {
      return {
        success: false,
        error: 'Нельзя удалить бренд, к которому привязаны товары.',
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
