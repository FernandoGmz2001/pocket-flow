import type { ICreateCategory } from '@/features/categories/interfaces/create.interface.ts'
import type { ICategory } from '@/features/categories/interfaces/get-all.interface.ts'
import type { IUpdateCategory } from '@/features/categories/interfaces/update.interface.ts'
import { handleApiError } from '@/shared/lib/errors.ts'
import { mapDataError } from '@/shared/lib/supabase-errors.ts'
import { mapCategory, type ICategoryRow } from '@/shared/lib/supabase-mappers.ts'
import { requireUserId, supabase } from '@/shared/lib/supabase.ts'

export async function getCategories(): Promise<ICategory[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('is_seed', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    return ((data ?? []) as ICategoryRow[]).map(mapCategory)
  } catch (error) {
    throw handleApiError(
      mapDataError(error, 'No se pudieron obtener las categorías'),
      'No se pudieron obtener las categorías',
    )
  }
}

export async function createCategory(payload: ICreateCategory) {
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from('categories')
    .insert({
      user_id: userId,
      name: payload.name,
      color: payload.color,
      icon: payload.icon,
      is_seed: false,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw mapDataError(error, 'No se pudo crear la categoría')
  }

  return mapCategory(data as ICategoryRow)
}

export async function updateCategory(id: string, payload: IUpdateCategory) {
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: payload.name,
      color: payload.color,
      icon: payload.icon,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) {
    throw mapDataError(error, 'No se pudo actualizar la categoría')
  }

  return mapCategory(data as ICategoryRow)
}

export async function deleteCategory(id: string) {
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (categoryError || !category) {
    throw new Error('No se encontró la categoría')
  }

  if ((category as ICategoryRow).is_seed) {
    throw new Error('No se pueden eliminar las categorías base')
  }

  const { count, error: countError } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id)

  if (countError) {
    throw mapDataError(countError, 'No se pudo eliminar la categoría')
  }

  if ((count ?? 0) > 0) {
    throw new Error('No se puede eliminar una categoría con movimientos')
  }

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    throw mapDataError(error, 'No se pudo eliminar la categoría')
  }
}
