import { z } from 'zod'

export const createProductVariantSchema = z.object({
  attributeValueIds: z
    .array(z.string())
    .min(1, { error: 'Выберите значения атрибутов' }),
  price: z.coerce.number().int().min(1, { error: 'Введите цену' }),
  weight: z.coerce.number().int().min(1, { error: 'Введите вес' }),
})

export type CreateProductVariantInput = z.input<
  typeof createProductVariantSchema
>
export type CreateProductVariantOutput = z.output<
  typeof createProductVariantSchema
>
