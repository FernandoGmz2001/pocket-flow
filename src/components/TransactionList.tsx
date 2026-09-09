import { ReceiptIcon } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge.tsx'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import type { ICategory } from '@/features/categories/interfaces/get-all.interface.ts'
import type { ITransaction } from '@/features/transactions/interfaces/get-all.interface.ts'
import { getCategoryIcon } from '@/shared/lib/category-icons.ts'
import { formatCurrency, formatDayHeading } from '@/shared/lib/format.ts'
import {
  fadeUpVariants,
  listItemVariants,
  ROW_HOVER,
  ROW_TAP,
  SPRING,
} from '@/shared/lib/motion.ts'
import { formatPaymentMethod } from '@/shared/lib/payment-method.ts'

const MotionLink = motion.create(Link)

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

const groupVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
  exit: { opacity: 0, y: -8, transition: SPRING },
}

interface TransactionListProps {
  transactions: ITransaction[]
  categories: ICategory[]
  isLoading?: boolean
}

function groupTransactionsByDate(transactions: ITransaction[]) {
  const groups: { date: string; items: ITransaction[] }[] = []
  const indexByDate = new Map<string, number>()

  for (const transaction of transactions) {
    const existingIndex = indexByDate.get(transaction.date)

    if (existingIndex === undefined) {
      indexByDate.set(transaction.date, groups.length)
      groups.push({ date: transaction.date, items: [transaction] })
      continue
    }

    groups[existingIndex].items.push(transaction)
  }

  return groups
}

function dayTotal(transactions: ITransaction[]) {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'income'
      ? total + transaction.amount
      : total - transaction.amount
  }, 0)
}

export function TransactionList({
  transactions,
  categories,
  isLoading = false,
}: TransactionListProps) {
  const prefersReducedMotion = useReducedMotion()
  const motionOn = !prefersReducedMotion
  const categoriesById = new Map(categories.map((category) => [category.id, category]))
  const groups = groupTransactionsByDate(transactions)

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          className="flex flex-col gap-6"
          initial={motionOn ? 'hidden' : false}
          animate="show"
          exit="exit"
          variants={listVariants}
        >
          <motion.div className="flex flex-col gap-2" variants={groupVariants}>
            <motion.div variants={fadeUpVariants}>
              <Skeleton className="h-4 w-24" />
            </motion.div>
            <motion.div variants={listItemVariants}>
              <Skeleton className="h-16 w-full rounded-2xl" />
            </motion.div>
            <motion.div variants={listItemVariants}>
              <Skeleton className="h-16 w-full rounded-2xl" />
            </motion.div>
          </motion.div>
          <motion.div className="flex flex-col gap-2" variants={groupVariants}>
            <motion.div variants={fadeUpVariants}>
              <Skeleton className="h-4 w-28" />
            </motion.div>
            <motion.div variants={listItemVariants}>
              <Skeleton className="h-16 w-full rounded-2xl" />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : transactions.length === 0 ? (
        <motion.div
          key="empty"
          initial={motionOn ? 'hidden' : false}
          animate="show"
          exit="exit"
          variants={fadeUpVariants}
        >
          <Empty className="glass-panel border-dashed py-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ReceiptIcon />
              </EmptyMedia>
              <EmptyTitle>Sin movimientos</EmptyTitle>
              <EmptyDescription>
                Añade tu primer ingreso o gasto con el botón +.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </motion.div>
      ) : (
        <motion.div
          key="list"
          className="flex flex-col gap-6"
          initial={motionOn ? 'hidden' : false}
          animate="show"
          exit="exit"
          variants={listVariants}
        >
          <AnimatePresence>
            {groups.map((group) => {
              const total = dayTotal(group.items)
              const isPositive = total > 0

              return (
                <motion.section
                  key={group.date}
                  className="flex flex-col gap-2"
                  variants={groupVariants}
                  initial={motionOn ? 'hidden' : false}
                  animate="show"
                  exit="exit"
                >
                  <motion.header
                    className="flex items-baseline justify-between gap-3 px-1"
                    variants={fadeUpVariants}
                  >
                    <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {formatDayHeading(group.date)}
                    </h3>
                    <p className="text-xs font-medium tabular-nums text-muted-foreground">
                      {total === 0
                        ? formatCurrency(0)
                        : `${isPositive ? '+' : '−'}${formatCurrency(Math.abs(total))}`}
                    </p>
                  </motion.header>
                  <ul className="flex flex-col gap-2">
                    <AnimatePresence>
                      {group.items.map((transaction) => {
                        const category = categoriesById.get(transaction.categoryId)
                        const Icon = getCategoryIcon(category?.icon ?? 'wallet')
                        const isIncome = transaction.type === 'income'

                        return (
                          <motion.li
                            key={transaction.id}
                            variants={listItemVariants}
                            initial={motionOn ? 'hidden' : false}
                            animate="show"
                            exit="exit"
                          >
                            <MotionLink
                              to={`/movimientos/${transaction.id}`}
                              className="glass-panel flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-muted/50"
                              whileHover={motionOn ? ROW_HOVER : undefined}
                              whileTap={motionOn ? ROW_TAP : undefined}
                              transition={SPRING}
                            >
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                                <Icon />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{transaction.title}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {category?.name ?? 'Sin categoría'} ·{' '}
                                  {formatPaymentMethod(transaction.paymentMethod)}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-sm font-semibold tabular-nums">
                                  {isIncome ? '+' : '−'}
                                  {formatCurrency(transaction.amount)}
                                </span>
                                <Badge variant={isIncome ? 'default' : 'secondary'}>
                                  {isIncome ? 'Ingreso' : 'Gasto'}
                                </Badge>
                              </div>
                            </MotionLink>
                          </motion.li>
                        )
                      })}
                    </AnimatePresence>
                  </ul>
                </motion.section>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
