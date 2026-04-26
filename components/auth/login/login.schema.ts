import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Введите email')
    .email('Некорректный email')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Введите пароль')
    .min(8, 'Пароль от 8 до 128 символов')
    .max(128),
})

export type LoginSchema = z.infer<typeof loginSchema>
