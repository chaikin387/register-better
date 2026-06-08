'use client'

import { ChevronDown, X } from 'lucide-react'
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
import type { AdminBrandSelectItem } from '@/types/admin-brand.selects'

interface Props {
  brands: AdminBrandSelectItem[]
  value?: string | null
  onChange: (id: string) => void
  onClear: () => void
  disabled?: boolean
}

export function AdminBrandSelect({
  brands,
  value,
  onChange,
  onClear,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false)

  const selected = brands.find((b) => b.id === value)

  return (
    <div className='flex items-center gap-2'>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='outline'
            role='combobox'
            disabled={disabled}
            className='w-64 justify-between gap-2 font-normal'
          >
            <span
              className={cn('truncate', !selected && 'text-muted-foreground')}
            >
              {selected?.name ?? 'Выберите бренд...'}
            </span>
            <ChevronDown className='size-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start'>
          <Command>
            <CommandInput placeholder='Поиск бренда...' />
            <CommandList>
              <CommandEmpty>Бренды не найдены.</CommandEmpty>
              <CommandGroup>
                {brands.map((brand) => (
                  <CommandItem
                    key={brand.id}
                    value={brand.name}
                    onSelect={() => {
                      onChange(brand.id)
                      setOpen(false)
                    }}
                  >
                    {brand.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          disabled={disabled}
          onClick={onClear}
        >
          <X className='size-4' />
        </Button>
      )}
    </div>
  )
}
