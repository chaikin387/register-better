'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/auth-client'

import { Session } from '@/lib/auth'
import { LogOut, User, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getInitialsAvatar } from './initials-avatar'

interface Props {
  session: Session | null
}

export function UserMenu({ session }: Props) {
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
      <Link href='/login'>
        <UserIcon className='size-8 text-primary hover:text-primary/70' />
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
        >
          <Avatar size='lg'>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt=''
                width={40}
                height={40}
                preload
                className='rounded-full object-cover'
              />
            ) : (
              <AvatarFallback className='bg-primary font-bold text-primary-foreground'>
                {getInitialsAvatar(session.user.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-56'
        align='end'
        sideOffset={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
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
            <User size={16} />
            <span>Мой аккаунт</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={handleSignOut}
          variant='destructive'
        >
          <LogOut size={16} />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
