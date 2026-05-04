import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'

import { categoriesData } from '@/components/menu-category/categories-data'
import 'dotenv/config'
import { CategorySeed } from '../types/seed-types'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting seed...')

  // Полная очистка
  await prisma.category.deleteMany({})
  console.log('✅ Old categories deleted')

  async function seedCategory(
    cat: CategorySeed,
    parentId?: number
  ): Promise<void> {
    const { children, ...data } = cat

    const record = await prisma.category.create({
      data: {
        slug: data.slug,
        name: data.name,
        icon: data.icon ?? null,
        sortOrder: data.sortOrder,
        parentId: parentId ?? null,
      },
    })

    if (children && children.length > 0) {
      for (const child of children) {
        await seedCategory(child, record.id)
      }
    }
  }

  for (const cat of categoriesData) {
    await seedCategory(cat)
  }

  console.log('✅ Categories seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
