import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button.tsx'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'
import { PasswordField } from '@/features/auth/components/PasswordField.tsx'
import type { RegisterSchema } from '@/features/auth/schemas/register.schema.ts'
import { registerSchema } from '@/features/auth/schemas/register.schema.ts'
import { useRegister } from '@/features/auth/services/queries.ts'

export function RegisterForm() {
  const { mutateAsync: register, isPending } = useRegister()
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: RegisterSchema) {
    await register({
      name: values.name,
      email: values.email,
      password: values.password,
    })
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name || undefined}>
          <FieldLabel htmlFor="register-name">Nombre</FieldLabel>
          <Input
            id="register-name"
            autoComplete="name"
            placeholder="Tu nombre"
            className="h-11 rounded-xl"
            aria-invalid={!!form.formState.errors.name || undefined}
            {...form.register('name')}
          />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.email || undefined}>
          <FieldLabel htmlFor="register-email">Correo</FieldLabel>
          <Input
            id="register-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Ingresa tu correo"
            className="h-11 rounded-xl"
            aria-invalid={!!form.formState.errors.email || undefined}
            {...form.register('email')}
          />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>

        <PasswordField
          id="register-password"
          label="Contraseña"
          autoComplete="new-password"
          placeholder="Ingresa tu contraseña"
          error={form.formState.errors.password}
          registration={form.register('password')}
        />

        <PasswordField
          id="register-confirm-password"
          label="Confirmar contraseña"
          autoComplete="new-password"
          placeholder="Confirma tu contraseña"
          error={form.formState.errors.confirmPassword}
          registration={form.register('confirmPassword')}
        />
      </FieldGroup>

      <Button type="submit" className="h-11 w-full rounded-xl" disabled={isPending}>
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
    </form>
  )
}
