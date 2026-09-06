import type { ICreateCategory } from '@/features/categories/interfaces/create.interface.ts'
import type { ICategory } from '@/features/categories/interfaces/get-all.interface.ts'
import type { IUpdateCategory } from '@/features/categories/interfaces/update.interface.ts'
import { handleApiError } from '@/shared/lib/errors.ts'
import { delay } from '@/shared/lib/format.ts'
import { mockStore } from '@/shared/lib/mock-store.ts'

export async function getCategories(): Promise<ICategory[]> {
  try {
    await delay(180)
    return mockStore.getCategories()
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener las categorías')
  }
}

export async function createCategory(payload: ICreateCategory) {
  await delay(180)
  return mockStore.createCategory(payload)
}

export async function updateCategory(id: string, payload: IUpdateCategory) {
  await delay(180)
  return mockStore.updateCategory(id, payload)
}

export async function deleteCategory(id: string) {
  await delay(180)
  return mockStore.deleteCategory(id)
}
