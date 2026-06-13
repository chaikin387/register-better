'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function deleteAdminProduct(id: string): Promise<ActionResult> {
  try {
    await prisma.product.delete({ where: { id } })

    revalidatePath('/admin-panel/products')
    revalidatePath('/')

    return { success: true, id }
  } catch (error) {
    console.error('Ошибка при удалении товара:', error)
    return { success: false, error: 'Не удалось удалить товар.' }
  }
}
