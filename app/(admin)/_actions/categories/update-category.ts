'use server'

import { Prisma } from '@/app/generated/prisma/client'
import {
  updateCategorySchema,
  type UpdateCategoryInput,
  type UpdateCategoryOutput,
} from '@/components/admin-panel/admin-category/update-category.schema'
import prisma from '@/lib/prisma'
import {
  adminCategorySelect,
  AdminCategoryTreeSelect,
} from '@/types/admin-category-selects'

import { revalidatePath } from 'next/cache'

type ActionResult =
  | { success: true; data: AdminCategoryTreeSelect }
  | { success: false; error: string }

export async function updateAdminCategory(
  input: UpdateCategoryInput
): Promise<ActionResult> {
  try {
    const validatedData: UpdateCategoryOutput =
      updateCategorySchema.parse(input)

    const updatedCategory = await prisma.category.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        isActive: validatedData.isActive,
      },
      select: adminCategorySelect,
    })

    revalidatePath('/admin-panel/categories')
    revalidatePath('/')

    return { success: true, data: updatedCategory }
  } catch (error) {
    console.error('Ошибка при обновлении категории:', error)

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

    return { success: false, error: 'Не удалось обновить категорию.' }
  }
}
