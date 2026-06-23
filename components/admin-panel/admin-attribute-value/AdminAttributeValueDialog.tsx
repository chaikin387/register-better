'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createAdminAttributeValue } from '@/app/(admin)/_actions/admin-attribute-value/create-attribute-value'
import { updateAdminAttributeValue } from '@/app/(admin)/_actions/admin-attribute-value/update-attribute-value'
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
import type { AdminAttributeValueSelectItem } from '@/types/admin-attribute-value.selects'

import {
  createAttributeValueSchema,
  type CreateAttributeValueInput,
} from './create-attribute-value.schema'

interface Props {
  isOpen: boolean
  onClose: () => void

  attributeId: string
  value?: AdminAttributeValueSelectItem
}

export function AdminAttributeValueDialog({
  isOpen,
  onClose,

  attributeId,
  value,
}: Props) {
  const isUpdateMode = !!value

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateAttributeValueInput>({
    resolver: zodResolver(createAttributeValueSchema),
    mode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      value: value?.value ?? '',
      slug: value?.slug ?? '',
    },
  })

  async function onSubmit(data: CreateAttributeValueInput) {
    const result = isUpdateMode
      ? await updateAdminAttributeValue({ id: value.id, attributeId, ...data })
      : await createAdminAttributeValue({ attributeId, ...data })

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(isUpdateMode ? 'Значение обновлено' : 'Значение добавлено')

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
            {isUpdateMode ? 'Редактировать значение' : 'Добавить значение'}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode ? (
              <>
                Изменение значения{' '}
                <span className='font-bold text-foreground'>{value.value}</span>
              </>
            ) : (
              'Добавление нового значения атрибута'
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet disabled={isSubmitting}>
            <FieldGroup>
              <Field>
                <Controller
                  control={control}
                  name='value'
                  render={({ field }) => (
                    <Input
                      autoComplete='off'
                      placeholder='Значение атрибута'
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
                <FieldError errors={[errors.value]} />
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
                <span className='mb-4 text-[11px] text-muted-foreground'>
                  Генерируется автоматически на латинице
                </span>
                <FieldError errors={[errors.slug]} />
              </Field>
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
              {isUpdateMode ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
