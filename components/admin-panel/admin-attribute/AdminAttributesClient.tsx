'use client'

import { List, Pencil, Plus, SlidersHorizontal, Trash2 } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
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

  return (
    <>
      <div className='space-y-6 px-4 py-8'>
        <div className='flex items-center justify-between border-b pb-4'>
          <div className='space-y-1'>
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

        <div className='max-w-3xl rounded-xl border bg-card p-6'>
          {attributes.length === 0 ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>
              Атрибутов пока нет. Добавьте первый.
            </p>
          ) : (
            <div className='space-y-2'>
              {attributes.map((attribute) => (
                <div
                  key={attribute.id}
                  className='flex items-center justify-between gap-3 rounded-lg border bg-background p-2 transition-colors hover:bg-accent/40'
                >
                  <div className='flex min-w-0 flex-col gap-0.5 pl-7'>
                    <div className='flex items-center gap-2'>
                      <span className='truncate text-sm font-medium'>
                        {attribute.name}
                      </span>
                      <Badge
                        variant='secondary'
                        className='shrink-0'
                      >
                        {attribute._count.values}
                      </Badge>
                    </div>
                    <span className='truncate font-mono text-[10px] text-muted-foreground'>
                      /{attribute.slug}
                    </span>
                    {attribute.values.length > 0 && (
                      <span className='truncate text-[11px] text-muted-foreground'>
                        {attribute.values.map((v) => v.value).join(' · ')}
                        {attribute._count.values > 5 && ' · ...'}
                      </span>
                    )}
                  </div>

                  <div className='flex shrink-0 items-center gap-0.5'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon-lg'
                          asChild
                          className='text-muted-foreground hover:text-foreground'
                        >
                          <Link
                            href={`/admin-panel/attributes/${attribute.id}`}
                          >
                            <List className='size-4' />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Значения</TooltipContent>
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
              ))}
            </div>
          )}
        </div>
      </div>

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
