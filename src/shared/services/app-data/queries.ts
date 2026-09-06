import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage } from '@/shared/lib/errors.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import { resetAppData } from '@/shared/services/app-data/endpoints.ts'

export function useResetAppData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resetAppData,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.TRANSACTIONS.ALL,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.CATEGORIES.ALL,
        }),
      ])
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudieron restablecer los datos'))
    },
  })
}
