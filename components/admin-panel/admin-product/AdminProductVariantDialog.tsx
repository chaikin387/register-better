'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { X } from 'lucide-react'

import type { AdminProductCategoryAttributeItem } from '@/types/admin-product-category-attribute.selects'
import type { AdminProductItemSelect } from '@/types/admin-product-selects'

import { createProductVariant } from '@/app/(admin)/_actions/admin-product-varinant/create-product-variant'

interface Props {
  isOpen: boolean
  onClose: () => void
  product: AdminProductItemSelect
  categoryAttributes: AdminProductCategoryAttributeItem[]
}

export function AdminProductVariantDialog({
  isOpen,
  onClose,
  product,
  categoryAttributes,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [price, setPrice] = useState('')
  const [weight, setWeight] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  async function onSubmit() {
    if (selectedIds.length === 0) {
      toast.error('Выберите хотя бы один атрибут')
      return
    }
    if (!price || !weight) {
      toast.error('Введите цену и вес')
      return
    }

    setIsSubmitting(true)

    const result = await createProductVariant(
      product.id,
      selectedIds,
      Number(price),
      Number(weight)
    )

    setIsSubmitting(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success('Вариант добавлен')
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='sm:max-w-164'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <span>{product.name}</span>
          </DialogTitle>
          <DialogDescription>
            Добавление нового варианта товара
          </DialogDescription>
        </DialogHeader>

        {categoryAttributes.length === 0 ? (
          <p className='py-4 text-center text-sm text-muted-foreground'>
            У категории нет атрибутов
          </p>
        ) : (
          <div className='space-y-6'>
            <div className='space-y-4'>
              {categoryAttributes.map((ca) => (
                <div
                  key={ca.id}
                  className='space-y-1.5'
                >
                  <span className='text-xs font-medium text-muted-foreground'>
                    {ca.attribute.name}
                  </span>
                  <div className='flex flex-wrap gap-2'>
                    {ca.attribute.values.map((v) => {
                      const selected = selectedIds.includes(v.id)
                      return (
                        <Badge
                          key={v.id}
                          variant={selected ? 'default' : 'outline'}
                          className='cursor-pointer gap-1 select-none'
                          onClick={() => handleToggle(v.id)}
                        >
                          {v.value}
                          {selected && <X className='size-3' />}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className='space-y-4 border-t pt-2'>
              <Field>
                <Label>Цена (₽) *</Label>
                <Input
                  inputMode='numeric'
                  placeholder='Введите цену'
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
                  disabled={isSubmitting}
                />
              </Field>

              <Field>
                <Label>Вес (грамм) *</Label>
                <Input
                  inputMode='numeric'
                  placeholder='Введите вес'
                  value={weight}
                  onChange={(e) => setWeight(e.target.value.replace(/\D/g, ''))}
                  disabled={isSubmitting}
                />
              </Field>
            </div>
          </div>
        )}

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
            type='button'
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
