'use client'

import { createAdminCategory } from '@/app/(admin)/_actions/create-category'
import { generateSlug } from '@/lib/slugify'
import { type AdminCategoryTree } from '@/types/admin-category-selects'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  createCategorySchema,
  type CreateCategorySchema,
} from './create-category.schema'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { useTransition } from 'react'

interface AdminCategoryCreateModalProps {
  isOpen: boolean
  onClose: () => void
  parentId: number | null
  level: number
  onSuccess: (newCategory: AdminCategoryTree) => void
}

export function AdminCategoryCreateModal({
  isOpen,
  onClose,
  parentId,
  level,
  onSuccess,
}: AdminCategoryCreateModalProps) {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    mode: 'onChange',
    defaultValues: { name: '', slug: '', isActive: true },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (values: CreateCategorySchema) => {
    startTransition(async () => {
      try {
        const newCategory = await createAdminCategory({ ...values, parentId })
        onSuccess(newCategory)
        handleClose()
      } catch (error) {
        console.error('Ошибка создания категории:', error)
      }
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>Создать категорию</DialogTitle>
          <DialogDescription>
            Добавление новой категории на уровень{' '}
            <span className='font-mono font-bold text-foreground'>
              L{level}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet disabled={isPending}>
            <FieldGroup>
              {/* НАЗВАНИЕ */}
              <Field>
                <Input
                  type='text'
                  autoComplete='off'
                  placeholder='Название категории (например, Электроника)'
                  {...register('name', {
                    onChange: (e) =>
                      setValue('slug', generateSlug(e.target.value), {
                        shouldValidate: true,
                      }),
                  })}
                  className='h-10'
                />
                <FieldError errors={[errors.name]} />
              </Field>

              {/* SLUG */}
              <Field>
                <Input
                  type='text'
                  autoComplete='off'
                  placeholder='Адресная строка (slug)'
                  {...register('slug')}
                  className='h-10'
                />
                <span className='px-1 text-[11px] text-muted-foreground'>
                  Генерируется автоматически на латинице
                </span>
                <FieldError errors={[errors.slug]} />
              </Field>

              {/* АКТИВНОСТЬ */}
              <div className='flex items-center justify-between rounded-lg border bg-secondary/10 p-3'>
                <div className='space-y-0.5'>
                  <span className='text-sm leading-none font-medium'>
                    Активность
                  </span>
                  <p className='text-[11px] text-muted-foreground'>
                    Показывать категорию на витрине сайта
                  </p>
                </div>
                <Switch
                  checked={watch('isActive')}
                  onCheckedChange={(checked) =>
                    setValue('isActive', checked, { shouldValidate: true })
                  }
                  disabled={isPending}
                />
              </div>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className='mt-6 gap-2 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isPending}
            >
              Отмена
            </Button>
            <Button
              type='submit'
              disabled={isPending}
              className='gap-2'
            >
              {isPending && <Spinner data-icon='inline-start' />}
              Создать
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
