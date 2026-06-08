'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

export async function swapCategoryOrder(
  idA: string,
  sortOrderA: number,
  idB: string,
  sortOrderB: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.$transaction([
      prisma.category.update({
        where: { id: idA },
        data: { sortOrder: sortOrderB },
      }),
      prisma.category.update({
        where: { id: idB },
        data: { sortOrder: sortOrderA },
      }),
    ])

    revalidatePath('/admin-panel/categories')
    revalidatePath('/')

    return { success: true }
  } catch {
    return { success: false, error: 'Не удалось изменить порядок.' }
  }
}
