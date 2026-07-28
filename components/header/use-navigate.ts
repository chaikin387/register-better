'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

export type Navigate = (
  href: string
) => (e: React.MouseEvent<HTMLAnchorElement>) => void

export function useNavigate(setOpen: (open: boolean) => void) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  function navigate(href: string) {
    return function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
      if (
        e.defaultPrevented ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      )
        return

      e.preventDefault()

      if (pathname === href) {
        setOpen(false)
        return
      }

      startTransition(() => {
        router.push(href)
        setOpen(false)
      })
    }
  }

  return { navigate, isPending }
}
