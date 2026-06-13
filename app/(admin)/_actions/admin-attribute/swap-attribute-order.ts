'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function swapAttributeOrder(
  idA: string,
  sortOrderA: number,
  idB: string,
  sortOrderB: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.$transaction([
      prisma.attribute.update({
        where: { id: idA },
        data: { sortOrder: sortOrderB },
      }),
      prisma.attribute.update({
        where: { id: idB },
        data: { sortOrder: sortOrderA },
      }),
    ])

    revalidatePath('/admin-panel/attributes')

    return { success: true }
  } catch {
    return { success: false, error: 'Не удалось изменить порядок атрибутов.' }
  }
}
