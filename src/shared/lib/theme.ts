export const THEME_STORAGE_KEY = 'pocket-flow:theme'
export const PALETTE_STORAGE_KEY = 'pocket-flow:palette'

export type Theme = 'light' | 'dark'

export const COLOR_PALETTES = [
  { id: 'zinc', label: 'Gris', swatch: 'oklch(0.37 0 0)' },
  { id: 'red', label: 'Rojo', swatch: 'oklch(0.76 0.09 18)' },
  { id: 'orange', label: 'Naranja', swatch: 'oklch(0.78 0.09 55)' },
  { id: 'yellow', label: 'Amarillo', swatch: 'oklch(0.86 0.09 95)' },
  { id: 'green', label: 'Matcha', swatch: 'oklch(0.74 0.075 128)' },
  { id: 'teal', label: 'Turquesa', swatch: 'oklch(0.76 0.07 185)' },
  { id: 'blue', label: 'Cian', swatch: 'oklch(0.76 0.08 205)' },
  { id: 'purple', label: 'Morado', swatch: 'oklch(0.76 0.08 305)' },
  { id: 'pink', label: 'Rosa', swatch: 'oklch(0.8 0.08 350)' },
] as const

export type ColorPalette = (typeof COLOR_PALETTES)[number]['id']

export function isColorPalette(value: string | null): value is ColorPalette {
  return COLOR_PALETTES.some((palette) => palette.id === value)
}

export function getStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function getStoredColorPalette(): ColorPalette {
  try {
    const stored = localStorage.getItem(PALETTE_STORAGE_KEY)
    return isColorPalette(stored) ? stored : 'zinc'
  } catch {
    return 'zinc'
  }
}

export function applyTheme(theme: Theme) {
  const isDark = theme === 'dark'
  document.documentElement.classList.toggle('dark', isDark)

  const themeColor = document.querySelector('meta[name="theme-color"]')
  if (themeColor) {
    themeColor.setAttribute('content', isDark ? '#252525' : '#f4f4f4')
  }
}

export function applyColorPalette(palette: ColorPalette) {
  document.documentElement.dataset.palette = palette
}
