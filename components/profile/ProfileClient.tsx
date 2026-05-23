'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Session } from '@/lib/auth'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { getInitialsAvatar } from '../header/initials-avatar'
import { Spinner } from '../ui/spinner'
import { useAvatar } from './avatar/use-avatar'
import { useName } from './name/use-name'

interface Props {
  session: Session | null
}

export function ProfileClient({ session }: Props) {
  const user = session?.user
  const {
    fileRef,
    loading: avatarLoading,
    error: avatarError,
    onUpload,
    onReset,
  } = useAvatar()
  const {
    value,
    setValue,
    editing,
    setEditing,
    loading: nameLoading,
    error: nameError,
    onSave,
    onCancel,
  } = useName(user?.name ?? '')

  if (!user) return null

  return (
    <section className='container mx-auto flex flex-col items-center gap-4 px-4 py-8'>
      <div className='group/avatar relative'>
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
          disabled={avatarLoading}
          onClick={() => fileRef.current?.click()}
          className='absolute -right-1 -bottom-1 rounded-full'
        >
          {avatarLoading ? <Spinner data-icon='inline-start' /> : <Pencil />}
        </Button>

        {user.image && (
          <Button
            size='icon-lg'
            variant='outline'
            disabled={avatarLoading}
            onClick={onReset}
            className='absolute -bottom-1 -left-1 rounded-full text-destructive opacity-0 transition-opacity group-hover/avatar:opacity-100 hover:text-destructive'
          >
            <Trash2 />
          </Button>
        )}

        <input
          ref={fileRef}
          type='file'
          className='hidden'
          accept='image/jpeg,image/png,image/webp'
          onChange={(e) => onUpload(e.target.files?.[0])}
        />
      </div>

      {(avatarError || nameError) && (
        <p className='text-center text-sm font-medium text-destructive'>
          {avatarError ?? nameError}
        </p>
      )}

      <div className='mt-4 flex flex-col items-center gap-2'>
        {editing ? (
          <div className='flex items-center gap-2'>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              disabled={nameLoading}
            />
            <div className='flex gap-1'>
              <Button
                size='icon-lg'
                variant='secondary'
                disabled={nameLoading}
                onClick={onSave}
              >
                {nameLoading ? <Spinner data-icon='inline-start' /> : <Check />}
              </Button>
              <Button
                size='icon-lg'
                variant='ghost'
                disabled={nameLoading}
                onClick={onCancel}
              >
                <X />
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <h2 className='text-xl font-semibold tracking-tight'>
              {user.name}
            </h2>
            <Button
              size='icon-lg'
              variant='ghost'
              onClick={() => setEditing(true)}
            >
              <Pencil />
            </Button>
          </div>
        )}
        <p className='text-sm text-muted-foreground'>{user.email}</p>
      </div>
    </section>
  )
}
