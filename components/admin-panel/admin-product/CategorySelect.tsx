'use client'

import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { AdminCategorySelectItem } from '@/types/admin-category-select-item.selects'

function getPath(
  items: AdminCategorySelectItem[],
  id: number
): AdminCategorySelectItem[] | null {
  for (const item of items) {
    if (item.id === id) return [item]
    if (item.children?.length) {
      const sub = getPath(item.children, id)
      if (sub) return [item, ...sub]
    }
  }
  return null
}

interface Props {
  categories: AdminCategorySelectItem[]
  value?: number
  onChange: (id: number) => void
  onClear: () => void
  disabled?: boolean
}

export function CategorySelect({
  categories,
  value,
  onChange,
  onClear,
  disabled,
}: Props) {
  const [open, setOpen] = useState<number | null>(null)

  const path = value ? (getPath(categories, value) ?? []) : []

  const levels: AdminCategorySelectItem[][] = [categories]
  for (const item of path) {
    if (item.children?.length) levels.push(item.children)
  }

  const isLeaf = path.length > 0 && !path.at(-1)?.children?.length

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-wrap items-center gap-2'>
        {levels.map((list, i) => (
          <div
            key={i}
            className='flex items-center gap-2'
          >
            {i > 0 && <ChevronRight className='size-4 text-muted-foreground' />}
            <Popover
              open={open === i}
              onOpenChange={(v) => setOpen(v ? i : null)}
            >
              <PopoverTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  disabled={disabled}
                  className='min-w-40 justify-between'
                >
                  <span className='truncate'>
                    {path[i]?.name ??
                      (i === 0 ? 'Выберите категорию' : 'Уточнить...')}
                  </span>
                  <ChevronDown className='ml-2 size-4 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align='start'
                className='flex max-h-80 w-72 flex-col overflow-y-auto p-1'
              >
                {list.map((cat) => (
                  <Button
                    key={cat.id}
                    type='button'
                    variant={path[i]?.id === cat.id ? 'secondary' : 'ghost'}
                    className='justify-between'
                    onClick={() => {
                      onChange(cat.id)
                      setOpen(null)
                    }}
                  >
                    {cat.name}
                    {cat.children?.length ? (
                      <ChevronRight className='size-3.5 text-muted-foreground' />
                    ) : null}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        ))}

        {isLeaf && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            disabled={disabled}
            onClick={onClear}
          >
            <X className='mr-1 size-3' />
            Сбросить
          </Button>
        )}
      </div>
    </div>
  )
}
