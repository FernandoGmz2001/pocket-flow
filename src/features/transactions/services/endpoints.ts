import type { ICreateTransaction } from '@/features/transactions/interfaces/create.interface.ts'
import type { ITransaction } from '@/features/transactions/interfaces/get-all.interface.ts'
import type { IUpdateTransaction } from '@/features/transactions/interfaces/update.interface.ts'
import { handleApiError } from '@/shared/lib/errors.ts'
import { mapDataError } from '@/shared/lib/supabase-errors.ts'
import { mapTransaction, type ITransactionRow } from '@/shared/lib/supabase-mappers.ts'
import { requireUserId, supabase } from '@/shared/lib/supabase.ts'

export async function getTransactions(): Promise<ITransaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return ((data ?? []) as ITransactionRow[]).map(mapTransaction)
  } catch (error) {
    throw handleApiError(
      mapDataError(error, 'No se pudieron obtener las transacciones'),
      'No se pudieron obtener las transacciones',
    )
  }
}

export async function createTransaction(payload: ICreateTransaction) {
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      title: payload.title,
      amount: payload.amount,
      type: payload.type,
      payment_method: payload.paymentMethod,
      category_id: payload.categoryId,
      date: payload.date,
      description: payload.description ?? null,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw mapDataError(error, 'No se pudo guardar el movimiento')
  }

  return mapTransaction(data as ITransactionRow)
}

export async function updateTransaction(id: string, payload: IUpdateTransaction) {
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from('transactions')
    .update({
      title: payload.title,
      amount: payload.amount,
      type: payload.type,
      payment_method: payload.paymentMethod,
      category_id: payload.categoryId,
      date: payload.date,
      description: payload.description ?? null,
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .maybeSingle()

  if (error) {
    throw mapDataError(error, 'No se pudo actualizar el movimiento')
  }

  if (!data) {
    throw new Error('Movimiento no encontrado')
  }

  return mapTransaction(data as ITransactionRow)
}

export async function getTransaction(id: string): Promise<ITransaction | null> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data ? mapTransaction(data as ITransactionRow) : null
  } catch (error) {
    throw handleApiError(
      mapDataError(error, 'No se pudo obtener el movimiento'),
      'No se pudo obtener el movimiento',
    )
  }
}

export async function deleteTransaction(id: string) {
  const { data, error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    throw mapDataError(error, 'No se pudo deshacer el movimiento')
  }

  if (!data) {
    throw new Error('Movimiento no encontrado')
  }
}
