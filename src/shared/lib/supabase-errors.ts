export function mapAuthError(error: { message: string }): Error {
  const message = error.message.toLowerCase()

  if (message.includes('invalid login credentials')) {
    return new Error('Correo o contraseña incorrectos')
  }

  if (message.includes('already registered') || message.includes('already been registered')) {
    return new Error('Ya existe una cuenta con este correo')
  }

  if (message.includes('email not confirmed')) {
    return new Error('Confirma tu correo para iniciar sesión')
  }

  if (message.includes('user already exists')) {
    return new Error('Ya existe una cuenta con este correo')
  }

  if (message.includes('password should') || message.includes('weak password')) {
    return new Error('La contraseña no cumple los requisitos')
  }

  return new Error(error.message)
}

export function mapDataError(error: unknown, fallbackMessage: string): Error {
  if (error instanceof Error && error.message) {
    return error
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message
  ) {
    return new Error(error.message)
  }

  return new Error(fallbackMessage)
}
