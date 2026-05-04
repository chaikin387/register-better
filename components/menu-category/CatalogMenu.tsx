'use client'

import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import * as Icons from 'lucide-react'
import { ChevronRight, LayoutGrid, type LucideIcon, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Container from '../container/Container'
import { type CategoryTree } from './category-selects'

function getIcon(name: string | null): LucideIcon | null {
  if (!name) return null
  return (Icons[name as keyof typeof Icons] as LucideIcon) ?? null
}

export function CatalogMenu({ categories }: { categories: CategoryTree[] }) {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState(categories[0]?.id ?? 0)
  const pathname = usePathname()

  const active = categories.find((c) => c.id === activeId) ?? categories[0]

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div>
      <Button
        variant='secondary'
        size='lg'
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X /> : <LayoutGrid />}
        Каталог
      </Button>

      {open && (
        <>
          <div
            className='fixed inset-0 z-10'
            onClick={() => setOpen(false)}
          />

          <div className='fixed inset-x-0 top-16 bottom-0 z-20 border-t bg-background'>
            <Container className='grid grid-cols-[210px_1fr]'>
              {/* Левая колонка */}
              <nav className='flex flex-col border-r py-6 pr-6'>
                {categories.map((cat) => {
                  const Icon = getIcon(cat.icon)
                  return (
                    <Button
                      asChild
                      key={cat.id}
                      variant={activeId === cat.id ? 'secondary' : 'ghost'}
                      className='h-10 justify-start text-base'
                      onMouseEnter={() => setActiveId(cat.id)}
                    >
                      <Link href={`/catalog/${cat.slug}`}>
                        {Icon && <Icon className='size-4 shrink-0' />}
                        {cat.name}
                      </Link>
                    </Button>
                  )
                })}
              </nav>

              {/* Правая часть */}
              <div className='grid grid-cols-4 content-start gap-4 overflow-y-auto p-6'>
                {active?.children.map((group) => (
                  <div
                    key={group.id}
                    className='flex min-w-0 flex-col'
                  >
                    <Button
                      asChild
                      variant='link'
                      size='xs'
                      className='h-10 justify-start text-lg font-semibold hover:no-underline'
                    >
                      <Link href={`/catalog/${group.slug}`}>{group.name}</Link>
                    </Button>

                    <div className='flex flex-col'>
                      {group.children.map((item) =>
                        item.children.length > 0 ? (
                          <HoverCard
                            key={item.id}
                            openDelay={150}
                            closeDelay={100}
                          >
                            <HoverCardTrigger asChild>
                              <Button
                                asChild
                                variant='link'
                                size='xs'
                                className='justify-start text-sm hover:no-underline'
                              >
                                <Link href={`/catalog/${item.slug}`}>
                                  <span>{item.name}</span>
                                  <ChevronRight />
                                </Link>
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent
                              side='bottom'
                              align='start'
                              sideOffset={4}
                              avoidCollisions
                              collisionPadding={16}
                              className='w-52 p-2'
                            >
                              <div className='flex flex-col'>
                                {item.children.map((child) => (
                                  <Button
                                    asChild
                                    key={child.id}
                                    variant='link'
                                    size='xs'
                                    className='justify-start text-sm hover:no-underline'
                                  >
                                    <Link href={`/catalog/${child.slug}`}>
                                      {child.name}
                                    </Link>
                                  </Button>
                                ))}
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ) : (
                          <Button
                            asChild
                            key={item.id}
                            variant='link'
                            size='xs'
                            className='justify-start text-sm hover:no-underline'
                          >
                            <Link href={`/catalog/${item.slug}`}>
                              {item.name}
                            </Link>
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </>
      )}
    </div>
  )
}
