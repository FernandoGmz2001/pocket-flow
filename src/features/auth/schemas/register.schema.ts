import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'El nombre es obligatorio'),
    email: z.string().trim().email('Ingresa un correo válido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  })

export type RegisterSchema = z.infer<typeof registerSchema>
