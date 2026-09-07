import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button.tsx'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'
import { PasswordField } from '@/features/auth/components/PasswordField.tsx'
import type { LoginSchema } from '@/features/auth/schemas/login.schema.ts'
import { loginSchema } from '@/features/auth/schemas/login.schema.ts'
import { useLogin } from '@/features/auth/services/queries.ts'

export function LoginForm() {
  const { mutateAsync: login, isPending } = useLogin()
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginSchema) {
    await login(values)
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.email || undefined}>
          <FieldLabel htmlFor="login-email">Correo</FieldLabel>
          <Input
            id="login-email"
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
          id="login-password"
          label="Contraseña"
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          error={form.formState.errors.password}
          registration={form.register('password')}
          action={
            <Button
              type="button"
              variant="link"
              className="h-auto px-0 text-xs underline"
              onClick={() =>
                toast.message('Si olvidaste tu contraseña, entra con Google o crea otra cuenta.')
              }
            >
              ¿Olvidaste tu contraseña?
            </Button>
          }
        />
      </FieldGroup>

      <Button type="submit" className="h-11 w-full rounded-xl" disabled={isPending}>
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        {isPending ? 'Entrando...' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
