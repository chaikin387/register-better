// @/app/(admin)/_actions/brands/create-brand.ts
'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import {
  createBrandSchema,
  type CreateBrandInput,
  type CreateBrandOutput,
} from '@/components/admin-panel/admin-brand/create-brand.schema'
import prisma from '@/lib/prisma'
import {
  adminBrandSelectItem,
  type AdminBrandSelectItem,
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
        isActive: validatedData.isActive,
      },
      select: adminBrandSelectItem,
    })

    revalidatePath('/admin-panel/brands')
    revalidatePath('/')

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
