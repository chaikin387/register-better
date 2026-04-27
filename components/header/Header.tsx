import { getServerSession } from '@/lib/auth-session'
import { Laugh } from 'lucide-react'
import Link from 'next/link'
import Container from '../container/Container'
import { ModeToggle } from './ModeTogle'
import { UserMenu } from './UserMenu'

export const Header = async () => {
  const session = await getServerSession()

  return (
    <header className='mb-12 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <Container className='flex h-16 items-center justify-between'>
        <Link
          href='/'
          replace
          className='flex items-center gap-2 text-xl font-bold'
        >
          <Laugh className='size-8 text-primary' />
          <span className='tracking-tight'>Register-Better</span>
        </Link>
        <ModeToggle />
        <UserMenu session={session} />
      </Container>
    </header>
  )
}
