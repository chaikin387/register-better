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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { generateSlug } from '@/lib/slugify-generator'
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
    mode: 'onChange',
    defaultValues: {
      name: product?.name ?? '',
      slug: product?.slug ?? '',
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
      className='space-y-5 px-4 py-6'
    >
      <div className='flex items-center justify-between border-b pb-3'>
        <div>
          <h1 className='text-xl font-bold tracking-tight'>
            {isUpdateMode ? 'Редактирование товара' : 'Добавление товара'}
          </h1>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            {isUpdateMode
              ? 'Изменение информации о товаре'
              : 'Заполните основные поля'}
          </p>
        </div>

        {/* Компактный переключатель активности в шапке */}
        <Controller
          control={control}
          name='isActive'
          render={({ field }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent align='end'>
                Показывать товар на витрине сайта
              </TooltipContent>
            </Tooltip>
          )}
        />
      </div>

      {/* Название, Бренд и Slug в одну строку */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {/* 1. Название */}
        <div className='space-y-1.5'>
          <Label htmlFor='name'>Название товара *</Label>
          <Input
            id='name'
            placeholder='Введите название товара'
            autoFocus
            autoComplete='off'
            disabled={isPending}
            {...register('name', {
              onChange: (e) =>
                setValue('slug', generateSlug(e.target.value), {
                  shouldValidate: true,
                }),
            })}
          />
          {errors.name && (
            <p className='text-xs text-destructive'>{errors.name.message}</p>
          )}
        </div>

        {/* 2. Бренд с лаконичной подсказкой снизу */}
        <div className='space-y-1.5'>
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
          <span className='block px-1 text-[10px] leading-none text-muted-foreground'>
            Если бренда нет — оставьте пустым
          </span>
        </div>

        {/* 3. Автоматический Slug */}
        <div className='space-y-1.5'>
          <Label htmlFor='slug'>Адресная строка (slug) *</Label>
          <Input
            id='slug'
            type='text'
            autoComplete='off'
            placeholder='Адресная строка (slug)'
            disabled={isPending}
            {...register('slug')}
          />
          {errors.slug ? (
            <p className='text-xs text-destructive'>{errors.slug.message}</p>
          ) : (
            <span className='block px-1 text-[10px] leading-none text-muted-foreground'>
              Автогенерация на латинице
            </span>
          )}
        </div>
      </div>

      {/* Категория */}
      <div className='space-y-1.5'>
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

      <div className='flex gap-3 border-t pt-4'>
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
        >
          {isPending && <Spinner data-icon='inline-start' />}
          {isUpdateMode ? 'Сохранить изменения' : 'Создать товар'}
        </Button>
      </div>
    </form>
  )
}
