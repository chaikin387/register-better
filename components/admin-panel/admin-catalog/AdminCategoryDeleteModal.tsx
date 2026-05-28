'use client'

import { Trash2Icon } from 'lucide-react'
import { useState, useTransition } from 'react'

import { deleteAdminCategory } from '@/app/(admin)/_actions/delete-category'

import { type AdminCategoryTree } from '@/types/admin-category-selects'

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
import { Spinner } from '@/components/ui/spinner'

interface AdminCategoryDeleteModalProps {
  isOpen: boolean
  category: AdminCategoryTree
  onClose: () => void
  onSuccess: (id: number) => void
}

const MAX_ATTEMPTS = 3
const COOLDOWN_TIME = 60

export function AdminCategoryDeleteModal({
  isOpen,
  category,
  onClose,
  onSuccess,
}: AdminCategoryDeleteModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)

  const { countdown, start: startCooldown } = useCountdown(
    COOLDOWN_TIME,
    () => {
      setAttempts(0)
    }
  )

  const handleClose = () => {
    setError(null)
    onClose()
  }

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (isPending || countdown > 0) return

    startTransition(async () => {
      try {
        await deleteAdminCategory(category.id)
        onSuccess(category.id)
        setAttempts(0)
        handleClose()
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Произошла ошибка при удалении'
        setError(message)

        const nextAttempts = attempts + 1
        setAttempts(nextAttempts)

        if (nextAttempts >= MAX_ATTEMPTS) {
          startCooldown()
        }
      }
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
            <span className='font-extrabold'>“{category.name}”.</span> Это
            действие необратимо.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && countdown === 0 && (
          <p className='text-center text-sm font-medium text-destructive'>
            {error}
          </p>
        )}

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
            {isPending && <Spinner data-icon='inline-start' />}
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
