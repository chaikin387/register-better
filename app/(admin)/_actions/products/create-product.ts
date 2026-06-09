// create-product.ts
'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import {
  createProductSchema,
  type CreateProductInput,
  type CreateProductOutput,
} from '@/components/admin-panel/admin-product/create-product.schema'
import prisma from '@/lib/prisma'
import { generateUniqueSku } from '@/lib/sku-generator'
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
      const sku = await generateUniqueSku()

      const { id } = await tx.product.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          isActive: validatedData.isActive,
          categoryId: validatedData.categoryId,
          brandId: validatedData.brandId ?? null,
        },
        select: { id: true },
      })

      await tx.productVariant.create({
        data: {
          productId: id,
          sku,
          price: validatedData.price,
          weight: validatedData.weight,
          stock: 0,
        },
      })

      return tx.product.findUniqueOrThrow({
        where: { id },
        select: adminProductSelect,
      })
    })

    revalidatePath('/admin-panel/products')
    revalidatePath('/')

    return { success: true, data: product }
  } catch (error) {
    console.error('Ошибка при создании товара:', error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'Товар с таким названием уже существует в этой категории.',
      }
    }

    return { success: false, error: 'Не удалось создать товар.' }
  }
}
