'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createAdminAttribute } from '@/app/(admin)/_actions/attribute/create-attribute'
import { updateAdminAttribute } from '@/app/(admin)/_actions/attribute/update-attribute'
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
import { generateSlug } from '@/lib/slugify-generator'
import type { AdminAttributeSelectItem } from '@/types/admin-attribute.selects'

import {
  createAttributeSchema,
  type CreateAttributeInput,
} from './create-attribute.schema'

interface Props {
  isOpen: boolean
  onClose: () => void

  attribute?: AdminAttributeSelectItem
}

export function AdminAttributeDialog({
  isOpen,
  onClose,

  attribute,
}: Props) {
  const isUpdateMode = !!attribute

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateAttributeInput>({
    resolver: zodResolver(createAttributeSchema),
    mode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      name: attribute?.name ?? '',
      slug: attribute?.slug ?? '',
    },
  })

  async function onSubmit(values: CreateAttributeInput) {
    const result = isUpdateMode
      ? await updateAdminAttribute({ id: attribute.id, ...values })
      : await createAdminAttribute(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(isUpdateMode ? 'Атрибут обновлён' : 'Атрибут создан')
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? 'Редактировать атрибут' : 'Создать атрибут'}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode ? (
              <>
                Изменение параметров атрибута{' '}
                <span className='font-mono font-bold text-foreground'>
                  {attribute.name}
                </span>
              </>
            ) : (
              'Добавление нового атрибута товаров'
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
                      placeholder='Название атрибута'
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
                <span className='px-1 text-[11px] text-muted-foreground'>
                  Генерируется автоматически на латинице
                </span>
                <FieldError errors={[errors.slug]} />
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className='mt-6 gap-2 sm:gap-0'>
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
              className='gap-2'
            >
              {isSubmitting && <Spinner data-icon='inline-start' />}
              {isUpdateMode ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
