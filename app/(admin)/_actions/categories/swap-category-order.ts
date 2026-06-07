'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function swapCategoryOrder(
  idA: number,
  sortOrderA: number,
  idB: number,
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
