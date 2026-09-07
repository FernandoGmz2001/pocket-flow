import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { useAuth } from '@/app/auth-provider.tsx'
import type { ILogin } from '@/features/auth/interfaces/login.interface.ts'
import type { IRegister } from '@/features/auth/interfaces/register.interface.ts'
import {
  login,
  loginWithGoogle,
  logout,
  register,
} from '@/features/auth/services/endpoints.ts'
import { getErrorMessage } from '@/shared/lib/errors.ts'

export function useLogin() {
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (payload: ILogin) => login(payload),
    onSuccess: (user) => {
      setUser(user)
      queryClient.clear()
      toast.success(`Bienvenido, ${user.name}`)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo iniciar sesión'))
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (payload: IRegister) => register(payload),
    onSuccess: (user) => {
      setUser(user)
      queryClient.clear()
      toast.success(`Cuenta creada. Hola, ${user.name}`)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo crear la cuenta'))
    },
  })
}

export function useLoginWithGoogle() {
  return useMutation({
    mutationFn: loginWithGoogle,
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo iniciar sesión con Google'))
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const { setUser } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null)
      queryClient.clear()
      toast.success('Sesión cerrada')
      navigate('/login', { replace: true })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo cerrar la sesión'))
    },
  })
}
