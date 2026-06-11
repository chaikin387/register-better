'use server'

import { Prisma } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

import {
  updateAttributeSchema,
  type UpdateAttributeInput,
  type UpdateAttributeOutput,
} from '@/components/admin-panel/admin-attribute/update-attribute.schema'
import prisma from '@/lib/prisma'
import {
  adminAttributeSelect,
  type AdminAttributeSelectItem,
} from '@/types/admin-attribute.selects'

type ActionResult =
  | { success: true; data: AdminAttributeSelectItem }
  | { success: false; error: string }

export async function updateAdminAttribute(
  input: UpdateAttributeInput
): Promise<ActionResult> {
  try {
    const validatedData: UpdateAttributeOutput =
      updateAttributeSchema.parse(input)

    const attribute = await prisma.attribute.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
      select: adminAttributeSelect,
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

    console.error('Ошибка при обновлении атрибута:', error)
    return { success: false, error: 'Не удалось обновить атрибут.' }
  }
}
