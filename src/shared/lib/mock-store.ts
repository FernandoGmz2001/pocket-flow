import type { ICreateCategory } from '@/features/categories/interfaces/create.interface.ts'
import type { IUpdateCategory } from '@/features/categories/interfaces/update.interface.ts'
import type { ICategory } from '@/features/categories/interfaces/get-all.interface.ts'
import type { ICreateTransaction } from '@/features/transactions/interfaces/create.interface.ts'
import type { ITransaction } from '@/features/transactions/interfaces/get-all.interface.ts'
import { isPaymentMethod } from '@/shared/lib/payment-method.ts'

const STORAGE_KEY = 'pocket-flow:v2'

interface IStore {
  transactions: ITransaction[]
  categories: ICategory[]
}

export const SEED_CATEGORIES: ICategory[] = [
  { id: 'cat-food', name: 'Comida', color: '#3f3f46', icon: 'utensils' },
  { id: 'cat-transport', name: 'Transporte', color: '#3f3f46', icon: 'car' },
  { id: 'cat-home', name: 'Hogar', color: '#3f3f46', icon: 'house' },
  { id: 'cat-shopping', name: 'Compras', color: '#3f3f46', icon: 'shoppingBag' },
  { id: 'cat-health', name: 'Salud', color: '#3f3f46', icon: 'heartPulse' },
  { id: 'cat-income', name: 'Ingresos', color: '#3f3f46', icon: 'wallet' },
]

export function isSeedCategory(categoryId: string) {
  return SEED_CATEGORIES.some((category) => category.id === categoryId)
}

function withSeedCategories(categories: ICategory[]) {
  const categoriesById = new Map(categories.map((category) => [category.id, category]))
  const seedCategories = SEED_CATEGORIES.map(
    (seedCategory) => categoriesById.get(seedCategory.id) ?? seedCategory,
  )
  const customCategories = categories.filter((category) => !isSeedCategory(category.id))

  return [...seedCategories, ...customCategories]
}

function daysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  const offset = date.getTimezoneOffset() * 60_000

  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

function createSeed(): IStore {
  const transactions: ITransaction[] = [
    {
      id: 'tx-1',
      title: 'Nómina',
      amount: 18500,
      type: 'income',
      paymentMethod: 'debit',
      categoryId: 'cat-income',
      date: daysAgo(6),
      description: 'Pago quincenal',
    },
    {
      id: 'tx-2',
      title: 'Supermercado',
      amount: 842.5,
      type: 'expense',
      paymentMethod: 'debit',
      categoryId: 'cat-food',
      date: daysAgo(5),
    },
    {
      id: 'tx-3',
      title: 'Gasolina',
      amount: 620,
      type: 'expense',
      paymentMethod: 'credit',
      categoryId: 'cat-transport',
      date: daysAgo(4),
    },
    {
      id: 'tx-4',
      title: 'Café con amigos',
      amount: 128,
      type: 'expense',
      paymentMethod: 'cash',
      categoryId: 'cat-food',
      date: daysAgo(3),
    },
    {
      id: 'tx-5',
      title: 'Farmacia',
      amount: 256.9,
      type: 'expense',
      paymentMethod: 'debit',
      categoryId: 'cat-health',
      date: daysAgo(2),
    },
    {
      id: 'tx-6',
      title: 'Renta',
      amount: 7500,
      type: 'expense',
      paymentMethod: 'debit',
      categoryId: 'cat-home',
      date: daysAgo(1),
    },
    {
      id: 'tx-7',
      title: 'Freelance',
      amount: 3200,
      type: 'income',
      paymentMethod: 'cash',
      categoryId: 'cat-income',
      date: daysAgo(0),
      description: 'Proyecto extra',
    },
  ]

  return { categories: [...SEED_CATEGORIES], transactions }
}

function loadStore(): IStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seed = createSeed()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
      return seed
    }

    const parsed = JSON.parse(raw) as IStore
    if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.categories)) {
      throw new Error('Invalid store')
    }

    parsed.transactions = parsed.transactions.map((transaction) => ({
      ...transaction,
      paymentMethod: isPaymentMethod(transaction.paymentMethod)
        ? transaction.paymentMethod
        : 'debit',
    }))
    parsed.categories = withSeedCategories(parsed.categories)

    return parsed
  } catch {
    const seed = createSeed()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
}

let memoryStore: IStore | null = null

function getStore() {
  if (!memoryStore) {
    memoryStore = loadStore()
  }

  return memoryStore
}

function persist() {
  const store = getStore()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export const mockStore = {
  getTransactions() {
    return [...getStore().transactions].sort((left, right) =>
      right.date.localeCompare(left.date),
    )
  },
  getCategories() {
    return [...getStore().categories]
  },
  createTransaction(payload: ICreateTransaction) {
    const transaction: ITransaction = {
      id: crypto.randomUUID(),
      title: payload.title,
      amount: payload.amount,
      type: payload.type,
      paymentMethod: payload.paymentMethod,
      categoryId: payload.categoryId,
      date: payload.date,
      description: payload.description,
    }

    getStore().transactions.push(transaction)
    persist()
    return transaction
  },
  createCategory(payload: ICreateCategory) {
    const category: ICategory = {
      id: crypto.randomUUID(),
      name: payload.name,
      color: payload.color,
      icon: payload.icon,
    }

    getStore().categories.push(category)
    persist()
    return category
  },
  updateCategory(id: string, payload: IUpdateCategory) {
    const store = getStore()
    const category = store.categories.find((item) => item.id === id)

    if (!category) {
      throw new Error('No se encontró la categoría')
    }

    category.name = payload.name
    category.color = payload.color
    category.icon = payload.icon
    persist()

    return { ...category }
  },
  deleteCategory(id: string) {
    if (isSeedCategory(id)) {
      throw new Error('No se pueden eliminar las categorías base')
    }

    const store = getStore()
    const hasMovements = store.transactions.some(
      (transaction) => transaction.categoryId === id,
    )

    if (hasMovements) {
      throw new Error('No se puede eliminar una categoría con movimientos')
    }

    const index = store.categories.findIndex((category) => category.id === id)

    if (index === -1) {
      throw new Error('No se encontró la categoría')
    }

    store.categories.splice(index, 1)
    persist()
  },
  getTransaction(id: string) {
    return getStore().transactions.find((transaction) => transaction.id === id)
  },
  deleteTransaction(id: string) {
    const store = getStore()
    const index = store.transactions.findIndex((transaction) => transaction.id === id)

    if (index === -1) {
      throw new Error('Movimiento no encontrado')
    }

    store.transactions.splice(index, 1)
    persist()
  },
  resetAll() {
    const store = getStore()

    memoryStore = {
      transactions: [],
      categories: withSeedCategories(
        store.categories.filter((category) => isSeedCategory(category.id)),
      ),
    }
    persist()
  },
}
