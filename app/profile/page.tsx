import { ProfileClient } from '@/components/profile/ProfileClient'
import { getServerSession } from '@/lib/auth-session'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ваш профиль',
  description: 'Ваш профиль',
}

export default async function ProfilePage() {
  const session = await getServerSession()

  return (
    <section className='container mx-auto px-4 py-8'>
      <ProfileClient session={session} />
    </section>
  )
}
