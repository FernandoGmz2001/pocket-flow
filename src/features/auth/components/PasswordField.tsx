import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field.tsx'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group.tsx'

interface PasswordFieldProps {
  id: string
  label: string
  autoComplete?: string
  placeholder?: string
  action?: ReactNode
  error?: { message?: string }
  registration: UseFormRegisterReturn
}

export function PasswordField({
  id,
  label,
  autoComplete,
  placeholder,
  action,
  error,
  registration,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Field data-invalid={!!error || undefined}>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {action}
      </div>
      <InputGroup className="h-11 rounded-xl">
        <InputGroupInput
          id={id}
          type={isVisible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={!!error || undefined}
          {...registration}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setIsVisible((current) => !current)}
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldError errors={[error]} />
    </Field>
  )
}
