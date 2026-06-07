'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createAdminProduct } from '@/app/(admin)/_actions/products/create-product'
import { updateAdminProduct } from '@/app/(admin)/_actions/products/update-product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import type { AdminBrandSelectItem } from '@/types/admin-brand.selects'
import type { AdminCategorySelectItem } from '@/types/admin-category-select-tree.selects'
import type { AdminProductItemSelect } from '@/types/admin-product-selects'

import { AdminBrandSelect } from './AdminBrandSelect'
import { AdminCategorySelect } from './AdminCategorySelect'
import {
  createProductSchema,
  type CreateProductInput,
} from './create-product.schema'

interface Props {
  product?: AdminProductItemSelect
  categories: AdminCategorySelectItem[]
  brands: AdminBrandSelectItem[]
}

export function AdminProductForm({ product, categories, brands }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isUpdateMode = !!product

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: product?.name ?? '',
      categoryId: product?.category.id,
      brandId: product?.brand?.id ?? null,
      isActive: product?.isActive ?? true,
    },
  })

  function onSubmit(data: CreateProductInput) {
    startTransition(async () => {
      const result = isUpdateMode
        ? await updateAdminProduct({ id: product.id, ...data })
        : await createAdminProduct(data)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(isUpdateMode ? 'Товар обновлен' : 'Товар создан')
      router.push('/admin-panel/products')
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 px-4 py-8'
    >
      <div className='border-b pb-4'>
        <h1 className='text-2xl font-bold tracking-tight'>
          {isUpdateMode ? 'Редактирование товара' : 'Добавление товара'}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          {isUpdateMode
            ? 'Измените необходимую информацию о товаре'
            : 'Заполните основную информацию о товаре'}
        </p>
      </div>

      {/* Название товара и Бренд в одну строку */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Название товара *</Label>
          <Input
            id='name'
            {...register('name')}
            placeholder='Введите название товара'
            autoFocus
            autoComplete='off'
            disabled={isPending}
          />
          {errors.name && (
            <p className='text-xs text-destructive'>{errors.name.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label>Бренд</Label>
          <Controller
            control={control}
            name='brandId'
            render={({ field }) => (
              <AdminBrandSelect
                brands={brands}
                value={field.value}
                onChange={field.onChange}
                onClear={() => setValue('brandId', null)}
                disabled={isPending}
              />
            )}
          />
          <p className='px-1 text-[11px] text-muted-foreground'>
            Если бренд отсутствует — оставьте поле пустым
          </p>
        </div>
      </div>

      {/* Категория */}
      <div className='space-y-2'>
        <Label>Категория *</Label>
        <Controller
          control={control}
          name='categoryId'
          render={({ field }) => (
            <AdminCategorySelect
              categories={categories}
              value={field.value}
              onChange={field.onChange}
              disabled={isPending}
            />
          )}
        />
        {errors.categoryId && (
          <p className='text-xs text-destructive'>
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Активность */}
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
                Показывать товар на витрине сайта
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

      <div className='flex gap-3'>
        <Button
          type='button'
          variant='outline'
          disabled={isPending}
          onClick={() => router.back()}
        >
          Отмена
        </Button>
        <Button
          type='submit'
          disabled={isPending}
          className='gap-2'
        >
          {isPending && <Spinner data-icon='inline-start' />}
          {isUpdateMode ? 'Сохранить изменения' : 'Создать товар'}
        </Button>
      </div>
    </form>
  )
}
