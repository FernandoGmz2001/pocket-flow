import { COLOR_PALETTES, type ColorPalette } from '@/shared/lib/theme.ts'
import { cn } from '@/lib/utils.ts'

interface ColorPalettePickerProps {
  value: ColorPalette
  onChange: (palette: ColorPalette) => void
}

export function ColorPalettePicker({ value, onChange }: ColorPalettePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Color del tema"
      className="grid grid-cols-3 gap-2 sm:grid-cols-5"
    >
      {COLOR_PALETTES.map((palette) => {
        const isSelected = value === palette.id

        return (
          <button
            key={palette.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={palette.label}
            onClick={() => onChange(palette.id)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors',
              isSelected ? 'bg-muted' : 'hover:bg-muted/70',
            )}
          >
            <span
              className={cn(
                'size-8 rounded-full ring-2 ring-offset-2 ring-offset-card',
                isSelected ? 'ring-foreground' : 'ring-transparent',
              )}
              style={{ backgroundColor: palette.swatch }}
            />
            <span className="text-[11px] text-muted-foreground">{palette.label}</span>
          </button>
        )
      })}
    </div>
  )
}
