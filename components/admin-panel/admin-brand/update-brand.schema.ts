// update-brand.schema.ts
import { z } from 'zod'
import { createBrandSchema } from './create-brand.schema'

export const updateBrandSchema = createBrandSchema.extend({
  id: z.string(),
})

export type UpdateBrandInput = z.input<typeof updateBrandSchema>
export type UpdateBrandOutput = z.output<typeof updateBrandSchema>
