'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import {
  createCategorySchema,
  type CreateCategoryInput,
  type CreateCategoryOutput,
} from '@/components/admin-panel/admin-category/create-category.schema'
import prisma from '@/lib/prisma'
import {
  adminCategorySelect,
  type AdminCategoryTreeSelect,
} from '@/types/admin-category-selects'

type ActionResult =
  | { success: true; data: AdminCategoryTreeSelect }
  | { success: false; error: string }

export async function createAdminCategory(
  input: CreateCategoryInput & { parentId: string | null }
): Promise<ActionResult> {
  try {
    const validatedData: CreateCategoryOutput =
      createCategorySchema.parse(input)

    const newCategory = await prisma.$transaction(async (tx) => {
      const aggregation = await tx.category.aggregate({
        where: { parentId: input.parentId },
        _max: { sortOrder: true },
      })

      return tx.category.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          isActive: validatedData.isActive,
          parentId: input.parentId,
          sortOrder: (aggregation._max.sortOrder ?? -1) + 1,
        },
        select: adminCategorySelect,
      })
    })

    revalidatePath('/admin-panel/categories')
    revalidatePath('/')

    return { success: true, data: newCategory }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'Категория с таким названием уже существует в этом разделе.',
      }
    }

    console.error('Ошибка при создании категории:', error)
    return { success: false, error: 'Не удалось создать категорию.' }
  }
}
