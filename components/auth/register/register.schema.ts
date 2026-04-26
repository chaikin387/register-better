import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Введите имя')
      .min(2, 'Имя от 2 символов')
      .max(100),
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
      .length(6, 'Код состоит из 6 цифр'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type RegisterSchema = z.infer<typeof registerSchema>
