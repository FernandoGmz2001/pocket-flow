import type { PaymentMethod, TransactionType } from './get-all.interface.ts'

export interface ICreateTransaction {
  title: string
  amount: number
  type: TransactionType
  paymentMethod: PaymentMethod
  categoryId: string
  date: string
  description?: string
}
