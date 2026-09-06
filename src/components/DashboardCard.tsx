import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

interface DashboardCardProps {
  title: string
  value: string
  hint?: string
  isLoading?: boolean
}

export function DashboardCard({
  title,
  value,
  hint,
  isLoading = false,
}: DashboardCardProps) {
  return (
    <Card size="sm" className="glass-panel gap-2 py-3 ring-0">
      <CardHeader className="gap-0">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-28" />
        ) : (
          <p className="text-xl font-semibold tracking-tight md:text-2xl">{value}</p>
        )}
        {hint ? (
          <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
