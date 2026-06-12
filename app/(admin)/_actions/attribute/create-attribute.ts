'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import {
  createAttributeSchema,
  type CreateAttributeInput,
  type CreateAttributeOutput,
} from '@/components/admin-panel/admin-attribute/create-attribute.schema'
import prisma from '@/lib/prisma'
import {
  adminAttributeSelect,
  type AdminAttributeSelectItem,
} from '@/types/admin-attribute.selects'

type ActionResult =
  | { success: true; data: AdminAttributeSelectItem }
  | { success: false; error: string }

export async function createAdminAttribute(
  input: CreateAttributeInput
): Promise<ActionResult> {
  try {
    const validatedData: CreateAttributeOutput =
      createAttributeSchema.parse(input)

    const attribute = await prisma.$transaction(async (tx) => {
      const aggregation = await tx.attribute.aggregate({
        _max: { sortOrder: true },
      })

      return tx.attribute.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          sortOrder: (aggregation._max.sortOrder ?? -1) + 1,
        },
        select: adminAttributeSelect,
      })
    })

    revalidatePath('/admin-panel/attributes')

    return { success: true, data: attribute }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'Атрибут с таким названием уже существует.',
      }
    }

    console.error('Ошибка при создании атрибута:', error)
    return { success: false, error: 'Не удалось создать атрибут.' }
  }
}
