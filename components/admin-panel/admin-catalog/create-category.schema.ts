import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Введите название категории')
    .min(2, 'Название должно быть от 2 символов'),
  slug: z
    .string()
    .trim()
    .min(1, 'Укажите адресную строку (slug)')
    .min(2, 'Slug должен быть от 2 символов')
    .regex(/^[a-z0-9-]+$/, 'Используйте только латиницу, цифры и дефис'),
  isActive: z.boolean(),
})

export type CreateCategorySchema = z.infer<typeof createCategorySchema>
