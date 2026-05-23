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
        className='block text-sm text-secondary-foreground hover:no-underline'
      >
        <span
          ref={refs.setPositionReference}
          className='inline-flex items-center gap-2'
        >
          {l3.name}
          {hasChildren && (
            <ChevronRight className='size-3 shrink-0 text-muted-foreground' />
          )}
        </span>
      </Link>

      {open && hasChildren && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className='z-50 w-64 rounded-lg border bg-popover p-4 shadow-md'
        >
          <ul className='flex flex-col gap-1.5'>
            {l3.children.map((l4) => (
              <li key={l4.id}>
                <Link
                  href={`/catalog/${l4.slug}`}
                  onClick={navigate(`/catalog/${l4.slug}`)}
                  className='block text-sm text-secondary-foreground hover:no-underline'
                >
                  {l4.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}
