import { z } from 'zod'
import { createCategorySchema } from './create-category.schema'

export const updateCategorySchema = createCategorySchema.extend({
  id: z.number(),
})

export type UpdateCategoryInput = z.input<typeof updateCategorySchema>
export type UpdateCategoryOutput = z.output<typeof updateCategorySchema>
