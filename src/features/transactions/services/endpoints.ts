import type { ICreateTransaction } from '@/features/transactions/interfaces/create.interface.ts'
import type { ITransaction } from '@/features/transactions/interfaces/get-all.interface.ts'
import { handleApiError } from '@/shared/lib/errors.ts'
import { delay } from '@/shared/lib/format.ts'
import { mockStore } from '@/shared/lib/mock-store.ts'

export async function getTransactions(): Promise<ITransaction[]> {
  try {
    await delay(180)
    return mockStore.getTransactions()
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener las transacciones')
  }
}

export async function createTransaction(payload: ICreateTransaction) {
  await delay(180)
  return mockStore.createTransaction(payload)
}

export async function getTransaction(id: string): Promise<ITransaction | null> {
  try {
    await delay(180)
    return mockStore.getTransaction(id) ?? null
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener el movimiento')
  }
}

export async function deleteTransaction(id: string) {
  await delay(180)
  return mockStore.deleteTransaction(id)
}
