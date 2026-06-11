'use client'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'

import type { AdminBrandSelectItem } from '@/types/admin-brand.selects'

interface Props {
  brands: AdminBrandSelectItem[]
  value?: string | null
  onChange: (id: string | null) => void
  disabled?: boolean
}

export function AdminBrandSelect({ brands, value, onChange, disabled }: Props) {
  return (
    <Combobox
      items={brands}
      value={brands.find((brand) => brand.id === value) ?? null}
      onValueChange={(brand) => onChange(brand?.id ?? null)}
      itemToStringLabel={(brand) => brand?.name ?? ''}
      disabled={disabled}
    >
      <ComboboxInput
        placeholder='Выберите бренд'
        showClear
      />

      <ComboboxContent>
        <ComboboxEmpty>Бренды не найдены.</ComboboxEmpty>

        <ComboboxList>
          {(brand) => (
            <ComboboxItem
              key={brand.id}
              value={brand}
            >
              <span className='truncate'>{brand.name}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
