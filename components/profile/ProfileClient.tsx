// components/profile/profile-client.tsx
'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Session } from '@/lib/auth'
import { Loader2, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { getInitialsAvatar } from '../header/initials-avatar'
import { useAvatar } from './use-avatar'

interface Props {
  session: Session | null
}

export const ProfileClient = ({ session }: Props) => {
  const { fileRef, loading, error, onUpload, onReset } = useAvatar()

  const user = session?.user
  if (!user) return null

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='relative'>
        <Avatar className='size-32'>
          {user.image ? (
            <Image
              src={user.image}
              alt=''
              width={128}
              height={128}
              preload
              className='rounded-full object-cover'
            />
          ) : (
            <AvatarFallback className='bg-primary text-2xl font-bold text-primary-foreground'>
              {getInitialsAvatar(user.name)}
            </AvatarFallback>
          )}
        </Avatar>

        <Button
          size='icon-lg'
          variant='outline'
          disabled={loading}
          onClick={() => fileRef.current?.click()}
          className='absolute right-0 bottom-0 rounded-full'
        >
          {loading ? <Loader2 className='animate-spin' /> : <Pencil />}
        </Button>

        <input
          ref={fileRef}
          type='file'
          hidden
          accept='image/jpeg,image/png,image/webp'
          onChange={(e) => onUpload(e.target.files?.[0])}
        />
      </div>

      {error && (
        <p className='text-center text-sm font-medium text-destructive'>
          {error}
        </p>
      )}

      <div className='text-center'>
        <p className='font-semibold'>{user.name}</p>
        <p className='text-sm text-muted-foreground'>{user.email}</p>
      </div>

      {user.image && (
        <Button
          size='sm'
          variant='destructive'
          disabled={loading}
          onClick={onReset}
        >
          <Trash2 />
          Удалить
        </Button>
      )}
    </div>
  )
}
