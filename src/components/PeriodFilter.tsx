import { motion, useReducedMotion } from 'motion/react'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'
import { cn } from '@/lib/utils.ts'
import { SPRING, TOGGLE_TAP } from '@/shared/lib/motion.ts'
import type { PeriodKey } from '@/shared/lib/period.ts'
import { PERIOD_OPTIONS } from '@/shared/lib/period.ts'

interface PeriodFilterProps {
  value: PeriodKey
  onChange: (period: PeriodKey) => void
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  const prefersReducedMotion = useReducedMotion()
  const motionOn = !prefersReducedMotion

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
        <motion.div
          key={option.value}
          className="min-w-0 flex-1"
          whileTap={motionOn ? TOGGLE_TAP : undefined}
          transition={SPRING}
        >
          <ToggleGroupItem
            className={cn(
              'w-full',
              'data-[pressed]:bg-primary data-[pressed]:text-primary-foreground data-[pressed]:hover:bg-primary data-[pressed]:hover:text-primary-foreground',
              'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
              'aria-pressed:bg-primary aria-pressed:text-primary-foreground',
            )}
            value={option.value}
          >
            {option.label}
          </ToggleGroupItem>
        </motion.div>
      ))}
    </ToggleGroup>
  )
}
