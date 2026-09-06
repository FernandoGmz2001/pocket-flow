export function handleApiError(error: unknown, fallbackMessage: string): never {
  if (error instanceof Error) {
    throw error
  }

  throw new Error(fallbackMessage)
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}
