'use client'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import type { AdminCategorySelectItem } from '@/types/admin-category-select-tree.selects'
import { ChevronRight } from 'lucide-react'
import React from 'react'

function findPath(
  items: AdminCategorySelectItem[],
  id: string
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
  value?: string | null
  onChange: (id: string) => void
  disabled?: boolean
}

export function AdminCategorySelect({
  categories,
  value,
  onChange,
  disabled,
}: Props) {
  const path = value != null ? (findPath(categories, value) ?? []) : []

  const levels: AdminCategorySelectItem[][] = [categories]
  for (const item of path) {
    if (item.children?.length) levels.push(item.children)
  }

  return (
    <div className='grid auto-cols-max grid-flow-col items-center gap-2'>
      {levels.map((options, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className='size-4 shrink-0 text-muted-foreground' />
          )}
          <Combobox
            items={options}
            value={path[index] ?? null}
            onValueChange={(category) => category && onChange(category.id)}
            itemToStringLabel={(category) => category?.name ?? ''}
            disabled={disabled}
          >
            <ComboboxInput
              placeholder={index === 0 ? 'Категория' : 'Подкатегория'}
            />
            <ComboboxContent>
              <ComboboxEmpty>Не найдено.</ComboboxEmpty>
              <ComboboxList>
                {(category) => (
                  <ComboboxItem
                    key={category.id}
                    value={category}
                    className='flex items-center justify-between gap-2'
                  >
                    <span className='truncate'>{category.name}</span>
                    {!!category.children?.length && (
                      <ChevronRight className='size-4 shrink-0 text-muted-foreground opacity-60' />
                    )}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </React.Fragment>
      ))}
    </div>
  )
}
