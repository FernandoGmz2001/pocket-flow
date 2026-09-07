import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button.tsx'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import type { ICategory } from '@/features/categories/interfaces/get-all.interface.ts'
import type { CreateCategorySchema } from '@/features/categories/schemas/create.schema.ts'
import { createCategorySchema } from '@/features/categories/schemas/create.schema.ts'
import {
  useCreateCategory,
  useUpdateCategory,
} from '@/features/categories/services/queries.ts'
import {
  CATEGORY_ICON_KEYS,
  CATEGORY_ICONS,
  DEFAULT_CATEGORY_COLOR,
  type CategoryIconKey,
} from '@/shared/lib/category-icons.ts'
import { cn } from '@/lib/utils.ts'

interface CategoryFormProps {
  category?: ICategory | null
  onCancel?: () => void
  onSaved?: () => void
}

function toIconKey(icon: string): CategoryIconKey {
  return CATEGORY_ICON_KEYS.includes(icon as CategoryIconKey)
    ? (icon as CategoryIconKey)
    : CATEGORY_ICON_KEYS[0]
}

export function CategoryForm({ category, onCancel, onSaved }: CategoryFormProps) {
  const isEditing = Boolean(category)
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory()
  const isPending = isCreating || isUpdating

  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name ?? '',
      icon: category ? toIconKey(category.icon) : CATEGORY_ICON_KEYS[0],
    },
  })

  async function onSubmit(values: CreateCategorySchema) {
    if (category) {
      await updateCategory({
        id: category.id,
        payload: {
          name: values.name,
          icon: values.icon,
          color: category.color,
        },
      })
      toast.success('Categoría actualizada')
      onSaved?.()
      return
    }

    await createCategory({
      name: values.name,
      icon: values.icon,
      color: DEFAULT_CATEGORY_COLOR,
    })
    toast.success('Categoría creada')
    form.reset({
      name: '',
      icon: CATEGORY_ICON_KEYS[0],
    })
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name || undefined}>
          <FieldLabel htmlFor="category-name">Nombre</FieldLabel>
          <Input
            id="category-name"
            placeholder="Streaming, gym, mascotas..."
            aria-invalid={!!form.formState.errors.name || undefined}
            {...form.register('name')}
          />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>

        <Field>
          <FieldLabel>Icono</FieldLabel>
          <Controller
            control={form.control}
            name="icon"
            render={({ field }) => (
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                {CATEGORY_ICON_KEYS.map((iconKey) => {
                  const Icon = CATEGORY_ICONS[iconKey]

                  return (
                    <button
                      key={iconKey}
                      type="button"
                      aria-label={iconKey}
                      aria-pressed={field.value === iconKey}
                      className={cn(
                        'flex size-10 items-center justify-center rounded-xl border transition-colors',
                        field.value === iconKey
                          ? 'border-foreground/40 bg-muted text-foreground'
                          : 'border-border bg-background/70 text-muted-foreground',
                      )}
                      onClick={() => field.onChange(iconKey)}
                    >
                      <Icon />
                    </button>
                  )
                })}
              </div>
            )}
          />
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-2">
        <Button type="submit" size="lg" className="h-12 text-base" disabled={isPending}>
          {isPending
            ? isEditing
              ? 'Guardando...'
              : 'Creando...'
            : isEditing
              ? 'Guardar cambios'
              : 'Crear categoría'}
        </Button>
        {isEditing ? (
          <Button type="button" variant="outline" size="lg" className="h-12 text-base" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
      </div>
    </form>
  )
}
