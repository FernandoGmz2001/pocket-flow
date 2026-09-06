import { LogOutIcon, MoonIcon, PaletteIcon, RotateCcwIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import { useTheme } from '@/app/theme-provider.tsx'
import { CategoryForm } from '@/components/CategoryForm.tsx'
import { CategoryList } from '@/components/CategoryList.tsx'
import { ColorPalettePicker } from '@/components/ColorPalettePicker.tsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'
import { Button, buttonVariants } from '@/components/ui/button.tsx'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import type { ICategory } from '@/features/categories/interfaces/get-all.interface.ts'
import { useGetCategories } from '@/features/categories/services/queries.ts'
import { cn } from '@/lib/utils.ts'
import { useResetAppData } from '@/shared/services/app-data/queries.ts'

const RESET_CONFIRMATION_PHRASE = 'REESTABLECER'

export function SettingsPage() {
  const { data: categories = [], isLoading } = useGetCategories()
  const { theme, setTheme, colorPalette, setColorPalette } = useTheme()
  const { mutate: resetAppData, isPending: isResetting } = useResetAppData()
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [resetConfirmation, setResetConfirmation] = useState('')
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null)
  const canConfirmReset = resetConfirmation.trim() === RESET_CONFIRMATION_PHRASE

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Ajustes</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona categorías y la apariencia de la app.
          </p>
        </div>
        <Link
          to="/"
          aria-label="Cerrar ajustes"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }))}
        >
          <XIcon />
        </Link>
      </header>

      <section className="glass-panel flex flex-col gap-4 rounded-2xl p-4 md:p-6">
        <div className="flex items-center gap-2">
          <MoonIcon />
          <h2 className="text-sm font-medium">Apariencia</h2>
        </div>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="dark-mode">Modo oscuro</FieldLabel>
            <FieldDescription>
              Cambia entre el tema claro y el oscuro. Atajo: Ctrl + D.
            </FieldDescription>
          </FieldContent>
          <Switch
            id="dark-mode"
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </Field>
      </section>

      <section className="glass-panel flex flex-col gap-4 rounded-2xl p-4 md:p-6">
        <div className="flex items-center gap-2">
          <PaletteIcon />
          <h2 className="text-sm font-medium">Color del tema</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          El color se aplica al modo claro y al oscuro: botones, filtros y gráfica.
        </p>
        <ColorPalettePicker value={colorPalette} onChange={setColorPalette} />
      </section>

      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <section className="glass-panel flex flex-col gap-4 rounded-2xl p-4 md:p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium">Tus categorías</h2>
            <p className="text-xs text-muted-foreground">
              Edita cualquiera. Solo puedes eliminar las que creaste.
            </p>
          </div>

          <CategoryList
            categories={categories}
            isLoading={isLoading}
            editingId={editingCategory?.id}
            onEdit={setEditingCategory}
            onDeleted={(categoryId) => {
              if (editingCategory?.id === categoryId) {
                setEditingCategory(null)
              }
            }}
          />
        </section>

        <section className="glass-panel flex flex-col gap-4 rounded-2xl p-4 md:p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium">
              {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {editingCategory
                ? 'Cambia el nombre o el icono y guarda los cambios.'
                : 'Elige un nombre y un icono para clasificar movimientos.'}
            </p>
          </div>
          <CategoryForm
            key={editingCategory?.id ?? 'create'}
            category={editingCategory}
            onCancel={() => setEditingCategory(null)}
            onSaved={() => setEditingCategory(null)}
          />
        </section>
      </div>

      <AlertDialog
        open={isResetDialogOpen}
        onOpenChange={(open) => {
          setIsResetDialogOpen(open)
          if (!open) {
            setResetConfirmation('')
          }
        }}
      >
        <AlertDialogTrigger
          render={
            <Button variant="outline" className="w-full" disabled={isResetting} />
          }
        >
          <RotateCcwIcon data-icon="inline-start" />
          Reestablecer todo
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reestablecer todo?</AlertDialogTitle>
            <AlertDialogDescription>
              Se borrarán todos los movimientos y las categorías que hayas creado. Las
              categorías base no se eliminan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Field>
            <FieldLabel htmlFor="reset-confirmation">
              Escribe {RESET_CONFIRMATION_PHRASE} para confirmar
            </FieldLabel>
            <Input
              id="reset-confirmation"
              value={resetConfirmation}
              autoComplete="off"
              spellCheck={false}
              placeholder={RESET_CONFIRMATION_PHRASE}
              onChange={(event) => setResetConfirmation(event.target.value)}
            />
          </Field>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!canConfirmReset || isResetting}
              onClick={() => {
                if (!canConfirmReset) {
                  return
                }

                resetAppData(undefined, {
                  onSuccess: () => {
                    setIsResetDialogOpen(false)
                    setResetConfirmation('')
                    toast.success('Movimientos borrados. Las categorías base se conservan.')
                    setEditingCategory(null)
                  },
                })
              }}
            >
              Reestablecer todo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        type="button"
        variant="destructive"
        className="w-full"
        onClick={() => toast.success('Sesión cerrada')}
      >
        <LogOutIcon data-icon="inline-start" />
        Cerrar sesión
      </Button>
    </div>
  )
}
