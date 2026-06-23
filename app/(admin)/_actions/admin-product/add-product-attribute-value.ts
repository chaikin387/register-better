'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

type ActionResult =
  | { success: true; attributeValueId: string }
  | { success: false; error: string }

export async function addProductAttributeValue(
  productId: string,
  attributeValueId: string
): Promise<ActionResult> {
  try {
    await prisma.productAttributeValue.create({
      data: { productId, attributeValueId },
    })

    revalidatePath('/admin-panel/products')

    return { success: true, attributeValueId }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return { success: false, error: 'Это значение уже добавлено к товару.' }
    }

    console.error('Ошибка при добавлении значения атрибута к товару:', error)
    return { success: false, error: 'Не удалось добавить значение.' }
  }
}
