// components/header/Header.tsx — Server Component
import { getServerSession } from '@/lib/auth-session'

import { getCategoryTree } from '@/app/(shop)/_actions/category'
import { HeaderClient } from './HeaderClient'

const Header = async () => {
  const [session, categories] = await Promise.all([
    getServerSession(),
    getCategoryTree(),
  ])

  return (
    <HeaderClient
      session={session}
      categories={categories}
    />
  )
}

export default Header
