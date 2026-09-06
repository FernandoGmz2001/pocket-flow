import { SettingsIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import { cn } from '@/lib/utils.ts'

export function TopMenu() {
  const location = useLocation()

  if (location.pathname === '/settings' || location.pathname.startsWith('/movimientos/')) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-end px-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8">
      <nav aria-label="Configuración" className="pointer-events-auto">
        <Link
          to="/settings"
          className={cn(
            'glass-panel flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-foreground shadow-[0_10px_40px_rgba(24,24,27,0.08)] transition-colors [&_svg]:size-4',
            'hover:bg-muted/80',
          )}
        >
          <SettingsIcon />
          Ajustes
        </Link>
      </nav>
    </div>
  )
}
