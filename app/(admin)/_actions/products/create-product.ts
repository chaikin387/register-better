'use server'

import { revalidatePath } from 'next/cache'

import {
  createProductSchema,
  type CreateProductInput,
  type CreateProductOutput,
} from '@/components/admin-panel/admin-product/create-product.schema'
import prisma from '@/lib/prisma'
import { generateSku } from '@/lib/sku-generator'

import { generateProductSlug } from '@/lib/slugify-generator'
import {
  adminProductSelect,
  type AdminProductItemSelect,
} from '@/types/admin-product-selects'

type ActionResult =
  | { success: true; data: AdminProductItemSelect }
  | { success: false; error: string }

export async function createAdminProduct(
  input: CreateProductInput
): Promise<ActionResult> {
  try {
    const validatedData: CreateProductOutput = createProductSchema.parse(input)

    const product = await prisma.$transaction(async (tx) => {
      const { id } = await tx.product.create({
        data: {
          name: validatedData.name,
          slug: crypto.randomUUID(),
          isActive: validatedData.isActive,
          categoryId: validatedData.categoryId,
          brandId: validatedData.brandId ?? null,
        },
        select: { id: true },
      })

      await tx.productVariant.create({
        data: {
          productId: id,
          sku: generateSku(id),
          price: 0,
          stock: 0,
        },
      })

      return tx.product.update({
        where: { id },
        data: { slug: generateProductSlug(validatedData.name, id) },
        select: adminProductSelect,
      })
    })

    revalidatePath('/admin-panel/products')

    return { success: true, data: product }
  } catch (error) {
    console.error('Ошибка при создании товара:', error)
    return { success: false, error: 'Не удалось создать товар.' }
  }
}
