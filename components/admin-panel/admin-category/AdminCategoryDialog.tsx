'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createAdminCategory } from '@/app/(admin)/_actions/categories/create-category'
import { updateAdminCategory } from '@/app/(admin)/_actions/categories/update-category'
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
import { generateSlug } from '@/lib/slugify-generator'
import type { AdminCategoryTreeSelect } from '@/types/admin-category-selects'

import {
  createCategorySchema,
  type CreateCategoryInput,
} from './create-category.schema'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: (category: AdminCategoryTreeSelect) => void
  category?: AdminCategoryTreeSelect
  parentId?: number | null
  level?: number
}

export function AdminCategoryDialog({
  isOpen,
  onClose,
  onSuccess,
  category,
  parentId,
  level,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const isUpdateMode = !!category

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    mode: 'onChange',
    defaultValues: {
      name: category?.name ?? '',
      slug: category?.slug ?? '',
      isActive: category?.isActive ?? true,
    },
  })

  function handleClose() {
    reset()
    onClose()
  }

  function onSubmit(values: CreateCategoryInput) {
    startTransition(async () => {
      const result = isUpdateMode
        ? await updateAdminCategory({ id: category.id, ...values })
        : await createAdminCategory({ ...values, parentId: parentId ?? null })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(isUpdateMode ? 'Категория обновлена' : 'Категория создана')
      onSuccess(result.data)
      handleClose()
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? 'Редактировать категорию' : 'Создать категорию'}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode ? (
              <>
                Изменение параметров категории{' '}
                <span className='font-mono font-bold text-foreground'>
                  {category.name}
                </span>
              </>
            ) : (
              <>
                Добавление новой категории на уровень{' '}
                <span className='font-mono font-bold text-foreground'>
                  L{level}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet disabled={isPending}>
            <FieldGroup>
              <Field>
                <Input
                  type='text'
                  autoComplete='off'
                  placeholder={
                    isUpdateMode
                      ? 'Название категории'
                      : 'Название категории (например, Электроника)'
                  }
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

              <Controller
                control={control}
                name='isActive'
                render={({ field }) => (
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </div>
                )}
              />
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
              {isUpdateMode ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
