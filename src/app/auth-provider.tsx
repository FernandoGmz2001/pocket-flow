import { createContext, use, useEffect, useEffectEvent, useState, type ReactNode } from 'react'

import type { IUser } from '@/features/auth/interfaces/user.interface.ts'
import { mapAuthUser } from '@/shared/lib/supabase-mappers.ts'
import { supabase } from '@/shared/lib/supabase.ts'

interface AuthContextValue {
  user: IUser | null
  isReady: boolean
  setUser: (user: IUser | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  const syncSession = useEffectEvent((nextUser: IUser | null) => {
    setUser(nextUser)
    setIsReady(true)
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      syncSession(data.session?.user ? mapAuthUser(data.session.user) : null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session?.user ? mapAuthUser(session.user) : null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <AuthContext value={{ user, isReady, setUser }}>{children}</AuthContext>
}

export function useAuth() {
  const context = use(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
