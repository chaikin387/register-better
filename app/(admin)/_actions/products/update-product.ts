'use server'

import { revalidatePath } from 'next/cache'

import {
  updateProductSchema,
  type UpdateProductInput,
  type UpdateProductOutput,
} from '@/components/admin-panel/admin-product/update-product.schema'
import prisma from '@/lib/prisma'

import { generateProductSlug } from '@/lib/slugify-generator'
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
        slug: generateProductSlug(validatedData.name, validatedData.id),
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
    return { success: false, error: 'Не удалось обновить товар.' }
  }
}
