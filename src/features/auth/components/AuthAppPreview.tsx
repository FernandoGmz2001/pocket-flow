import { WalletIcon } from 'lucide-react'

import { DashboardCard } from '@/components/DashboardCard.tsx'
import { getCategoryIcon } from '@/shared/lib/category-icons.ts'
import { formatCurrency } from '@/shared/lib/format.ts'

const PREVIEW_MOVEMENTS = [
  { title: 'Nómina', amount: 18500, type: 'income', icon: 'wallet' },
  { title: 'Supermercado', amount: 842.5, type: 'expense', icon: 'utensils' },
  { title: 'Gasolina', amount: 620, type: 'expense', icon: 'car' },
] as const

export function AuthAppPreview() {
  return (
    <div
      className="flex h-full flex-col justify-center gap-6 px-8 py-12"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-1">
        <div className="mb-1 flex items-center gap-2 text-muted-foreground [&_svg]:size-4">
          <WalletIcon />
          <p className="text-xs font-medium tracking-wide uppercase">Pocket Flow</p>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Tu resumen</h2>
        <p className="text-sm text-muted-foreground">
          Balance, gastos y movimientos en un solo lugar.
        </p>
      </div>

      <DashboardCard title="Balance" value={formatCurrency(12450)} hint="Este mes" />

      <div className="grid grid-cols-2 gap-3">
        <DashboardCard title="Ingresos" value={formatCurrency(18500)} />
        <DashboardCard title="Gastos" value={formatCurrency(6050)} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Movimientos</p>
        {PREVIEW_MOVEMENTS.map((movement) => {
          const Icon = getCategoryIcon(movement.icon)
          const isIncome = movement.type === 'income'

          return (
            <div
              key={movement.title}
              className="glass-panel flex items-center gap-3 rounded-2xl px-3 py-2.5"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-muted text-foreground [&_svg]:size-4">
                <Icon />
              </div>
              <p className="min-w-0 flex-1 truncate text-sm font-medium">{movement.title}</p>
              <p className="text-sm font-semibold tabular-nums">
                {isIncome ? '+' : '-'}
                {formatCurrency(movement.amount)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
