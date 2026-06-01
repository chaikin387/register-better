'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import {
  CreateBrandInput,
  CreateBrandOutput,
  createBrandSchema,
} from '@/components/admin-panel/admin-brand/create-brand.schema'
import prisma from '@/lib/prisma'
import {
  adminBrandSelectItem,
  AdminBrandSelectItem,
} from '@/types/admin-brand.selects'

type ActionResult =
  | { success: true; data: AdminBrandSelectItem }
  | { success: false; error: string }

export async function createAdminBrand(
  input: CreateBrandInput
): Promise<ActionResult> {
  try {
    const validatedData: CreateBrandOutput = createBrandSchema.parse(input)

    const brand = await prisma.brand.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
      select: adminBrandSelectItem,
    })

    revalidatePath('/admin-panel/brands')

    return { success: true, data: brand }
  } catch (error) {
    console.error('Ошибка при создании бренда:', error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = error.meta?.target
      if (Array.isArray(target) && target.includes('slug')) {
        return { success: false, error: 'Бренд с таким slug уже существует.' }
      }
    }

    return { success: false, error: 'Не удалось создать бренд.' }
  }
}
