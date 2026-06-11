import { z } from 'zod'

export const createAttributeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { error: 'Введите название атрибута' })
    .max(150),
  slug: z
    .string()
    .trim()
    .min(3, { error: 'Введите slug атрибута' })
    .max(100)
    .regex(/^[a-z0-9-]+$/, {
      error: 'Используйте только строчную латиницу, цифры и дефис',
    }),
})

export type CreateAttributeInput = z.input<typeof createAttributeSchema>
export type CreateAttributeOutput = z.output<typeof createAttributeSchema>
