'use client'

import {
  ArrowDown,
  ArrowUp,
  List,
  Pencil,
  Plus,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { swapAttributeOrder } from '@/app/(admin)/_actions/admin-attribute/swap-attribute-order'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { AdminAttributeSelectItem } from '@/types/admin-attribute.selects'

import { AdminAttributeDeleteDialog } from './AdminAttributeDeleteDialog'
import { AdminAttributeDialog } from './AdminAttributeDialog'
import { useAdminAttributes } from './use-admin-attributes'

interface Props {
  initialAttributes: AdminAttributeSelectItem[]
}

export function AdminAttributesClient({
  initialAttributes: attributes,
}: Props) {
  const {
    createOpen,
    updateAttribute,
    deleteAttribute,
    setCreateOpen,
    setUpdateAttribute,
    setDeleteAttribute,
  } = useAdminAttributes()

  async function handleSwap(
    current: AdminAttributeSelectItem,
    sibling: AdminAttributeSelectItem
  ) {
    const result = await swapAttributeOrder(
      current.id,
      current.sortOrder,
      sibling.id,
      sibling.sortOrder
    )
    if (!result.success) {
      toast.error(result.error)
    }
  }

  return (
    <>
      <section className='space-y-6 px-4 py-8'>
        <div className='flex items-end justify-between border-b pb-4'>
          <div className='flex flex-col gap-1'>
            <h1 className='flex items-center gap-2 text-2xl font-bold'>
              <SlidersHorizontal className='size-6 text-muted-foreground' />
              Атрибуты
            </h1>
            <p className='text-sm text-muted-foreground'>
              Управление атрибутами товаров
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus />
            Добавить атрибут
          </Button>
        </div>

        <div className='max-w-4xl rounded-xl border bg-card p-6'>
          {attributes.length === 0 ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>
              Атрибутов пока нет. Добавьте первый.
            </p>
          ) : (
            <div className='space-y-2'>
              {attributes.map((attribute, i) => {
                const prev = attributes[i - 1]
                const next = attributes[i + 1]

                return (
                  <div
                    key={attribute.id}
                    className='flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 hover:bg-accent/40'
                  >
                    <div className='flex min-w-0 flex-col gap-1'>
                      <div className='flex items-center gap-3'>
                        <span className='truncate text-sm font-medium tracking-tight'>
                          {attribute.name}
                        </span>

                        <span className='truncate text-[10px] text-muted-foreground'>
                          /{attribute.slug}
                        </span>
                      </div>

                      {attribute.values.length > 0 && (
                        <p className='truncate text-[11px] text-muted-foreground'>
                          {attribute.values.map((v) => v.value).join(' · ')}
                        </p>
                      )}
                    </div>

                    <div className='flex shrink-0 items-center gap-0.5'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-lg'
                            disabled={!prev}
                            onClick={() => prev && handleSwap(attribute, prev)}
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
                            onClick={() => next && handleSwap(attribute, next)}
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
                            asChild
                            className='relative text-muted-foreground hover:text-foreground'
                          >
                            <Link
                              href={`/admin-panel/attributes/${attribute.id}`}
                            >
                              <List className='size-4' />
                              {attribute._count.values > 0 && (
                                <span className='absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] leading-none text-primary-foreground'>
                                  {attribute._count.values}
                                </span>
                              )}
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Значения ({attribute._count.values})
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-lg'
                            onClick={() => setUpdateAttribute(attribute)}
                            className='text-muted-foreground hover:text-foreground'
                          >
                            <Pencil className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Редактировать</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-lg'
                            onClick={() => setDeleteAttribute(attribute)}
                            className='text-muted-foreground hover:text-destructive'
                          >
                            <Trash2 className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Удалить атрибут</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {createOpen && (
        <AdminAttributeDialog
          isOpen
          onClose={() => setCreateOpen(false)}
        />
      )}

      {updateAttribute && (
        <AdminAttributeDialog
          isOpen
          attribute={updateAttribute}
          onClose={() => setUpdateAttribute(null)}
        />
      )}

      {deleteAttribute && (
        <AdminAttributeDeleteDialog
          isOpen
          attribute={deleteAttribute}
          onClose={() => setDeleteAttribute(null)}
        />
      )}
    </>
  )
}
