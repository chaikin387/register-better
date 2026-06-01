// login.schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { error: 'Введите email' })
    .pipe(z.email({ error: 'Некорректный email' })),

  password: z
    .string()
    .min(1, { error: 'Введите пароль' })
    .min(8, { error: 'Пароль от 8 до 128 символов' })
    .max(128),
})

export type LoginSchema = z.input<typeof loginSchema>
