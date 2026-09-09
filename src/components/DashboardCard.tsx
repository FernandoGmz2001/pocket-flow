import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { fadeUpVariants, SPRING } from '@/shared/lib/motion.ts'

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
  const prefersReducedMotion = useReducedMotion()
  const motionOn = !prefersReducedMotion

  return (
    <Card size="sm" className="glass-panel h-full gap-2 py-3 ring-0">
      <CardHeader className="gap-0">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-7 md:min-h-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={motionOn ? 'hidden' : false}
                animate="show"
                exit="exit"
                variants={fadeUpVariants}
              >
                <Skeleton className="h-7 w-28" />
              </motion.div>
            ) : (
              <motion.p
                key={value}
                className="text-xl font-semibold tracking-tight md:text-2xl"
                initial={motionOn ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={SPRING}
              >
                {value}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-1 min-h-[1rem]">
          <AnimatePresence mode="wait">
            {hint ? (
              <motion.p
                key={hint}
                className="text-[11px] text-muted-foreground"
                initial={motionOn ? { opacity: 0, y: 4 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={SPRING}
              >
                {hint}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
