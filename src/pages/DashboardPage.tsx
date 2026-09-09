import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { CategoryStats } from '@/components/CategoryStats.tsx'
import { DashboardCard } from '@/components/DashboardCard.tsx'
import { PeriodFilter } from '@/components/PeriodFilter.tsx'
import { TransactionList } from '@/components/TransactionList.tsx'
import { useGetCategories } from '@/features/categories/services/queries.ts'
import { useGetTransactions } from '@/features/transactions/services/queries.ts'
import { formatCurrency } from '@/shared/lib/format.ts'
import {
  CARD_HOVER,
  CARD_TAP,
  cardVariants,
  fadeUpVariants,
  SPRING,
} from '@/shared/lib/motion.ts'
import type { PeriodKey } from '@/shared/lib/period.ts'
import { getPeriodHint, isInPeriod } from '@/shared/lib/period.ts'

const pageVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
}

const headerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
}

const statsGridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

const movementsSectionVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
}

export function DashboardPage() {
  const [period, setPeriod] = useState<PeriodKey>('month')
  const prefersReducedMotion = useReducedMotion()
  const motionOn = !prefersReducedMotion
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
    <motion.div
      className="flex flex-col gap-6 md:gap-8"
      variants={pageVariants}
      initial={motionOn ? 'hidden' : false}
      animate="show"
    >
      <motion.header className="flex flex-col gap-4" variants={headerVariants}>
        <div className="flex flex-col gap-1">
          <motion.p
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase md:hidden"
            variants={fadeUpVariants}
          >
            Pocket Flow
          </motion.p>
          <motion.h1
            className="text-2xl font-semibold tracking-tight md:text-3xl"
            variants={fadeUpVariants}
          >
            Tu resumen
          </motion.h1>
          <motion.p className="text-sm text-muted-foreground" variants={fadeUpVariants}>
            <AnimatePresence mode="wait">
              <motion.span
                key={periodHint}
                className="inline-block"
                initial={motionOn ? { opacity: 0, y: 6 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={SPRING}
              >
                {periodHint}
              </motion.span>
            </AnimatePresence>
            . Filtra para ver balance, promedios y movimientos.
          </motion.p>
        </div>
        <motion.div variants={fadeUpVariants}>
          <PeriodFilter value={period} onChange={setPeriod} />
        </motion.div>
      </motion.header>

      <motion.div className="grid grid-cols-1 gap-3 sm:grid-cols-3" variants={statsGridVariants}>
        <motion.div
          className="h-full"
          variants={cardVariants}
          whileHover={motionOn ? CARD_HOVER : undefined}
          whileTap={motionOn ? CARD_TAP : undefined}
          transition={SPRING}
        >
          <DashboardCard
            title="Balance"
            value={formatCurrency(balance)}
            hint={periodHint}
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div
          className="h-full"
          variants={cardVariants}
          whileHover={motionOn ? CARD_HOVER : undefined}
          whileTap={motionOn ? CARD_TAP : undefined}
          transition={SPRING}
        >
          <DashboardCard
            title="Ingresos"
            value={formatCurrency(income)}
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div
          className="h-full"
          variants={cardVariants}
          whileHover={motionOn ? CARD_HOVER : undefined}
          whileTap={motionOn ? CARD_TAP : undefined}
          transition={SPRING}
        >
          <DashboardCard
            title="Gastos"
            value={formatCurrency(expense)}
            isLoading={isLoading}
          />
        </motion.div>
      </motion.div>

      <motion.div variants={cardVariants}>
        <CategoryStats
          transactions={filteredTransactions}
          categories={categories}
          isLoading={isLoading}
        />
      </motion.div>

      <motion.section className="flex flex-col gap-3" variants={movementsSectionVariants}>
        <motion.h2
          className="text-sm font-medium text-muted-foreground"
          variants={fadeUpVariants}
        >
          Movimientos
        </motion.h2>
        <TransactionList
          transactions={filteredTransactions}
          categories={categories}
          isLoading={isLoading}
        />
      </motion.section>
    </motion.div>
  )
}
