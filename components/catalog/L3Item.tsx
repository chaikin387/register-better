'use client'

import { CategoryTree } from '@/types/category-selects'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useCatalogFloat } from './use-catalog-float'

interface Props {
  l3: CategoryTree['children'][number]['children'][number]
  navigate: (href: string) => (e: React.MouseEvent) => void
}

export const L3Item = ({ l3, navigate }: Props) => {
  const hasChildren = !!l3.children?.length
  const { open, refs, floatingStyles, getReferenceProps, getFloatingProps } =
    useCatalogFloat(hasChildren)

  return (
    <li>
      <Link
        ref={refs.setReference}
        href={`/catalog/${l3.slug}`}
        onClick={navigate(`/catalog/${l3.slug}`)}
        {...getReferenceProps()}
        className='flex w-full items-center gap-2 text-sm text-secondary-foreground hover:no-underline'
      >
        {l3.name}
        {hasChildren && (
          <ChevronRight
            ref={refs.setPositionReference}
            className='size-3 shrink-0 text-muted-foreground'
          />
        )}
      </Link>

      {open && hasChildren && (
        <ul
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className='flex flex-col gap-1.5 rounded-lg border bg-popover p-4 shadow-lg'
        >
          {l3.children.map((l4) => (
            <li key={l4.id}>
              <Link
                href={`/catalog/${l4.slug}`}
                onClick={navigate(`/catalog/${l4.slug}`)}
                className='flex w-full text-sm text-secondary-foreground hover:no-underline'
              >
                {l4.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
