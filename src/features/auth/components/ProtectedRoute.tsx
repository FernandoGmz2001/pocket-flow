import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '@/app/auth-provider.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'

export function ProtectedRoute() {
  const { user, isReady } = useAuth()
  const location = useLocation()

  if (!isReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
