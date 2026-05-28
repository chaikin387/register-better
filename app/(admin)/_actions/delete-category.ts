'use server'

import prisma from '@/lib/prisma'

export async function deleteAdminCategory(id: number) {
  // 1. Проверяем, есть ли подкатегории
  const hasChildren = await prisma.category.findFirst({
    where: { parentId: id },
  })

  if (hasChildren) {
    throw new Error('Нельзя удалить категорию, содержащую подкатегории.')
  }

  // 2. Проверяем, есть ли привязанные товары (если таблица Product уже есть)
  // const hasProducts = await prisma.product.findFirst({ where: { categoryId: id } })
  // if (hasProducts) throw new Error('Нельзя удалить категорию, к которой привязаны товары.')

  // 3. Если всё чисто — удаляем
  await prisma.category.delete({
    where: { id },
  })

  return { success: true, id }
}
