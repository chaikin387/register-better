'use client'

import { Trash2Icon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { deleteAdminAttribute } from '@/app/(admin)/_actions/attribute/delete-attribute'
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
import type { AdminAttributeSelectItem } from '@/types/admin-attribute.selects'

interface Props {
  isOpen: boolean
  attribute: AdminAttributeSelectItem
  onClose: () => void
}

const MAX_ATTEMPTS = 3
const COOLDOWN_TIME = 60

export function AdminAttributeDeleteDialog({
  isOpen,
  attribute,
  onClose,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [attempts, setAttempts] = useState(0)

  const { countdown, start: startCooldown } = useCountdown(
    COOLDOWN_TIME,
    () => {
      setAttempts(0)
    }
  )

  function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (isPending || countdown > 0) return

    startTransition(async () => {
      const result = await deleteAdminAttribute(attribute.id)

      if (!result.success) {
        toast.error(result.error)
        const next = attempts + 1
        setAttempts(next)
        if (next >= MAX_ATTEMPTS) startCooldown()
        return
      }

      toast.success('Атрибут удалён')
      setAttempts(0)
      onClose()
    })
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <AlertDialogContent size='sm'>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Удалить атрибут?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы собираетесь полностью удалить атрибут{' '}
            <span className='font-extrabold'>"{attribute.name}".</span> Это
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
