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

    return { success: true, data: brand }
  } catch (error) {
    console.error('Ошибка при обновлении бренда:', error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = error.meta?.target
      if (Array.isArray(target) && target.includes('slug')) {
        return { success: false, error: 'Бренд с таким slug уже существует.' }
      }
    }

    return { success: false, error: 'Не удалось обновить бренд.' }
  }
}
