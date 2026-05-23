// login-otp.schema.ts
import { z } from 'zod'

export const loginOtpSchema = z.object({
  email: z
    .string()
    .min(1, 'Введите email')
    .email('Некорректный email')
    .trim()
    .toLowerCase(),
  otp: z
    .string()
    .min(1, 'Нажмите "Отправить код" или введите полученный')
    .length(6, 'Код состоит из 6 цифр'),
})

export type LoginOtpSchema = z.infer<typeof loginOtpSchema>
