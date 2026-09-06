import type { PaymentMethod } from '@/features/transactions/interfaces/get-all.interface.ts'

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'credit', label: 'Crédito' },
  { value: 'debit', label: 'Débito' },
  { value: 'cash', label: 'Efectivo' },
] as const satisfies readonly { value: PaymentMethod; label: string }[]

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  credit: 'Crédito',
  debit: 'Débito',
  cash: 'Efectivo',
}

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === 'credit' || value === 'debit' || value === 'cash'
}

export function formatPaymentMethod(paymentMethod: PaymentMethod) {
  return PAYMENT_METHOD_LABELS[paymentMethod]
}
