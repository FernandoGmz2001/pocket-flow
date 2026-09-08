import { useState } from 'react'
import { ChevronLeftIcon, PencilIcon, ReceiptIcon, Undo2Icon } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { TransactionDrawer } from '@/components/TransactionDrawer.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Button, buttonVariants } from '@/components/ui/button.tsx'
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { useGetCategories } from '@/features/categories/services/queries.ts'
import {
  useDeleteTransaction,
  useGetTransaction,
} from '@/features/transactions/services/queries.ts'
import { cn } from '@/lib/utils.ts'
import { getCategoryIcon } from '@/shared/lib/category-icons.ts'
import { formatCurrency, formatLongDate } from '@/shared/lib/format.ts'
import { formatPaymentMethod } from '@/shared/lib/payment-method.ts'

export function TransactionDetailPage() {
  const { transactionId } = useParams<{ transactionId: string }>()
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { data: transaction, isLoading: isLoadingTransaction } =
    useGetTransaction(transactionId)
  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetCategories()
  const { mutate: undoTransaction, isPending } = useDeleteTransaction()

  const isLoading = isLoadingTransaction || isLoadingCategories

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="flex flex-col gap-6">
        <Link
          to="/"
          aria-label="Volver"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon-lg' }),
            'self-start !rounded-full',
          )}
        >
          <ChevronLeftIcon />
        </Link>
        <Empty className="glass-panel border-dashed py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ReceiptIcon />
            </EmptyMedia>
            <EmptyTitle>Movimiento no encontrado</EmptyTitle>
            <EmptyDescription>
              Puede que ya se haya deshecho o no exista.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  const category = categories.find((item) => item.id === transaction.categoryId)
  const CategoryIcon = getCategoryIcon(category?.icon ?? 'wallet')
  const isIncome = transaction.type === 'income'
  const details = [
    { label: 'Categoría', value: category?.name ?? 'Sin categoría' },
    { label: 'Método de pago', value: formatPaymentMethod(transaction.paymentMethod) },
    { label: 'Fecha', value: formatLongDate(transaction.date) },
    { label: 'Notas', value: transaction.description?.trim() || 'Sin notas' },
  ]

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-3">
        <Link
          to="/"
          aria-label="Volver"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon-lg' }),
            'self-start !rounded-full',
          )}
        >
          <ChevronLeftIcon />
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Movimiento
            </h1>
            <p className="text-sm text-muted-foreground">
              Detalle del registro. Puedes editarlo o deshacerlo.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="shrink-0"
            onClick={() => setIsEditOpen(true)}
          >
            <PencilIcon data-icon="inline-start" />
            Editar
          </Button>
        </div>
      </header>

      <section className="glass-panel flex flex-col items-center gap-3 rounded-2xl p-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-foreground">
          <CategoryIcon />
        </span>
        <p className="text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">
          {isIncome ? '+' : '−'}
          {formatCurrency(transaction.amount)}
        </p>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-base font-medium">{transaction.title}</h2>
          <Badge variant={isIncome ? 'default' : 'secondary'}>
            {isIncome ? 'Ingreso' : 'Gasto'}
          </Badge>
        </div>
      </section>

      <section className="glass-panel flex flex-col rounded-2xl p-4 md:p-6">
        {details.map((detail, index) => (
          <div key={detail.label} className="flex flex-col">
            {index > 0 ? <Separator className="my-3" /> : null}
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">{detail.label}</p>
              <p className="text-sm font-medium">{detail.value}</p>
            </div>
          </div>
        ))}
      </section>

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="destructive" className="w-full" disabled={isPending} />
          }
        >
          <Undo2Icon data-icon="inline-start" />
          Deshacer
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deshacer este movimiento?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará de tu historial y el balance se actualizará. Esta acción no se
              puede revertir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                undoTransaction(transaction.id, {
                  onSuccess: () => {
                    toast.success('Movimiento deshecho')
                    navigate('/')
                  },
                })
              }}
            >
              Deshacer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TransactionDrawer
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        transaction={transaction}
      />
    </div>
  )
}
