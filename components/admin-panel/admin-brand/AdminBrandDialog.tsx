'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createAdminBrand } from '@/app/(admin)/_actions/admin-brand/create-brand'
import { updateAdminBrand } from '@/app/(admin)/_actions/admin-brand/update-brand'
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
  brand?: AdminBrandSelectItem
}

export function AdminBrandDialog({ isOpen, onClose, brand }: Props) {
  const isUpdateMode = !!brand

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateBrandInput>({
    resolver: zodResolver(createBrandSchema),
    mode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      name: brand?.name ?? '',
      slug: brand?.slug ?? '',
      isActive: brand?.isActive ?? true,
    },
  })

  async function onSubmit(values: CreateBrandInput) {
    const result = isUpdateMode
      ? await updateAdminBrand({ id: brand.id, ...values })
      : await createAdminBrand(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(isUpdateMode ? 'Бренд обновлён' : 'Бренд создан')
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='sm:max-w-164'>
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? 'Редактировать бренд' : 'Создать бренд'}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode ? (
              <>
                Изменение параметров бренда{' '}
                <span className='font-bold text-foreground'>{brand.name}</span>
              </>
            ) : (
              'Добавление нового бренда в каталог'
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet disabled={isSubmitting}>
            <FieldGroup>
              <Field>
                <Controller
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <Input
                      autoComplete='off'
                      placeholder='Название бренда'
                      className='h-10'
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e)
                        setValue('slug', generateSlug(e.target.value), {
                          shouldValidate: true,
                        })
                      }}
                    />
                  )}
                />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field>
                <Controller
                  control={control}
                  name='slug'
                  render={({ field }) => (
                    <Input
                      autoComplete='off'
                      placeholder='Адресная строка (slug)'
                      className='h-10'
                      {...field}
                    />
                  )}
                />
                <span className='text-[11px] text-muted-foreground'>
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
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              {isUpdateMode ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
