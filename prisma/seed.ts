import { categoriesData } from '@/components/sheet-catalog/categories-data'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'
import type { CategorySeed } from '../types/seed-types'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

// ── Рекурсивная вставка категории и её детей ──────────────────────────────────
async function seedCategory(
  cat: CategorySeed,
  parentId?: number
): Promise<void> {
  const { children, ...data } = cat

  const record = await prisma.category.create({
    data: { ...data, parentId: parentId ?? null },
  })

  console.log(`  ✓ ${' '.repeat(parentId ? 2 : 0)}${record.name}`)

  for (const child of children ?? []) {
    await seedCategory(child, record.id)
  }
}

// ── Основная функция ──────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log('🌱 Запуск сидирования...\n')

  console.log('🗑️  Очистка старых категорий...')
  await prisma.category.deleteMany()
  console.log('✓  Категории удалены\n')

  console.log('📂 Вставка категорий:')
  for (const cat of categoriesData) {
    await seedCategory(cat)
  }

  const total = await prisma.category.count()
  console.log(`\n✅ Готово — вставлено ${total} категорий`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сидирования:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
