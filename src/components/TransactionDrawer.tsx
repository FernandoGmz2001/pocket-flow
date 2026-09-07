import { useEffect, useEffectEvent, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer.tsx'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useGetCategories } from '@/features/categories/services/queries.ts'
import type { CreateTransactionSchema } from '@/features/transactions/schemas/create.schema.ts'
import { createTransactionSchema } from '@/features/transactions/schemas/create.schema.ts'
import { useCreateTransaction } from '@/features/transactions/services/queries.ts'
import { useMediaQuery } from '@/shared/hooks/use-media-query.ts'
import { todayDateInput } from '@/shared/lib/format.ts'
import { PAYMENT_METHOD_OPTIONS } from '@/shared/lib/payment-method.ts'

interface TransactionDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getDefaultValues(categoryId = ''): CreateTransactionSchema {
  return {
    type: 'expense',
    paymentMethod: 'debit',
    title: '',
    amount: undefined as unknown as number,
    categoryId,
    date: todayDateInput(),
    description: '',
  }
}

export function TransactionDrawer({ open, onOpenChange }: TransactionDrawerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const titleInputRef = useRef<HTMLInputElement | null>(null)
  const { data: categories = [] } = useGetCategories()
  const { mutateAsync: saveTransaction, isPending } = useCreateTransaction()

  const form = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: getDefaultValues(),
  })

  const titleRegister = form.register('title')

  const focusTitleInput = useEffectEvent(() => {
    titleInputRef.current?.focus()
  })

  useEffect(() => {
    if (!open) {
      return
    }

    const frameId = requestAnimationFrame(() => {
      focusTitleInput()
    })

    return () => cancelAnimationFrame(frameId)
  }, [open])

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }))
  const paymentMethodItems = Object.fromEntries(
    PAYMENT_METHOD_OPTIONS.map((option) => [option.value, option.label]),
  )

  async function onSubmit(values: CreateTransactionSchema) {
    await saveTransaction({
      title: values.title,
      amount: values.amount,
      type: values.type,
      paymentMethod: values.paymentMethod,
      categoryId: values.categoryId,
      date: values.date,
      description: values.description || undefined,
    })
    toast.success('Movimiento guardado')
    form.reset(getDefaultValues(categories[0]?.id ?? ''))
    onOpenChange(false)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      form.reset(getDefaultValues(categories[0]?.id ?? ''))
    }
    onOpenChange(nextOpen)
  }

  const fields = (
    <FieldGroup>
      <Field>
        <FieldLabel>
          Tipo <span className="text-destructive">*</span>
        </FieldLabel>
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <ToggleGroup
              className="w-full rounded-md"
              variant="outline"
              value={[field.value]}
              onValueChange={(value) => {
                if (value[0]) {
                  field.onChange(value[0])
                }
              }}
            >
              <ToggleGroupItem className="flex-1 rounded-md" value="expense">
                Gasto
              </ToggleGroupItem>
              <ToggleGroupItem className="flex-1 rounded-md" value="income">
                Ingreso
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        />
      </Field>

      <Field data-invalid={!!form.formState.errors.paymentMethod || undefined}>
        <FieldLabel>
          Tipo de pago <span className="text-destructive">*</span>
        </FieldLabel>
        <Controller
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <Select
              value={field.value || null}
              onValueChange={(value) => {
                if (value) {
                  field.onChange(value)
                }
              }}
              items={paymentMethodItems}
            >
              <SelectTrigger
                className="w-full rounded-md"
                aria-invalid={!!form.formState.errors.paymentMethod || undefined}
              >
                <SelectValue placeholder="Selecciona el tipo de pago" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
                <SelectGroup>
                  {PAYMENT_METHOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError errors={[form.formState.errors.paymentMethod]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.title || undefined}>
        <FieldLabel htmlFor="transaction-title">
          Nombre <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="transaction-title"
          placeholder="Cena, salario, uber..."
          className="rounded-md"
          aria-invalid={!!form.formState.errors.title || undefined}
          {...titleRegister}
          ref={(element) => {
            titleRegister.ref(element)
            titleInputRef.current = element
          }}
        />
        <FieldError errors={[form.formState.errors.title]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.amount || undefined}>
        <FieldLabel htmlFor="transaction-amount">
          Cantidad <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="transaction-amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          className="rounded-md"
          aria-invalid={!!form.formState.errors.amount || undefined}
          {...form.register('amount')}
        />
        <FieldError errors={[form.formState.errors.amount]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.categoryId || undefined}>
        <FieldLabel>
          Categoría <span className="text-destructive">*</span>
        </FieldLabel>
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field }) => {
            const selectedCategory =
              categoryOptions.find((category) => category.id === field.value) ?? null

            return (
              <Combobox
                items={categoryOptions}
                value={selectedCategory}
                onValueChange={(category) => {
                  field.onChange(category?.id ?? '')
                }}
                itemToStringLabel={(category) => category.name}
                itemToStringValue={(category) => category.id}
                isItemEqualToValue={(item, value) => item.id === value.id}
              >
                <ComboboxInput
                  placeholder="Buscar categoría..."
                  className="w-full rounded-md"
                  aria-invalid={!!form.formState.errors.categoryId || undefined}
                />
                <ComboboxContent>
                  <ComboboxEmpty>No se encontraron categorías.</ComboboxEmpty>
                  <ComboboxList>
                    {(category) => (
                      <ComboboxItem key={category.id} value={category}>
                        {category.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )
          }}
        />
        <FieldError errors={[form.formState.errors.categoryId]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.date || undefined}>
        <FieldLabel htmlFor="transaction-date">
          Fecha <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="transaction-date"
          type="date"
          className="rounded-md"
          aria-invalid={!!form.formState.errors.date || undefined}
          {...form.register('date')}
        />
        <FieldError errors={[form.formState.errors.date]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="transaction-description">Descripción</FieldLabel>
        <Textarea
          id="transaction-description"
          placeholder="Opcional"
          className="min-h-16 resize-none rounded-md md:min-h-14"
          rows={2}
          {...form.register('description')}
        />
      </Field>
    </FieldGroup>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-4 overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Nuevo movimiento</DialogTitle>
            <DialogDescription>
              Registra un ingreso o un gasto en tu flujo.
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {fields}
            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                size="lg"
                className="h-12 min-w-48 rounded-md text-base"
                disabled={isPending}
              >
                {isPending ? 'Guardando...' : 'Guardar movimiento'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (isOpen) {
          form.reset(getDefaultValues(categories[0]?.id ?? ''))
        }
      }}
      showSwipeHandle
    >
      <DrawerContent className="mx-auto w-full max-w-lg rounded-t-md">
        <DrawerHeader>
          <DrawerTitle>Nuevo movimiento</DrawerTitle>
          <DrawerDescription>
            Registra un ingreso o un gasto en tu flujo.
          </DrawerDescription>
        </DrawerHeader>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex-1 overflow-y-auto px-4 py-4">{fields}</div>
          <DrawerFooter className="pb-[max(2rem,calc(env(safe-area-inset-bottom)+1rem))]">
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full rounded-md text-base"
              disabled={isPending}
            >
              {isPending ? 'Guardando...' : 'Guardar movimiento'}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
