import Container from '@/components/container/Container'
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
    <Container>
      <ProfileClient session={session} />
    </Container>
  )
}
