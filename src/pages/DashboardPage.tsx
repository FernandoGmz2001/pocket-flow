import { useState } from 'react'

import { CategoryStats } from '@/components/CategoryStats.tsx'
import { DashboardCard } from '@/components/DashboardCard.tsx'
import { PeriodFilter } from '@/components/PeriodFilter.tsx'
import { TransactionList } from '@/components/TransactionList.tsx'
import { useGetCategories } from '@/features/categories/services/queries.ts'
import { useGetTransactions } from '@/features/transactions/services/queries.ts'
import { formatCurrency } from '@/shared/lib/format.ts'
import type { PeriodKey } from '@/shared/lib/period.ts'
import { getPeriodHint, isInPeriod } from '@/shared/lib/period.ts'

export function DashboardPage() {
  const [period, setPeriod] = useState<PeriodKey>('month')
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useGetTransactions()
  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetCategories()

  const filteredTransactions = transactions.filter((transaction) =>
    isInPeriod(transaction.date, period),
  )
  const income = filteredTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const expense = filteredTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const balance = income - expense
  const isLoading = isLoadingTransactions || isLoadingCategories
  const periodHint = getPeriodHint(period)

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase md:hidden">
            Pocket Flow
          </p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Tu resumen</h1>
          <p className="text-sm text-muted-foreground">
            {periodHint}. Filtra para ver balance, promedios y movimientos.
          </p>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DashboardCard
          title="Balance"
          value={formatCurrency(balance)}
          hint={periodHint}
          isLoading={isLoading}
        />
        <DashboardCard
          title="Ingresos"
          value={formatCurrency(income)}
          isLoading={isLoading}
        />
        <DashboardCard
          title="Gastos"
          value={formatCurrency(expense)}
          isLoading={isLoading}
        />
      </div>

      <CategoryStats
        transactions={filteredTransactions}
        categories={categories}
        isLoading={isLoading}
      />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Movimientos
        </h2>
        <TransactionList
          transactions={filteredTransactions}
          categories={categories}
          isLoading={isLoading}
        />
      </section>
    </div>
  )
}
