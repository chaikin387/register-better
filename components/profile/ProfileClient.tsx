// components/profile/profile-client.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Session } from '@/lib/auth'
import { Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { getInitialsAvatar } from '../header/initials-avatar'
import { Spinner } from '../ui/spinner'
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
        {user.image ? (
          <Image
            src={user.image}
            alt=''
            width={128}
            height={128}
            className='aspect-square rounded-full bg-secondary object-cover'
          />
        ) : (
          <span className='flex size-32 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground'>
            {getInitialsAvatar(user.name)}
          </span>
        )}

        <Button
          size='icon-lg'
          variant='outline'
          disabled={loading}
          onClick={() => fileRef.current?.click()}
          className='absolute -right-1 -bottom-1 rounded-full'
        >
          {loading ? <Spinner data-icon='inline-start' /> : <Pencil />}
        </Button>

        <input
          ref={fileRef}
          type='file'
          className='hidden'
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
          variant='destructive'
          size='sm'
          disabled={loading}
          onClick={onReset}
        >
          <Trash2 data-icon='inline-start' />
          Удалить аватар
        </Button>
      )}
    </div>
  )
}
