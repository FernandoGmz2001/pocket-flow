import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router'

import { ThemeProvider } from '@/app/theme-provider.tsx'
import { AppShell } from '@/components/AppShell.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
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
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="movimientos/:transactionId" element={<TransactionDetailPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
