import type { ILogin } from '@/features/auth/interfaces/login.interface.ts'
import type { IRegister } from '@/features/auth/interfaces/register.interface.ts'
import type { IUser } from '@/features/auth/interfaces/user.interface.ts'
import { mapAuthError } from '@/shared/lib/supabase-errors.ts'
import { mapAuthUser } from '@/shared/lib/supabase-mappers.ts'
import { supabase } from '@/shared/lib/supabase.ts'

export async function login(payload: ILogin): Promise<IUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email.trim(),
    password: payload.password,
  })

  if (error) {
    throw mapAuthError(error)
  }

  if (!data.user) {
    throw new Error('No se pudo iniciar sesión')
  }

  return mapAuthUser(data.user)
}

export async function register(payload: IRegister): Promise<IUser> {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email.trim(),
    password: payload.password,
    options: {
      data: { name: payload.name.trim() },
    },
  })

  if (error) {
    throw mapAuthError(error)
  }

  if (!data.user) {
    throw new Error('No se pudo crear la cuenta')
  }

  if (data.user.identities && data.user.identities.length === 0) {
    throw new Error('Ya existe una cuenta con este correo')
  }

  if (!data.session) {
    throw new Error('Cuenta creada. Confirma tu correo para iniciar sesión.')
  }

  return mapAuthUser(data.user)
}

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  })

  if (error) {
    throw mapAuthError(error)
  }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw mapAuthError(error)
  }
}
