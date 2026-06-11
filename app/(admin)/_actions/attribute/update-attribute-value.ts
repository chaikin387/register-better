'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import {
  updateAttributeValueSchema,
  type UpdateAttributeValueInput,
  type UpdateAttributeValueOutput,
} from '@/components/admin-panel/admin-attribute-value/update-attribute-value.schema'
import prisma from '@/lib/prisma'
import {
  adminAttributeValueSelect,
  type AdminAttributeValueSelectItem,
} from '@/types/admin-attribute-value.selects'

type ActionResult =
  | { success: true; data: AdminAttributeValueSelectItem }
  | { success: false; error: string }

export async function updateAdminAttributeValue(
  input: UpdateAttributeValueInput & { attributeId: string }
): Promise<ActionResult> {
  try {
    const validatedData: UpdateAttributeValueOutput =
      updateAttributeValueSchema.parse(input)

    const attributeValue = await prisma.attributeValue.update({
      where: { id: validatedData.id },
      data: {
        value: validatedData.value,
        slug: validatedData.slug,
      },
      select: adminAttributeValueSelect,
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
        error: 'Значение с таким названием уже существует.',
      }
    }

    console.error('Ошибка при обновлении значения атрибута:', error)
    return { success: false, error: 'Не удалось обновить значение.' }
  }
}
