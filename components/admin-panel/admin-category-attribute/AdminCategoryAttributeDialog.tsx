'use client'

import { ArrowDown, ArrowUp, SlidersHorizontal, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { AdminAttributeSelectItem } from '@/types/admin-attribute.selects'
import type { AdminCategoryAttributeSelectItem } from '@/types/admin-category-attribute'
import type { AdminCategoryTreeSelect } from '@/types/admin-category-selects'

import { createAdminCategoryAttribute } from '@/app/(admin)/_actions/admin-category-atribute/create-category-attribute'
import { deleteAdminCategoryAttribute } from '@/app/(admin)/_actions/admin-category-atribute/delete-category-attribute'
import { swapCategoryAttributeOrder } from '@/app/(admin)/_actions/admin-category-atribute/swap-category-attribute-order'
import { AdminCategoryAttributeSelect } from './AdminCategoryAttributeSelect'

interface Props {
  isOpen: boolean
  onClose: () => void
  category: AdminCategoryTreeSelect
  initialCategoryAttributes: AdminCategoryAttributeSelectItem[]
  allAttributes: AdminAttributeSelectItem[]
}

export function AdminCategoryAttributeDialog({
  isOpen,
  onClose,
  category,
  initialCategoryAttributes,
  allAttributes,
}: Props) {
  const [categoryAttributes, setCategoryAttributes] = useState(
    initialCategoryAttributes
  )

  async function handleAdd(attributeId: string) {
    const result = await createAdminCategoryAttribute(category.id, attributeId)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    setCategoryAttributes((prev) => [...prev, result.data])
  }

  async function handleRemove(id: string) {
    const result = await deleteAdminCategoryAttribute(id)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    setCategoryAttributes((prev) => prev.filter((ca) => ca.id !== id))
  }

  async function handleSwap(
    current: AdminCategoryAttributeSelectItem,
    sibling: AdminCategoryAttributeSelectItem
  ) {
    const result = await swapCategoryAttributeOrder(
      current.id,
      current.sortOrder,
      sibling.id,
      sibling.sortOrder,
      category.id
    )

    if (!result.success) {
      toast.error(result.error)
      return
    }

    setCategoryAttributes(result.data)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <SlidersHorizontal className='size-4 text-muted-foreground' />
            Атрибуты категории
          </DialogTitle>
          <DialogDescription>
            Категория <span className='text-foreground'>{category.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col'>
          <AdminCategoryAttributeSelect
            allAttributes={allAttributes}
            categoryAttributes={categoryAttributes}
            onChange={handleAdd}
          />

          {categoryAttributes.length === 0 ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>
              Атрибуты не привязаны
            </p>
          ) : (
            <div className='mt-10 space-y-1.5'>
              {categoryAttributes.map((ca, i) => {
                const prev = categoryAttributes[i - 1]
                const next = categoryAttributes[i + 1]

                return (
                  <div
                    key={ca.id}
                    className='flex items-center justify-between rounded-lg border bg-background p-2'
                  >
                    <div className='flex min-w-0 flex-col'>
                      <span className='truncate text-sm font-medium'>
                        {ca.attribute.name}
                      </span>
                      <span className='truncate font-mono text-[10px] text-muted-foreground'>
                        /{ca.attribute.slug}
                      </span>
                    </div>

                    <div className='flex shrink-0 items-center gap-0.5'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-lg'
                            disabled={!prev}
                            onClick={() => prev && handleSwap(ca, prev)}
                            className='text-muted-foreground hover:text-foreground disabled:opacity-30'
                          >
                            <ArrowUp className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Переместить вверх</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-lg'
                            disabled={!next}
                            onClick={() => next && handleSwap(ca, next)}
                            className='text-muted-foreground hover:text-foreground disabled:opacity-30'
                          >
                            <ArrowDown className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Переместить вниз</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-lg'
                            onClick={() => handleRemove(ca.id)}
                            className='text-muted-foreground hover:text-destructive'
                          >
                            <Trash2 className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Убрать атрибут</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
