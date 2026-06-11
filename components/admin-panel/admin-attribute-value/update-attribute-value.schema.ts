import { z } from 'zod'
import { createAttributeValueSchema } from './create-attribute-value.schema'

export const updateAttributeValueSchema = createAttributeValueSchema.extend({
  id: z.string(),
})

export type UpdateAttributeValueInput = z.input<
  typeof updateAttributeValueSchema
>
export type UpdateAttributeValueOutput = z.output<
  typeof updateAttributeValueSchema
>
