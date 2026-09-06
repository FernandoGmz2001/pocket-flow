export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatShortDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`)

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function formatLongDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`)
  const formatted = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

function toLocalDateInput(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000

  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

export function formatDayHeading(isoDate: string, now = new Date()) {
  const today = toLocalDateInput(now)
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (isoDate === today) {
    return 'Hoy'
  }

  if (isoDate === toLocalDateInput(yesterday)) {
    return 'Ayer'
  }

  const date = new Date(`${isoDate}T00:00:00`)
  const sameYear = date.getFullYear() === now.getFullYear()
  const formatted = new Intl.DateTimeFormat('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: sameYear ? undefined : 'numeric',
  }).format(date)

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function todayDateInput() {
  return toLocalDateInput(new Date())
}

export function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
