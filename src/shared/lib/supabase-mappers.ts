import type { User } from '@supabase/supabase-js'

import type { IUser } from '@/features/auth/interfaces/user.interface.ts'
import type { ICategory } from '@/features/categories/interfaces/get-all.interface.ts'
import type {
  ITransaction,
  PaymentMethod,
  TransactionType,
} from '@/features/transactions/interfaces/get-all.interface.ts'

export interface ICategoryRow {
  id: string
  user_id: string
  name: string
  color: string
  icon: string
  is_seed: boolean
}

export interface ITransactionRow {
  id: string
  user_id: string
  category_id: string
  title: string
  amount: number | string
  type: TransactionType
  payment_method: PaymentMethod
  date: string
  description: string | null
}

export function mapAuthUser(user: User): IUser {
  const metadata = user.user_metadata ?? {}
  const nameFromMetadata =
    (typeof metadata.name === 'string' && metadata.name.trim()) ||
    (typeof metadata.full_name === 'string' && metadata.full_name.trim()) ||
    ''
  const photoUrl =
    (typeof metadata.avatar_url === 'string' && metadata.avatar_url) ||
    (typeof metadata.picture === 'string' && metadata.picture) ||
    null

  return {
    id: user.id,
    name: nameFromMetadata || user.email || 'Usuario',
    email: user.email ?? '',
    photoUrl,
  }
}

export function mapCategory(row: ICategoryRow): ICategory {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    icon: row.icon,
    isSeed: row.is_seed,
  }
}

export function mapTransaction(row: ITransactionRow): ITransaction {
  return {
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    type: row.type,
    paymentMethod: row.payment_method,
    categoryId: row.category_id,
    date: row.date,
    description: row.description ?? undefined,
  }
}
