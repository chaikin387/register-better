'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { updateAdminCategory } from '@/app/(admin)/_actions/update-category'
import { generateSlug } from '@/lib/slugify'
import { type AdminCategoryTree } from '@/types/admin-category-selects'
import {
  updateCategorySchema,
  type UpdateCategorySchema,
} from './update-category.schema'

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

interface AdminCategoryEditModalProps {
  isOpen: boolean
  category: AdminCategoryTree
  onClose: () => void
  onSuccess: (updatedCategory: AdminCategoryTree) => void
}

export function AdminCategoryEditModal({
  isOpen,
  category,
  onClose,
  onSuccess,
}: AdminCategoryEditModalProps) {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateCategorySchema>({
    resolver: zodResolver(updateCategorySchema),
    mode: 'onChange',
    defaultValues: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      isActive: category.isActive,
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (values: UpdateCategorySchema) => {
    startTransition(async () => {
      try {
        const updatedCategory = await updateAdminCategory(values)
        onSuccess(updatedCategory)
        handleClose()
      } catch (error) {
        console.error('Ошибка обновления категории:', error)
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
          <DialogTitle>Редактировать категорию</DialogTitle>
          <DialogDescription>
            Изменение параметров категории{' '}
            <span className='font-mono font-bold text-foreground'>
              {category.name}
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
                  placeholder='Название категории'
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
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
