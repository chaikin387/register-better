'use client'

import { ChevronRight } from 'lucide-react'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import type { AdminCategorySelectItem } from '@/types/admin-category-select-tree.selects'

interface Props {
  categories: AdminCategorySelectItem[]
  value?: string | null
  onChange: (id: string) => void
  disabled?: boolean
}

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

export function AdminCategorySelect({
  categories,
  value,
  onChange,
  disabled,
}: Props) {
  const path = value ? (findPath(categories, value) ?? []) : []

  const levels = [
    categories,
    ...path.flatMap((item) => (item.children?.length ? [item.children] : [])),
  ]

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
        </div>
      ))}
    </div>
  )
}
