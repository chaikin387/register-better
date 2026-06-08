'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function deleteAdminProduct(id: string): Promise<ActionResult> {
  try {
    // 1. Проверяем, есть ли этот товар или его варианты в оформленных заказах (защита данных)
    // Если у тебя есть таблица OrderItem или подобная, раскомментируй эту проверку:
    /*
    const hasOrders = await prisma.orderItem.findFirst({
      where: {
        productVariant: { productId: id }
      },
      select: { id: true }
    })

    if (hasOrders) {
      return {
        success: false,
        error: 'Нельзя удалить товар, который уже фигурирует в заказах. Лучше отключите его активность.',
      }
    }
    */

    await prisma.$transaction(async (tx) => {
      await tx.productVariant.deleteMany({
        where: { productId: id },
      })

      await tx.product.delete({
        where: { id },
      })
    })

    revalidatePath('/admin-panel/products')
    revalidatePath('/')

    return { success: true, id }
  } catch (error) {
    console.error('Ошибка при удалении товара:', error)
    return { success: false, error: 'Не удалось удалить товар.' }
  }
}
