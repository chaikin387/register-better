'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

type ActionResult =
  | { success: true; attributeValueId: string }
  | { success: false; error: string }

export async function removeProductAttributeValue(
  productId: string,
  attributeValueId: string
): Promise<ActionResult> {
  try {
    await prisma.productAttributeValue.delete({
      where: { productId_attributeValueId: { productId, attributeValueId } },
    })

    revalidatePath('/admin-panel/products')

    return { success: true, attributeValueId }
  } catch (error) {
    console.error('Ошибка при удалении значения атрибута товара:', error)
    return { success: false, error: 'Не удалось удалить значение.' }
  }
}
