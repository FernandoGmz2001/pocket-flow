import { WalletIcon } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { DashboardCard } from '@/components/DashboardCard.tsx'
import { getCategoryIcon } from '@/shared/lib/category-icons.ts'
import { formatCurrency } from '@/shared/lib/format.ts'
import {
  CARD_HOVER,
  CARD_TAP,
  cardVariants,
  fadeUpVariants,
  listItemVariants,
  ROW_HOVER,
  ROW_TAP,
  SPRING,
} from '@/shared/lib/motion.ts'

const previewVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.06,
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

const PREVIEW_MOVEMENTS = [
  { title: 'Nómina', amount: 18500, type: 'income', icon: 'wallet' },
  { title: 'Supermercado', amount: 842.5, type: 'expense', icon: 'utensils' },
  { title: 'Gasolina', amount: 620, type: 'expense', icon: 'car' },
] as const

export function AuthAppPreview() {
  const prefersReducedMotion = useReducedMotion()
  const motionOn = !prefersReducedMotion

  return (
    <motion.div
      className="pointer-events-auto flex h-full flex-col justify-center gap-6 px-8 py-12"
      aria-hidden="true"
      variants={previewVariants}
      initial={motionOn ? 'hidden' : false}
      animate="show"
    >
      <motion.div className="flex flex-col gap-1" variants={headerVariants}>
        <motion.div
          className="mb-1 flex items-center gap-2 text-muted-foreground [&_svg]:size-4"
          variants={fadeUpVariants}
        >
          <WalletIcon />
          <p className="text-xs font-medium tracking-wide uppercase">Pocket Flow</p>
        </motion.div>
        <motion.h2
          className="text-2xl font-semibold tracking-tight"
          variants={fadeUpVariants}
        >
          Tu resumen
        </motion.h2>
        <motion.p className="text-sm text-muted-foreground" variants={fadeUpVariants}>
          Balance, gastos y movimientos en un solo lugar.
        </motion.p>
      </motion.div>

      <motion.div
        variants={cardVariants}
        whileHover={motionOn ? CARD_HOVER : undefined}
        whileTap={motionOn ? CARD_TAP : undefined}
        transition={SPRING}
      >
        <DashboardCard title="Balance" value={formatCurrency(12450)} hint="Este mes" />
      </motion.div>

      <motion.div className="grid grid-cols-2 gap-3" variants={statsGridVariants}>
        <motion.div
          className="h-full"
          variants={cardVariants}
          whileHover={motionOn ? CARD_HOVER : undefined}
          whileTap={motionOn ? CARD_TAP : undefined}
          transition={SPRING}
        >
          <DashboardCard title="Ingresos" value={formatCurrency(18500)} />
        </motion.div>
        <motion.div
          className="h-full"
          variants={cardVariants}
          whileHover={motionOn ? CARD_HOVER : undefined}
          whileTap={motionOn ? CARD_TAP : undefined}
          transition={SPRING}
        >
          <DashboardCard title="Gastos" value={formatCurrency(6050)} />
        </motion.div>
      </motion.div>

      <motion.div className="flex flex-col gap-2" variants={movementsSectionVariants}>
        <motion.p
          className="text-sm font-medium text-muted-foreground"
          variants={fadeUpVariants}
        >
          Movimientos
        </motion.p>
        <AnimatePresence>
          {PREVIEW_MOVEMENTS.map((movement) => {
            const Icon = getCategoryIcon(movement.icon)
            const isIncome = movement.type === 'income'

            return (
              <motion.div
                key={movement.title}
                className="glass-panel flex items-center gap-3 rounded-2xl px-3 py-2.5"
                variants={listItemVariants}
                exit="exit"
                whileHover={motionOn ? ROW_HOVER : undefined}
                whileTap={motionOn ? ROW_TAP : undefined}
                transition={SPRING}
              >
                <div className="flex size-9 items-center justify-center rounded-xl bg-muted text-foreground [&_svg]:size-4">
                  <Icon />
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-medium">{movement.title}</p>
                <p className="text-sm font-semibold tabular-nums">
                  {isIncome ? '+' : '-'}
                  {formatCurrency(movement.amount)}
                </p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
