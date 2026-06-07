// @/app/(admin)/_actions/categories/create-category.ts
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
  input: CreateCategoryInput & { parentId: number | null }
): Promise<ActionResult> {
  try {
    const validatedData: CreateCategoryOutput =
      createCategorySchema.parse(input)

    const newCategory = await prisma.$transaction(async (tx) => {
      const aggregation = await tx.category.aggregate({
        where: { parentId: input.parentId },
        _max: { sortOrder: true },
      })

      const nextSortOrder = (aggregation._max.sortOrder ?? -1) + 1

      return tx.category.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          isActive: validatedData.isActive,
          parentId: input.parentId,
          sortOrder: nextSortOrder,
        },
        select: adminCategorySelect,
      })
    })

    revalidatePath('/admin-panel/categories')
    revalidatePath('/')

    return { success: true, data: newCategory }
  } catch (error) {
    console.error('Ошибка при создании категории:', error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = error.meta?.target
      if (Array.isArray(target) && target.includes('slug')) {
        return {
          success: false,
          error: 'Категория с таким slug уже существует.',
        }
      }
    }

    return { success: false, error: 'Не удалось создать категорию.' }
  }
}
