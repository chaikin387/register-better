// components/header/Header.tsx — Server Component
import { getServerSession } from '@/lib/auth-session'
import { getCategoriesMenu } from '@/services/category.service'
import { HeaderClient } from './HeaderClient'

const Header = async () => {
  const [session, categories] = await Promise.all([
    getServerSession(),
    getCategoriesMenu(),
  ])

  return (
    <HeaderClient
      session={session}
      categories={categories}
    />
  )
}

export default Header
