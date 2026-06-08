// update-product.ts
'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import {
  updateProductSchema,
  type UpdateProductInput,
  type UpdateProductOutput,
} from '@/components/admin-panel/admin-product/update-product.schema'
import prisma from '@/lib/prisma'
import {
  adminProductSelect,
  type AdminProductItemSelect,
} from '@/types/admin-product-selects'

type ActionResult =
  | { success: true; data: AdminProductItemSelect }
  | { success: false; error: string }

export async function updateAdminProduct(
  input: UpdateProductInput
): Promise<ActionResult> {
  try {
    const validatedData: UpdateProductOutput = updateProductSchema.parse(input)

    const updatedProduct = await prisma.product.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        isActive: validatedData.isActive,
        categoryId: validatedData.categoryId,
        brandId: validatedData.brandId ?? null,
      },
      select: adminProductSelect,
    })

    revalidatePath('/admin-panel/products')
    revalidatePath('/')

    return { success: true, data: updatedProduct }
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'Товар с таким названием уже существует в этой категории.',
      }
    }

    return { success: false, error: 'Не удалось обновить товар.' }
  }
}
