// forgot-password.schema.ts
import { z } from 'zod'

export const forgotPasswordSchema = z
  .object({
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

    confirmPassword: z.string().min(1, { error: 'Подтвердите пароль' }),

    otp: z
      .string()
      .trim()
      .min(1, { error: 'Нажмите "Отправить код" или введите полученный' })
      .length(6, { error: 'Код состоит из 6 символов' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type ForgotPasswordSchema = z.input<typeof forgotPasswordSchema>
