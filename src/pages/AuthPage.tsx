import { useState } from 'react'
import { Navigate, useLocation } from 'react-router'

import { useAuth } from '@/app/auth-provider.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'
import { AuthAppPreview } from '@/features/auth/components/AuthAppPreview.tsx'
import { AuthBackdrop } from '@/features/auth/components/AuthBackdrop.tsx'
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton.tsx'
import { LoginForm } from '@/features/auth/components/LoginForm.tsx'
import { RegisterForm } from '@/features/auth/components/RegisterForm.tsx'

interface LocationState {
  from?: { pathname: string }
}

export function AuthPage() {
  const { user, isReady } = useAuth()
  const location = useLocation()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/'
  const isLogin = mode === 'login'

  if (!isReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner />
      </div>
    )
  }

  if (user) {
    return <Navigate to={from === '/login' ? '/' : from} replace />
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <AuthBackdrop />

      <div className="relative flex min-h-dvh items-center justify-center px-4 py-8 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-4xl bg-card shadow-xl ring-1 ring-foreground/10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex w-full flex-col justify-center gap-8 px-6 py-8 sm:px-10 sm:py-12 lg:min-h-[42rem] lg:px-14 lg:py-14">
            <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
              <path
                d="M7 4 L13 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M13 4 L19 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                {isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? 'Continúa para ver tu resumen'
                  : 'Regístrate para ver tu resumen'}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <GoogleSignInButton
                label={isLogin ? 'Iniciar sesión con Google' : 'Registrarse con Google'}
              />

              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs tracking-wide text-muted-foreground uppercase">
                  O
                </span>
                <Separator className="flex-1" />
              </div>

              {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
              </p>
              <Button
                type="button"
                variant="link"
                className="h-auto px-0 font-semibold underline"
                onClick={() => setMode(isLogin ? 'register' : 'login')}
              >
                {isLogin ? 'Crear una cuenta' : 'Iniciar sesión'}
              </Button>
            </div>
          </div>

          <div className="pointer-events-none hidden border-l bg-muted lg:block">
            <AuthAppPreview />
          </div>
        </div>
      </div>
    </div>
  )
}
