import { mapDataError } from '@/shared/lib/supabase-errors.ts'
import { requireUserId, supabase } from '@/shared/lib/supabase.ts'

export async function resetAppData() {
  const userId = await requireUserId()
  const { error: transactionsError } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', userId)

  if (transactionsError) {
    throw mapDataError(transactionsError, 'No se pudieron restablecer los datos')
  }

  const { error: categoriesError } = await supabase
    .from('categories')
    .delete()
    .eq('user_id', userId)
    .eq('is_seed', false)

  if (categoriesError) {
    throw mapDataError(categoriesError, 'No se pudieron restablecer los datos')
  }
}
