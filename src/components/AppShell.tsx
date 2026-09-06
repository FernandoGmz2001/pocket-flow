import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'

import { TopMenu } from '@/components/TopMenu.tsx'
import { TransactionDrawer } from '@/components/TransactionDrawer.tsx'
import { Button } from '@/components/ui/button.tsx'

export function AppShell() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()
  const showFab =
    location.pathname !== '/settings' && !location.pathname.startsWith('/movimientos/')

  return (
    <div className="relative min-h-dvh bg-background">
      <TopMenu />

      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col pt-[env(safe-area-inset-top)]">
        <main className="flex-1 overflow-y-auto px-5 pt-20 pb-28 md:px-8 md:pt-24 md:pb-12">
          <Outlet />
        </main>

        {showFab ? (
          <Button
            type="button"
            size="icon-lg"
            aria-label="Añadir movimiento"
            className="fixed right-5 bottom-6 z-40 size-14 !rounded-full shadow-lg md:right-8 md:bottom-8"
            onClick={() => setIsDrawerOpen(true)}
          >
            <PlusIcon />
          </Button>
        ) : null}
      </div>

      <TransactionDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}
