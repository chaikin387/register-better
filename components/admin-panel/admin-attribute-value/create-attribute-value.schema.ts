import { z } from 'zod'

export const createAttributeValueSchema = z.object({
  value: z.string().trim().min(1, { error: 'Введите значение' }).max(150),
  slug: z
    .string()
    .trim()
    .min(1, { error: 'Введите slug' })
    .max(150)
    .regex(/^[a-z0-9-]+$/, {
      error: 'Используйте только строчную латиницу, цифры и дефис',
    }),
})

export type CreateAttributeValueInput = z.input<
  typeof createAttributeValueSchema
>
export type CreateAttributeValueOutput = z.output<
  typeof createAttributeValueSchema
>
