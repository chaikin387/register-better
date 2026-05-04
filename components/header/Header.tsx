// components/layout/Header.tsx
import { getServerSession } from '@/lib/auth-session'
import { Laugh } from 'lucide-react'
import Link from 'next/link'
import Container from '../container/Container'

import { CatalogMenu } from '../menu-category/CatalogMenu'
import { getCatalogMenu } from '../menu-category/category.service'
import { ModeToggle } from './ModeToggle'
import { UserMenu } from './UserMenu'

export const Header = async () => {
  const session = await getServerSession()

  const categories = await getCatalogMenu()

  return (
    <header className='w-full border-b'>
      <Container className='flex h-16 items-center justify-between'>
        <div className='flex items-center gap-6'>
          <Link
            href='/'
            replace
            className='flex items-center gap-2 transition-opacity hover:opacity-80'
          >
            <Laugh className='size-8' />
          </Link>

          <CatalogMenu categories={categories} />
        </div>

        <div className='z-50 flex items-center gap-2'>
          <ModeToggle />
          <UserMenu session={session} />
        </div>
      </Container>
    </header>
  )
}
