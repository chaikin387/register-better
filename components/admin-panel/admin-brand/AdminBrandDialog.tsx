// AdminBrandDialog.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createAdminBrand } from '@/app/(admin)/_actions/brand/create-brand'
import { updateAdminBrand } from '@/app/(admin)/_actions/brand/update-brand'
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
import type { AdminBrandSelectItem } from '@/types/admin-brand.selects'

import { createBrandSchema, type CreateBrandInput } from './create-brand.schema'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: (brand: AdminBrandSelectItem) => void
  brand?: AdminBrandSelectItem
}

export function AdminBrandDialog({ isOpen, onClose, onSuccess, brand }: Props) {
  const [isPending, startTransition] = useTransition()
  const isUpdateMode = !!brand

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateBrandInput>({
    resolver: zodResolver(createBrandSchema),
    mode: 'onChange',
    defaultValues: {
      name: brand?.name ?? '',
      slug: brand?.slug ?? '',
      isActive: brand?.isActive ?? true,
    },
  })

  function handleClose() {
    reset()
    onClose()
  }

  function onSubmit(values: CreateBrandInput) {
    startTransition(async () => {
      const result = isUpdateMode
        ? await updateAdminBrand({ id: brand.id, ...values })
        : await createAdminBrand(values)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(isUpdateMode ? 'Бренд обновлён' : 'Бренд создан')
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
            {isUpdateMode ? 'Редактировать бренд' : 'Создать бренд'}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode ? (
              <>
                Изменение параметров бренда{' '}
                <span className='font-mono font-bold text-foreground'>
                  {brand.name}
                </span>
              </>
            ) : (
              'Добавление нового бренда в каталог'
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
                      ? 'Название бренда'
                      : 'Название бренда (например, Apple)'
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
                        Показывать бренд на витрине сайта
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
