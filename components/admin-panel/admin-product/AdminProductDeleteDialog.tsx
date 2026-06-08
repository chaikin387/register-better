'use client'

import { Trash2Icon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { deleteAdminProduct } from '@/app/(admin)/_actions/products/delete-product'
import { useCountdown } from '@/components/auth/hooks/use-countdown'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { AdminProductItemSelect } from '@/types/admin-product-selects'

interface Props {
  isOpen: boolean
  product: AdminProductItemSelect
  onClose: () => void
  onSuccess: (id: string) => void
}

const MAX_ATTEMPTS = 3
const COOLDOWN_TIME = 60

export function AdminProductDeleteDialog({
  isOpen,
  product,
  onClose,
  onSuccess,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [attempts, setAttempts] = useState(0)

  const { countdown, start: startCooldown } = useCountdown(
    COOLDOWN_TIME,
    () => {
      setAttempts(0)
    }
  )

  function handleClose() {
    onClose()
  }

  function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (isPending || countdown > 0) return

    startTransition(async () => {
      const result = await deleteAdminProduct(product.id)

      if (!result.success) {
        toast.error(result.error)
        const next = attempts + 1
        setAttempts(next)
        if (next >= MAX_ATTEMPTS) startCooldown()
        return
      }

      toast.success('Товар успешно удален')
      onSuccess(result.id)
      setAttempts(0)
      handleClose()
    })
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={handleClose}
    >
      <AlertDialogContent size='sm'>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы собираетесь полностью удалить товар{' '}
            <span className='font-extrabold'>"{product.name}".</span> Также
            будут удалены все связанные цены, остатки и модификации (SKU). Это
            действие необратимо.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {countdown > 0 && (
          <p className='text-center text-sm font-medium text-destructive'>
            Слишком много неудачных попыток. Повторите запрос через {countdown}{' '}
            сек.
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            variant='outline'
            disabled={isPending}
          >
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={handleConfirm}
            disabled={isPending || countdown > 0}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
