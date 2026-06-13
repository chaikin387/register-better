'use client'

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Pencil,
  Plus,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { AdminAttributeValueSelectItem } from '@/types/admin-attribute-value.selects'
import type { AdminAttributeSelectItem } from '@/types/admin-attribute.selects'

import { swapAttributeValueOrder } from '@/app/(admin)/_actions/admin-atribute-value/swap-attribute-value-order'
import { AdminAttributeValueDeleteDialog } from './AdminAttributeValueDeleteDialog'
import { AdminAttributeValueDialog } from './AdminAttributeValueDialog'
import { useAdminAttributeValues } from './use-admin-attribute-values'

interface Props {
  attribute: AdminAttributeSelectItem
  initialValues: AdminAttributeValueSelectItem[]
}

export function AdminAttributeValuesClient({
  attribute,
  initialValues: values,
}: Props) {
  const {
    createOpen,
    updateValue,
    deleteValue,
    setCreateOpen,
    setUpdateValue,
    setDeleteValue,
  } = useAdminAttributeValues()

  async function handleSwap(
    current: AdminAttributeValueSelectItem,
    sibling: AdminAttributeValueSelectItem
  ) {
    const result = await swapAttributeValueOrder(
      current.id,
      current.sortOrder,
      sibling.id,
      sibling.sortOrder,
      attribute.id
    )
    if (!result.success) {
      toast.error(result.error)
    }
  }

  return (
    <>
      <div className='space-y-6 px-4 py-8'>
        {/* Хедер остается без изменений */}
        <div className='flex items-center justify-between border-b pb-4'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <Button
                asChild
                variant='ghost'
                size='icon-lg'
                className='text-muted-foreground'
              >
                <Link href='/admin-panel/attributes'>
                  <ArrowLeft className='size-4' />
                </Link>
              </Button>
              <h1 className='flex items-center gap-2 text-2xl font-bold'>
                <SlidersHorizontal className='size-6 text-muted-foreground' />
                {attribute.name}
              </h1>
            </div>
            <p className='text-sm text-muted-foreground'>
              Значения атрибута /{attribute.slug}
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus /> Добавить значение
          </Button>
        </div>

        {/* Список элементов */}
        <div className='max-w-3xl rounded-xl border bg-card p-6'>
          {values.length === 0 ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>
              Значений пока нет. Добавьте первое.
            </p>
          ) : (
            <div className='space-y-2'>
              {values.map((value, i) => {
                const prev = values[i - 1]
                const next = values[i + 1]

                return (
                  <div
                    key={value.id}
                    className='flex items-center justify-between gap-3 rounded-lg border bg-background p-2 transition-colors hover:bg-accent/40'
                  >
                    <div className='flex min-w-0 flex-col pl-7'>
                      <span className='truncate text-sm font-medium tracking-tight'>
                        {value.value}
                      </span>
                      <span className='truncate font-mono text-[10px] text-muted-foreground'>
                        /{value.slug}
                      </span>
                    </div>

                    <div className='flex shrink-0 items-center gap-0.5'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon-lg'
                            disabled={!prev}
                            onClick={() => handleSwap(value, prev)}
                            className='text-muted-foreground hover:text-foreground'
                          >
                            <ArrowUp className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Переместить вверх</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon-lg'
                            disabled={!next}
                            onClick={() => handleSwap(value, next)}
                            className='text-muted-foreground hover:text-foreground'
                          >
                            <ArrowDown className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Переместить вниз</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon-lg'
                            onClick={() => setUpdateValue(value)}
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
                            variant='ghost'
                            size='icon-lg'
                            onClick={() => setDeleteValue(value)}
                            className='text-muted-foreground hover:text-destructive'
                          >
                            <Trash2 className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Удалить значение</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {createOpen && (
        <AdminAttributeValueDialog
          isOpen
          attributeId={attribute.id}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {updateValue && (
        <AdminAttributeValueDialog
          isOpen
          attributeId={attribute.id}
          value={updateValue}
          onClose={() => setUpdateValue(null)}
        />
      )}
      {deleteValue && (
        <AdminAttributeValueDeleteDialog
          isOpen
          value={deleteValue}
          onClose={() => setDeleteValue(null)}
        />
      )}
    </>
  )
}
