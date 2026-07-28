'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function deleteProductVariant(id: string): Promise<ActionResult> {
  try {
    await prisma.productVariant.delete({ where: { id } })

    revalidatePath('/admin-panel/products')

    return { success: true, id }
  } catch (error) {
    console.error('Ошибка при удалении варианта:', error)
    return { success: false, error: 'Не удалось удалить вариант.' }
  }
}
