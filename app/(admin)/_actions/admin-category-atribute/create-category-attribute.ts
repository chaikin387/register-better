'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'
import {
  adminCategoryAttributeSelect,
  type AdminCategoryAttributeSelectItem,
} from '@/types/admin-category-attribute'

type ActionResult =
  | { success: true; data: AdminCategoryAttributeSelectItem }
  | { success: false; error: string }

export async function createAdminCategoryAttribute(
  categoryId: string,
  attributeId: string
): Promise<ActionResult> {
  try {
    const newCategoryAttribute = await prisma.$transaction(async (tx) => {
      const aggregation = await tx.categoryAttribute.aggregate({
        where: { categoryId },
        _max: { sortOrder: true },
      })

      return tx.categoryAttribute.create({
        data: {
          categoryId,
          attributeId,
          sortOrder: (aggregation._max.sortOrder ?? -1) + 1,
        },
        select: adminCategoryAttributeSelect,
      })
    })

    revalidatePath('/admin-panel/categories')
    revalidatePath('/')

    return { success: true, data: newCategoryAttribute }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'Этот атрибут уже привязан к данной категории.',
      }
    }

    console.error('Ошибка при добавлении атрибута к категории:', error)
    return { success: false, error: 'Не удалось добавить атрибут.' }
  }
}
