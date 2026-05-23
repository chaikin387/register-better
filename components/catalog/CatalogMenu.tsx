'use client'

import { CategoryTree } from '@/types/category-selects'
import * as Icons from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../ui/button'
import { L3Item } from './L3Item'

interface CatalogMenuProps {
  categories: CategoryTree[]
  navigate: (href: string) => (e: React.MouseEvent) => void
}

export const CatalogMenu = ({ categories, navigate }: CatalogMenuProps) => {
  const [activeL1, setActiveL1] = useState(categories[0]?.slug ?? '')
  const currentCategory = categories.find((c) => c.slug === activeL1)

  return (
    <nav
      className='flex gap-8 overflow-hidden'
      aria-label='Каталог товаров'
    >
      <ul className='flex-2/12 overflow-y-auto border-r p-2'>
        {categories.map((cat) => {
          const Icon = (Icons[cat.icon as keyof typeof Icons] ??
            Icons.Package) as Icons.LucideIcon

          return (
            <li
              key={cat.id}
              className='mb-1.5'
            >
              <Button
                asChild
                variant={activeL1 === cat.slug ? 'secondary' : 'ghost'}
                size='lg'
                className='flex w-full justify-start gap-3'
                onMouseEnter={() => setActiveL1(cat.slug)}
              >
                <Link
                  href={`/catalog/${cat.slug}`}
                  onClick={navigate(`/catalog/${cat.slug}`)}
                  className='text-muted-foreground'
                >
                  <Icon className='size-5 shrink-0' />
                  {cat.name}
                </Link>
              </Button>
            </li>
          )
        })}
      </ul>

      <ul className='grid flex-10/12 grid-cols-4 gap-x-8 gap-y-10 overflow-y-auto p-2'>
        {currentCategory?.children.map((l2) => (
          <li
            key={l2.id}
            className='flex flex-col gap-3 p-2'
          >
            <Link
              href={`/catalog/${l2.slug}`}
              onClick={navigate(`/catalog/${l2.slug}`)}
              className='text-base font-semibold text-foreground hover:no-underline'
            >
              {l2.name}
            </Link>

            <ul className='flex flex-col gap-1.5'>
              {l2.children.map((l3) => (
                <L3Item
                  key={l3.id}
                  l3={l3}
                  navigate={navigate}
                />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
