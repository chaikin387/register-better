// lib/sku-generator.ts
import prisma from '@/lib/prisma'

export async function generateUniqueSku(): Promise<string> {
  while (true) {
    const sku = Math.floor(10000000 + Math.random() * 90000000).toString()
    const exists = await prisma.productVariant.findUnique({ where: { sku } })
    if (!exists) return sku
  }
}
