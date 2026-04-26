import { z } from 'zod'

export const verifyEmailSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  otp: z
    .string()
    .min(1, 'Нажмите "Отправить код"')
    .length(6, 'Код состоит из 6 цифр'),
})

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>
