'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { AdminCategorySelectItem } from '@/types/admin-category-select-tree.selects'

function findPath(
  items: AdminCategorySelectItem[],
  id: number
): AdminCategorySelectItem[] | null {
  for (const item of items) {
    if (item.id === id) return [item]
    if (item.children?.length) {
      const sub = findPath(item.children, id)
      if (sub) return [item, ...sub]
    }
  }
  return null
}

interface Props {
  categories: AdminCategorySelectItem[]
  value?: number | null
  onChange: (id: number) => void
  disabled?: boolean
}

export function AdminCategorySelect({
  categories,
  value,
  onChange,
  disabled,
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const path = value != null ? (findPath(categories, value) ?? []) : []

  const levels: AdminCategorySelectItem[][] = [categories]
  for (const item of path) {
    if (item.children?.length) levels.push(item.children)
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {levels.map((options, index) => (
        <div
          key={index}
          className='flex items-center gap-2'
        >
          {index > 0 && (
            <ChevronRight className='size-4 shrink-0 text-muted-foreground' />
          )}
          <Popover
            open={openIndex === index}
            onOpenChange={(open) => setOpenIndex(open ? index : null)}
          >
            <PopoverTrigger asChild>
              <Button
                type='button'
                variant='outline'
                disabled={disabled}
                className='justify-between gap-2 font-normal'
              >
                <span
                  className={cn(
                    'truncate',
                    !path[index] && 'text-muted-foreground'
                  )}
                >
                  {path[index]?.name ??
                    (index === 0 ? 'Категории' : 'Подкатегории')}
                </span>
                <ChevronDown className='size-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent align='start'>
              <Command>
                <CommandInput placeholder='Поиск...' />
                <CommandList>
                  <CommandEmpty>Не найдено.</CommandEmpty>
                  <CommandGroup>
                    {options.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => {
                          onChange(category.id)
                          setOpenIndex(null)
                        }}
                      >
                        <span className='flex-1'>{category.name}</span>
                        {!!category.children?.length && (
                          <ChevronRight className='size-4 shrink-0 text-muted-foreground opacity-60' />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  )
}
