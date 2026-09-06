import { delay } from '@/shared/lib/format.ts'
import { mockStore } from '@/shared/lib/mock-store.ts'

export async function resetAppData() {
  await delay(180)
  mockStore.resetAll()
}
