'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export const ModeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant='secondary'
      size='icon-lg'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className='rounded-full'
    >
      <Sun className='dark:hidden' />
      <Moon className='hidden dark:block' />
    </Button>
  )
}
