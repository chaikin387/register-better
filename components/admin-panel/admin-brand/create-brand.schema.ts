import { z } from 'zod'

export const createBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: 'Название должно быть от 2 символов' })
    .max(150),
  slug: z
    .string()
    .trim()
    .min(2, { error: 'Slug должен быть от 2 символов' })
    .max(100)
    .regex(/^[a-z0-9-]+$/, {
      error: 'Используйте только строчную латиницу, цифры и дефис',
    }),
  isActive: z.boolean().default(true),
})

export type CreateBrandInput = z.input<typeof createBrandSchema>
export type CreateBrandOutput = z.output<typeof createBrandSchema>
