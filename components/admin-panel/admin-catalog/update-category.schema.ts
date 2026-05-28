import { z } from 'zod'
import { createCategorySchema } from './create-category.schema'

export const updateCategorySchema = createCategorySchema.extend({
  id: z.number(),
})

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>
