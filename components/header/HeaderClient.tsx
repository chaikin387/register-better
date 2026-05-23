'use client'

import { Button } from '@/components/ui/button'
import { Session } from '@/lib/auth'
import { CategoryTree } from '@/types/category-selects'
import { Menu, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { CatalogMenu } from '../catalog/CatalogMenu'
import { useEscapeKey } from '../catalog/use-escape-key'
import { ModeToggle } from './ModeToggle'
import { UserMenu } from './UserMenu'
import { useNavigate } from './use-navigate'

interface Props {
  session: Session | null
  categories: CategoryTree[]
}

export const HeaderClient = ({ session, categories }: Props) => {
  const [open, setOpen] = useState(false)
  const { navigate, isPending } = useNavigate(() => setOpen(false))

  useEscapeKey(open, () => setOpen(false))

  const handleClose = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('[data-keep-catalog]')) return
    setOpen(false)
  }

  return (
    <>
      <div
        className='bg-background'
        onClick={handleClose}
      >
        <div className='container mx-auto flex h-8 items-center px-4 text-sm text-muted-foreground'>
          Санкт-Петербург
        </div>
      </div>

      <header
        className='sticky top-0 z-50 border-b bg-background'
        onClick={handleClose}
      >
        <div className='container mx-auto flex h-16 items-center justify-between gap-6 px-4'>
          <div className='flex items-center gap-2'>
            <Link
              href='/'
              onClick={navigate('/')}
              className='flex items-baseline gap-2'
            >
              <ShoppingBag />
            </Link>

            <Button
              data-keep-catalog
              onClick={() => setOpen((v) => !v)}
            >
              <Menu />
              Каталог
            </Button>
          </div>

          <div className='flex items-center gap-2'>
            <ModeToggle />
            <UserMenu
              session={session}
              navigate={navigate}
            />
          </div>
        </div>

        {open && (
          <div
            data-catalog-open
            data-keep-catalog
            className='absolute inset-x-0 top-full z-50 h-[calc(100dvh-100%)] overflow-y-auto border-t bg-popover'
          >
            <div className='container mx-auto px-4 py-8'>
              <CatalogMenu
                categories={categories}
                navigate={navigate}
              />
            </div>
          </div>
        )}

        {isPending && (
          <div className='absolute inset-x-0 top-full z-1001 h-[calc(100dvh-100%)] bg-popover' />
        )}
      </header>
    </>
  )
}
