import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { ICreateCategory } from '@/features/categories/interfaces/create.interface.ts'
import type { IUpdateCategory } from '@/features/categories/interfaces/update.interface.ts'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '@/features/categories/services/endpoints.ts'
import { getErrorMessage } from '@/shared/lib/errors.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'

export function useGetCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.ALL,
    queryFn: getCategories,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ICreateCategory) => createCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.ALL,
      })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo crear la categoría'))
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateCategory }) =>
      updateCategory(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.CATEGORIES.ALL,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.TRANSACTIONS.ALL,
        }),
      ])
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo actualizar la categoría'))
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.CATEGORIES.ALL,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.TRANSACTIONS.ALL,
        }),
      ])
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo eliminar la categoría'))
    },
  })
}
