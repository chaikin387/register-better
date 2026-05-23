import { z } from 'zod'

export const avatarSchema = z.object({
  file: z
    .instanceof(File, { message: 'Файл не выбран' })
    .refine((f) => f.size > 0, 'Файл пустой')
    .refine((f) => f.size <= 2 * 1024 * 1024, 'Максимум 2MB')
    .refine(
      (f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
      'Недопустимый формат. Разрешены: JPEG, PNG, WEBP',
    ),
})
