// UserMenu.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Session } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'
import { LogOut, User, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getInitialsAvatar } from './initials-avatar'

interface Props {
  session: Session | null
  navigate: (href: string) => (e: React.MouseEvent) => void
}

export const UserMenu = ({ session, navigate }: Props) => {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace('/')
          router.refresh()
        },
      },
    })
  }

  if (!session) {
    return (
      <Button
        asChild
        variant='secondary'
        size='icon-lg'
        className='rounded-full'
      >
        <Link
          href='/login'
          onClick={navigate('/login')}
        >
          <UserIcon />
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='secondary'
          size='icon-lg'
          className='overflow-hidden rounded-full'
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt=''
              width={36}
              height={36}
              preload
              className='aspect-square bg-secondary object-cover'
            />
          ) : (
            <span className='text-sm font-semibold'>
              {getInitialsAvatar(session.user.name)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={8}
        className='w-56'
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement
          if (target.closest('[data-keep-profile]')) e.preventDefault()
        }}
      >
        <div className='flex flex-col space-y-1 p-2'>
          <p className='text-sm leading-none font-medium'>
            {session.user.name}
          </p>
          <p className='text-xs leading-none text-muted-foreground'>
            {session.user.email}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href='/profile'
            replace
          >
            <User />
            <span>Мой аккаунт</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={handleSignOut}
          variant='destructive'
        >
          <LogOut />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
