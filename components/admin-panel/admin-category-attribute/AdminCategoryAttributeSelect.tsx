'use client'

import { Plus } from 'lucide-react'
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
import type { AdminAttributeSelectItem } from '@/types/admin-attribute.selects'
import type { AdminCategoryAttributeSelectItem } from '@/types/admin-category-attribute'

interface Props {
  allAttributes: AdminAttributeSelectItem[]
  categoryAttributes: AdminCategoryAttributeSelectItem[]
  onChange: (attributeId: string) => void
}

export function AdminCategoryAttributeSelect({
  allAttributes,
  categoryAttributes,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)

  const attachedIds = new Set(categoryAttributes.map((ca) => ca.attribute.id))
  const available = allAttributes.filter((a) => !attachedIds.has(a.id))

  return (
    <div className='flex justify-end'>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button>
            <Plus />
            Добавить атрибут
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align='end'
          className='w-60 p-0'
        >
          <Command>
            <CommandInput placeholder='Поиск атрибута...' />
            <CommandList>
              <CommandEmpty>Атрибуты не найдены.</CommandEmpty>
              <CommandGroup>
                {available.map((attr) => (
                  <CommandItem
                    key={attr.id}
                    value={attr.name}
                    onSelect={() => {
                      onChange(attr.id)
                      setOpen(false)
                    }}
                  >
                    {attr.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
