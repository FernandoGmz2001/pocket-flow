import { ChartColumnIcon } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart.tsx'
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
import { formatCurrency } from '@/shared/lib/format.ts'

const chartConfig = {
  average: {
    label: 'Promedio',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

interface CategoryStatsProps {
  transactions: ITransaction[]
  categories: ICategory[]
  isLoading?: boolean
}

export function CategoryStats({
  transactions,
  categories,
  isLoading = false,
}: CategoryStatsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Promedio de gastos por categoría</CardTitle>
          <CardDescription>
            Gasto medio por movimiento en el periodo seleccionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[180px] w-full rounded-xl md:h-[200px]" />
        </CardContent>
      </Card>
    )
  }

  const expenses = transactions.filter((transaction) => transaction.type === 'expense')
  const totalsByCategory = new Map<string, { total: number; count: number }>()

  for (const expense of expenses) {
    const current = totalsByCategory.get(expense.categoryId) ?? { total: 0, count: 0 }
    current.total += expense.amount
    current.count += 1
    totalsByCategory.set(expense.categoryId, current)
  }

  const chartData = categories
    .flatMap((category) => {
      const current = totalsByCategory.get(category.id)
      if (!current) {
        return []
      }

      return [
        {
          category: category.name,
          average: current.total / current.count,
        },
      ]
    })
    .sort((left, right) => right.average - left.average)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promedio de gastos por categoría</CardTitle>
        <CardDescription>
          Gasto medio por movimiento en el periodo seleccionado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <Empty className="border-dashed py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ChartColumnIcon />
              </EmptyMedia>
              <EmptyTitle>Sin gastos en este periodo</EmptyTitle>
              <EmptyDescription>
                Cambia el filtro o registra un gasto para ver el promedio por categoría.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[180px] w-full md:h-[200px]">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tickFormatter={(value: string) =>
                  value.length > 10 ? `${value.slice(0, 10)}…` : value
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <div className="flex flex-1 items-center justify-between gap-4 leading-none">
                        <span className="text-muted-foreground">Promedio</span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {formatCurrency(Number(value))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="average"
                fill="var(--color-average)"
                radius={4}
                maxBarSize={48}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
