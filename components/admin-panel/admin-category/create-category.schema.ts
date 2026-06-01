// create-category.schema.ts
import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Введите название категории' })
    .min(2, { error: 'Название должно быть от 2 символов' }),

  slug: z
    .string()
    .trim()
    .min(1, { error: 'Укажите адресную строку (slug)' })
    .min(2, { error: 'Slug должен быть от 2 символов' })
    .regex(/^[a-z0-9-]+$/, {
      error: 'Используйте только латиницу, цифры и дефис',
    }),

  isActive: z.boolean(),
})

export type CreateCategoryInput = z.input<typeof createCategorySchema>
export type CreateCategoryOutput = z.output<typeof createCategorySchema>
