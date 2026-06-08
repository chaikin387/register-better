// update-product.schema.ts
import { z } from 'zod'
import { createProductSchema } from './create-product.schema'

export const updateProductSchema = createProductSchema.extend({
  id: z.string(),
})

export type UpdateProductInput = z.input<typeof updateProductSchema>
export type UpdateProductOutput = z.output<typeof updateProductSchema>
