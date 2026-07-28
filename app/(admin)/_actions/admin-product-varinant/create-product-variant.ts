'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'
import { generateUniqueSku } from '@/lib/sku-generator'
import {
  AdminProductVariantItem,
  adminProductVariantSelect,
} from '@/types/admin-product-variant.selects'

type ActionResult =
  | { success: true; data: AdminProductVariantItem }
  | { success: false; error: string }

export async function createProductVariant(
  productId: string,
  attributeValueIds: string[],
  price: number,
  weight: number
): Promise<ActionResult> {
  try {
    const sku = await generateUniqueSku()

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        sku,
        price,
        weight,
        stock: 0,
        attributes: {
          create: attributeValueIds.map((attributeValueId) => ({
            attributeValueId,
          })),
        },
      },
      select: adminProductVariantSelect,
    })

    revalidatePath('/admin-panel/products')

    return { success: true, data: variant }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return { success: false, error: 'Такой вариант уже существует.' }
    }

    console.error('Ошибка при создании варианта:', error)
    return { success: false, error: 'Не удалось создать вариант.' }
  }
}
