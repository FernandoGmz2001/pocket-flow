import { createContext, use, useEffect, useEffectEvent, useState, type ReactNode } from 'react'

import {
  applyColorPalette,
  applyTheme,
  getStoredColorPalette,
  getStoredTheme,
  PALETTE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  type ColorPalette,
  type Theme,
} from '@/shared/lib/theme.ts'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  colorPalette: ColorPalette
  setColorPalette: (palette: ColorPalette) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = getStoredTheme()
    applyTheme(stored)
    return stored
  })
  const [colorPalette, setColorPaletteState] = useState<ColorPalette>(() => {
    const stored = getStoredColorPalette()
    applyColorPalette(stored)
    return stored
  })

  function setTheme(nextTheme: Theme) {
    setThemeState(nextTheme)
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    applyTheme(nextTheme)
  }

  function setColorPalette(nextPalette: ColorPalette) {
    setColorPaletteState(nextPalette)
    localStorage.setItem(PALETTE_STORAGE_KEY, nextPalette)
    applyColorPalette(nextPalette)
  }

  const toggleTheme = useEffectEvent(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  })

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.isComposing || event.repeat) {
        return
      }

      const isToggleShortcut =
        event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !event.shiftKey &&
        event.code === 'KeyD'

      if (!isToggleShortcut) {
        return
      }

      event.preventDefault()
      toggleTheme()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <ThemeContext value={{ theme, setTheme, colorPalette, setColorPalette }}>
      {children}
    </ThemeContext>
  )
}

export function useTheme() {
  const context = use(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
