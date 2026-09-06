import { PencilIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

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
import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import type { ICategory } from '@/features/categories/interfaces/get-all.interface.ts'
import { useDeleteCategory } from '@/features/categories/services/queries.ts'
import { getCategoryIcon } from '@/shared/lib/category-icons.ts'
import { isSeedCategory } from '@/shared/lib/mock-store.ts'
import { cn } from '@/lib/utils.ts'

interface CategoryListProps {
  categories: ICategory[]
  isLoading?: boolean
  editingId?: string
  onEdit: (category: ICategory) => void
  onDeleted?: (categoryId: string) => void
}

export function CategoryList({
  categories,
  isLoading = false,
  editingId,
  onEdit,
  onDeleted,
}: CategoryListProps) {
  const { mutate: removeCategory, isPending } = useDeleteCategory()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aún no hay categorías. Crea la primera para empezar de cero.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.icon)
        const canDelete = !isSeedCategory(category.id)

        return (
          <li
            key={category.id}
            className={cn(
              'flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2',
              editingId === category.id && 'ring-1 ring-foreground/20',
            )}
          >
            <span className="flex size-8 items-center justify-center text-foreground">
              <Icon />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {category.name}
            </span>
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Editar ${category.name}`}
                onClick={() => onEdit(category)}
              >
                <PencilIcon />
              </Button>
              {canDelete ? (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Eliminar ${category.name}`}
                        disabled={isPending}
                      />
                    }
                  >
                    <Trash2Icon />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar {category.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Solo se pueden borrar las categorías que creaste. Si tiene
                        movimientos, no se eliminará.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        disabled={isPending}
                        onClick={() => {
                          removeCategory(category.id, {
                            onSuccess: () => {
                              toast.success('Categoría eliminada')
                              onDeleted?.(category.id)
                            },
                          })
                        }}
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
