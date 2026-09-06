import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { ICreateTransaction } from '@/features/transactions/interfaces/create.interface.ts'
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
} from '@/features/transactions/services/endpoints.ts'
import { getErrorMessage } from '@/shared/lib/errors.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'

export function useGetTransactions() {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS.ALL,
    queryFn: getTransactions,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ICreateTransaction) => createTransaction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRANSACTIONS.ALL,
      })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo guardar el movimiento'))
    },
  })
}

export function useGetTransaction(transactionId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS.DETAIL(transactionId ?? ''),
    queryFn: () => getTransaction(transactionId!),
    enabled: Boolean(transactionId),
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.TRANSACTIONS.ALL,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.TRANSACTIONS.DETAIL(id),
        }),
      ])
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo deshacer el movimiento'))
    },
  })
}
