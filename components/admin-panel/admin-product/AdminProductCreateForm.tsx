'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AdminCategorySelectItem } from '@/types/admin-category-select-item.selects'

import { CategorySelect } from './CategorySelect'
import {
  createProductSchema,
  type CreateProductInput,
} from './create-product.schema'

interface Props {
  categories: AdminCategorySelectItem[]
}

export function AdminProductCreateForm({ categories }: Props) {
  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { name: '' },
  })

  function onSubmit(data: CreateProductInput) {
    console.log(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 px-4 py-8'
    >
      <div className='space-y-2'>
        <Label htmlFor='name'>Название товара *</Label>
        <Input
          id='name'
          {...register('name')}
          placeholder='Введите название товара'
          autoComplete='off'
        />
        {errors.name && (
          <p className='text-xs text-destructive'>{errors.name.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label>Категория *</Label>
        <Controller
          control={control}
          name='categoryId'
          render={({ field }) => (
            <CategorySelect
              categories={categories}
              value={field.value}
              onChange={field.onChange}
              onClear={() => resetField('categoryId')}
            />
          )}
        />
        {errors.categoryId && (
          <p className='text-xs text-destructive'>
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <Button type='submit'>Создать товар</Button>
    </form>
  )
}
