import { z } from 'zod'

import { CATEGORY_ICON_KEYS } from '@/shared/lib/category-icons.ts'

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  icon: z.enum(CATEGORY_ICON_KEYS),
})

export type CreateCategorySchema = z.infer<typeof createCategorySchema>
