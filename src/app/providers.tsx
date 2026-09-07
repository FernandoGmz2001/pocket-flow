import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { AuthProvider } from '@/app/auth-provider.tsx'
import { ThemeProvider } from '@/app/theme-provider.tsx'
import { AppShell } from '@/components/AppShell.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute.tsx'
import { AuthPage } from '@/pages/AuthPage.tsx'
import { DashboardPage } from '@/pages/DashboardPage.tsx'
import { SettingsPage } from '@/pages/SettingsPage.tsx'
import { TransactionDetailPage } from '@/pages/TransactionDetailPage.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="login" element={<AuthPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="movimientos/:transactionId" element={<TransactionDetailPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        <Toaster position="top-center" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
