import { z } from 'zod'

export const createTransactionSchema = z.object({
  type: z.enum(['expense', 'income']),
  paymentMethod: z.enum(['credit', 'debit', 'cash']),
  title: z.string().trim().min(1, 'El nombre es obligatorio'),
  amount: z.coerce.number().positive('La cantidad debe ser mayor a 0'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  date: z.string().min(1, 'La fecha es obligatoria'),
  description: z.string().trim().optional(),
})

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>
