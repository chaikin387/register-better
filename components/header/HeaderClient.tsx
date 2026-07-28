'use client'

import { Button } from '@/components/ui/button'
import { Session } from '@/lib/auth'
import { CategoryTreeSelect } from '@/types/category-selects'
import { Menu, ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { CatalogMenu } from '../catalog/CatalogMenu'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover'
import { Spinner } from '../ui/spinner'
import { ModeToggle } from './ModeToggle'
import { useNavigate } from './use-navigate'
import { UserMenu } from './UserMenu'

interface Props {
  session: Session | null
  categories: CategoryTreeSelect[]
}

export const HeaderClient = ({ session, categories }: Props) => {
  const [open, setOpen] = useState(false)
  const { navigate, isPending } = useNavigate(setOpen)

  function handleInteractOutside(event: Event) {
    const target = event.target as Element
    if (target.closest('[data-header-popover-ignore]')) event.preventDefault()
  }

  return (
    <header className='sticky -top-9 z-50'>
      <div className='h-9 border-b border-border/60 bg-muted text-xs text-muted-foreground'>
        <div className='container mx-auto flex h-full items-center justify-between px-4'>
          <nav className='flex gap-5 font-medium'>
            <Link
              href='/buyers'
              className='hover:text-primary'
            >
              Покупателям
            </Link>
            <Link
              href='/sellers'
              className='hover:text-primary'
            >
              Продавцам
            </Link>
            <Link
              href='/partners'
              className='hover:text-primary'
            >
              Партнерам
            </Link>
          </nav>
          <span className='hidden sm:block'>
            Служба поддержки: 8 (800) 555-35-35
          </span>
        </div>
      </div>

      <Popover
        open={open}
        onOpenChange={setOpen}
        modal={true}
      >
        <div className='h-16 border-b bg-background'>
          <PopoverAnchor asChild>
            <div className='pointer-events-auto container mx-auto flex h-full items-center justify-between px-4'>
              <div className='flex items-center gap-4'>
                <Link
                  href='/'
                  onClick={navigate('/')}
                  data-header-popover-ignore
                  className='flex items-baseline gap-2'
                >
                  <ShoppingBag />
                </Link>

                <PopoverTrigger asChild>
                  <Button
                    variant='default'
                    size='lg'
                    className='active:translate-y-px data-[state=open]:translate-y-px'
                  >
                    {isPending ? <Spinner /> : open ? <X /> : <Menu />}
                    Каталог
                  </Button>
                </PopoverTrigger>
              </div>

              {/* Правая часть */}
              <div className='flex items-center gap-2'>
                <ModeToggle />
                <UserMenu
                  session={session}
                  navigate={navigate}
                />
              </div>
            </div>
          </PopoverAnchor>
        </div>

        <PopoverContent
          sideOffset={0}
          onInteractOutside={handleInteractOutside}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className='h-(--radix-popover-content-available-height) w-(--radix-popover-content-available-width) overflow-y-auto rounded-none border-none bg-background outline-none'
        >
          <div className='container mx-auto px-4 py-8'>
            <CatalogMenu
              categories={categories}
              navigate={navigate}
            />
          </div>
        </PopoverContent>
      </Popover>
    </header>
  )
}
