// update-category.schema.ts
import { z } from 'zod'
import { createCategorySchema } from './create-category.schema'

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string(),
})

export type UpdateCategoryInput = z.input<typeof updateCategorySchema>
export type UpdateCategoryOutput = z.output<typeof updateCategorySchema>
