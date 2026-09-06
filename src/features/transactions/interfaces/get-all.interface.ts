export type TransactionType = 'expense' | 'income'
export type PaymentMethod = 'credit' | 'debit' | 'cash'

export interface ITransaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  paymentMethod: PaymentMethod
  categoryId: string
  date: string
  description?: string
}
