import { z } from 'zod'

export const nameSchema = z.object({
  name: z
    .string()
    .min(1, 'Имя не может быть пустым')
    .max(100, 'Имя слишком длинное')
    .transform((s) => s.trim()),
})
