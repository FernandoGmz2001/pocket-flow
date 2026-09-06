export type PeriodKey = 'day' | 'week' | 'month' | 'year' | 'all'

export const PERIOD_OPTIONS = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
  { value: 'all', label: 'Todo' },
] as const

function toDateInput(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000

  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

export function isInPeriod(isoDate: string, period: PeriodKey, now = new Date()) {
  if (period === 'all') {
    return true
  }

  if (period === 'day') {
    return isoDate === toDateInput(now)
  }

  if (period === 'week') {
    const weekday = now.getDay()
    const mondayOffset = weekday === 0 ? 6 : weekday - 1
    const start = new Date(now)
    start.setDate(now.getDate() - mondayOffset)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    return isoDate >= toDateInput(start) && isoDate <= toDateInput(end)
  }

  if (period === 'month') {
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return isoDate.startsWith(prefix)
  }

  return isoDate.startsWith(String(now.getFullYear()))
}

export function getPeriodHint(period: PeriodKey) {
  if (period === 'day') {
    return 'Hoy'
  }

  if (period === 'week') {
    return 'Esta semana'
  }

  if (period === 'month') {
    return 'Este mes'
  }

  if (period === 'year') {
    return 'Este año'
  }

  return 'Todo el historial'
}
