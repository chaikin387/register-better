'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import {
  updateBrandSchema,
  type UpdateBrandInput,
  type UpdateBrandOutput,
} from '@/components/admin-panel/admin-brand/update-brand.schema'
import prisma from '@/lib/prisma'
import {
  adminBrandSelectItem,
  type AdminBrandSelectItem,
} from '@/types/admin-brand.selects'

type ActionResult =
  | { success: true; data: AdminBrandSelectItem }
  | { success: false; error: string }

export async function updateAdminBrand(
  input: UpdateBrandInput
): Promise<ActionResult> {
  try {
    const validatedData: UpdateBrandOutput = updateBrandSchema.parse(input)

    const brand = await prisma.brand.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        isActive: validatedData.isActive,
      },
      select: adminBrandSelectItem,
    })

    revalidatePath('/admin-panel/brands')
    revalidatePath('/')

    return { success: true, data: brand }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'Бренд с таким названием уже существует.',
      }
    }

    console.error('Ошибка при обновлении бренда:', error)
    return { success: false, error: 'Не удалось обновить бренд.' }
  }
}
