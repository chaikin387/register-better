'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function swapAttributeValueOrder(
  idA: string,
  sortOrderA: number,
  idB: string,
  sortOrderB: number,
  attributeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.$transaction([
      prisma.attributeValue.update({
        where: { id: idA },
        data: { sortOrder: sortOrderB },
      }),
      prisma.attributeValue.update({
        where: { id: idB },
        data: { sortOrder: sortOrderA },
      }),
    ])

    revalidatePath(`/admin-panel/attributes/${attributeId}`)
    revalidatePath('/')

    return { success: true }
  } catch {
    return { success: false, error: 'Не удалось изменить порядок значений.' }
  }
}
