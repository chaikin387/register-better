'use client'

import { Trash2Icon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { deleteAdminCategory } from '@/app/(admin)/_actions/categories/delete-category'
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
import type { AdminCategoryTreeSelect } from '@/types/admin-category-selects'

interface Props {
  isOpen: boolean
  category: AdminCategoryTreeSelect
  onClose: () => void
  onSuccess: (id: string) => void
}

const MAX_ATTEMPTS = 3
const COOLDOWN_TIME = 60

export function AdminCategoryDeleteDialog({
  isOpen,
  category,
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
      const result = await deleteAdminCategory(category.id)

      if (!result.success) {
        toast.error(result.error)
        const next = attempts + 1
        setAttempts(next)
        if (next >= MAX_ATTEMPTS) startCooldown()
        return
      }

      toast.success('Категория удалена')
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
          <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы собираетесь полностью удалить категорию{' '}
            <span className='font-extrabold'>"{category.name}".</span> Это
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
