import { z } from 'zod'
import { createAttributeSchema } from './create-attribute.schema'

export const updateAttributeSchema = createAttributeSchema.extend({
  id: z.string(),
})

export type UpdateAttributeInput = z.input<typeof updateAttributeSchema>
export type UpdateAttributeOutput = z.output<typeof updateAttributeSchema>
