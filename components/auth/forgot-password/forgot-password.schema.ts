// forgot-password.schema.ts
import { z } from 'zod'

export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Введите email')
      .email('Некорректный email'),

    password: z
      .string()
      .min(1, 'Введите пароль')
      .min(8, 'Пароль от 8 до 128 символов')
      .max(128),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
    otp: z
      .string()
      .trim()
      .min(1, 'Отправьте код на email')
      .length(6, 'Код состоит из 6 символов'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
