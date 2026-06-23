'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { addProductAttributeValue } from '@/app/(admin)/_actions/admin-product/add-product-attribute-value'
import { removeProductAttributeValue } from '@/app/(admin)/_actions/admin-product/remove-product-attribute-value'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { AdminProductCategoryAttributeItem } from '@/types/admin-product-category-attribute.selects'
import type { AdminProductItemSelect } from '@/types/admin-product-selects'

interface Props {
  isOpen: boolean
  onClose: () => void
  product: AdminProductItemSelect
  categoryAttributes: AdminProductCategoryAttributeItem[]
}

export function AdminProductCategoryAttributeDialog({
  isOpen,
  onClose,
  product,
  categoryAttributes,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(product.attributes.map((a) => a.attributeValueId))
  )

  async function handleAdd(attributeValueId: string) {
    const result = await addProductAttributeValue(product.id, attributeValueId)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    setSelectedIds((prev) => new Set([...prev, attributeValueId]))
  }

  async function handleRemove(attributeValueId: string) {
    const result = await removeProductAttributeValue(
      product.id,
      attributeValueId
    )
    if (!result.success) {
      toast.error(result.error)
      return
    }
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(attributeValueId)
      return next
    })
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
          <DialogDescription>Выберите характеристики товара</DialogDescription>
        </DialogHeader>

        {categoryAttributes.length === 0 ? (
          <p className='py-4 text-center text-sm text-muted-foreground'>
            У категории нет атрибутов
          </p>
        ) : (
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
                    const selected = selectedIds.has(v.id)
                    return (
                      <Badge
                        key={v.id}
                        variant={selected ? 'default' : 'outline'}
                        className='cursor-pointer gap-1 select-none'
                        onClick={() =>
                          selected ? handleRemove(v.id) : handleAdd(v.id)
                        }
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
        )}
      </DialogContent>
    </Dialog>
  )
}
