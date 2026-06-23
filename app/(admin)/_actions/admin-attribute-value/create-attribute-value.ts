'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import {
  createAttributeValueSchema,
  type CreateAttributeValueInput,
  type CreateAttributeValueOutput,
} from '@/components/admin-panel/admin-attribute-value/create-attribute-value.schema'
import prisma from '@/lib/prisma'
import {
  adminAttributeValueSelect,
  type AdminAttributeValueSelectItem,
} from '@/types/admin-attribute-value.selects'

type ActionResult =
  | { success: true; data: AdminAttributeValueSelectItem }
  | { success: false; error: string }

export async function createAdminAttributeValue(
  input: CreateAttributeValueInput & { attributeId: string }
): Promise<ActionResult> {
  try {
    const validatedData: CreateAttributeValueOutput =
      createAttributeValueSchema.parse(input)

    const attributeValue = await prisma.$transaction(async (tx) => {
      const aggregation = await tx.attributeValue.aggregate({
        where: { attributeId: input.attributeId },
        _max: { sortOrder: true },
      })

      return tx.attributeValue.create({
        data: {
          value: validatedData.value,
          slug: validatedData.slug,
          attributeId: input.attributeId,
          sortOrder: (aggregation._max.sortOrder ?? -1) + 1,
        },
        select: adminAttributeValueSelect,
      })
    })

    revalidatePath(`/admin-panel/attributes/${input.attributeId}`)

    return { success: true, data: attributeValue }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error:
          'Значение с таким названием или slug уже существует для этого атрибута.',
      }
    }

    console.error('Ошибка при создании значения атрибута:', error)
    return { success: false, error: 'Не удалось создать значение.' }
  }
}
