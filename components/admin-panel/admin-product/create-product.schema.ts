// create-product.schema.ts
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { error: 'Название должно быть от 3 символов' })
    .max(255),
  categoryId: z.number({ error: 'Выберите категорию' }).int().positive(),
  brandId: z.number({ error: 'Выберите бренд' }).int().positive().nullable(),
  isActive: z.boolean().default(true),
})

export type CreateProductInput = z.input<typeof createProductSchema>
export type CreateProductOutput = z.output<typeof createProductSchema>
