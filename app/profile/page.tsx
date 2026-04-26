import Container from '@/components/container/Container'
import { ProfileClient } from '@/components/profile/ProfileClient'
import { getServerSession } from '@/lib/auth-session'

import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Ваш профиль',
  description: 'Ваш профиль',
}

export default async function ProfilePage() {
  const session = await getServerSession()
  if (!session) redirect('/')

  return (
    <Container>
      <ProfileClient session={session} />
    </Container>
  )
}
