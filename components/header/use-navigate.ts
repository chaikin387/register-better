'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

export const useNavigate = (setOpen: (open: boolean) => void) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const navigate = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()

    if (pathname === href) {
      setOpen(false)
      return
    }

    startTransition(() => {
      router.push(href)
    })
    setOpen(false)
  }

  return { navigate, isPending }
}
