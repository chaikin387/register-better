'use client'

import {
  type CategoryBase,
  type CategoryCatalog,
} from '@/types/category-selects'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  category: CategoryBase & { children?: CategoryCatalog['children'] }
}

export const CategoryCard = ({ category }: Props) => {
  const [hovered, setHovered] = useState(false)
  const hasChildren = (category.children?.length ?? 0) > 0

  return (
    <div
      className='flex flex-col gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
        <Link
          href={`/catalog/${category.slug}`}
          className={`block h-full w-full transition-all duration-500 ease-in-out ${
            hovered && hasChildren
              ? 'scale-110 opacity-0 blur-sm'
              : 'opacity-100'
          }`}
        >
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className='object-cover'
            />
          ) : (
            <div className='flex h-full items-center justify-center text-4xl grayscale'>
              🔒
            </div>
          )}
        </Link>

        {hasChildren && (
          <div
            className={`absolute inset-0 flex flex-col bg-background/90 p-4 transition-all duration-300 ${
              hovered
                ? 'translate-y-0 opacity-100'
                : 'pointer-events-none translate-y-4 opacity-0'
            }`}
          >
            <Link
              href={`/catalog/${category.slug}`}
              className='mb-3 text-sm font-bold hover:text-primary'
            >
              {category.name}
            </Link>

            <div className='flex flex-col gap-2'>
              {category.children!.map((child) => (
                <Link
                  key={child.id}
                  href={`/catalog/${child.slug}`}
                  className='flex items-center justify-between text-xs text-muted-foreground transition-colors hover:text-foreground'
                >
                  <span className='mr-2 truncate'>{child.name}</span>
                  {child.children.length > 0 && (
                    <ChevronRight className='size-3 shrink-0 opacity-50' />
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={`transition-opacity duration-300 ${hovered && hasChildren ? 'opacity-0' : 'opacity-100'}`}
      >
        <Link
          href={`/catalog/${category.slug}`}
          className='text-sm leading-tight font-semibold'
        >
          {category.name}
        </Link>
      </div>
    </div>
  )
}
