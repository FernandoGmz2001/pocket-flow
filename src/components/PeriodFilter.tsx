import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'
import { cn } from '@/lib/utils.ts'
import type { PeriodKey } from '@/shared/lib/period.ts'
import { PERIOD_OPTIONS } from '@/shared/lib/period.ts'

interface PeriodFilterProps {
  value: PeriodKey
  onChange: (period: PeriodKey) => void
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <ToggleGroup
      className="w-full max-w-full flex-wrap"
      variant="outline"
      value={[value]}
      onValueChange={(nextValue) => {
        const nextPeriod = nextValue[0] as PeriodKey | undefined
        if (nextPeriod) {
          onChange(nextPeriod)
        }
      }}
    >
      {PERIOD_OPTIONS.map((option) => (
        <ToggleGroupItem
          key={option.value}
          className={cn(
            'flex-1',
            'data-[pressed]:bg-primary data-[pressed]:text-primary-foreground data-[pressed]:hover:bg-primary data-[pressed]:hover:text-primary-foreground',
            'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
            'aria-pressed:bg-primary aria-pressed:text-primary-foreground',
          )}
          value={option.value}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
