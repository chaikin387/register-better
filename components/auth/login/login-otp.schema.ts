// login-otp.schema.ts
import { z } from 'zod'

export const loginOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { error: 'Введите email' })
    .pipe(z.email({ error: 'Некорректный email' })),

  otp: z
    .string()
    .trim()
    .min(1, { error: 'Нажмите "Отправить код" или введите полученный' })
    .length(6, { error: 'Код состоит из 6 цифр' }),
})

export type LoginOtpSchema = z.input<typeof loginOtpSchema>
