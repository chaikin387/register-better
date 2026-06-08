// create-product.schema.ts
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { error: 'Название должно быть от 3 символов' })
    .max(255),
  slug: z
    .string()
    .trim()
    .min(3, { error: 'Slug должен быть от 3 символов' })
    .max(150)
    .regex(/^[a-z0-9-]+$/, {
      error: 'Используйте только строчную латиницу, цифры и дефис',
    }),
  categoryId: z.string({ error: 'Выберите категорию' }),
  brandId: z.string({ error: 'Выберите бренд' }).nullable(),
  isActive: z.boolean().default(true),
})

export type CreateProductInput = z.input<typeof createProductSchema>
export type CreateProductOutput = z.output<typeof createProductSchema>
