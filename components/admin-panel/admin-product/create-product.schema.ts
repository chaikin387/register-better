import { z } from 'zod'

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { error: 'Название должно быть от 3 символов' })
    .max(255),
  categoryId: z.number({ error: 'Выберите категорию' }).int().positive(),
})

export type CreateProductInput = z.input<typeof createProductSchema>
export type CreateProductOutput = z.output<typeof createProductSchema>
