// verify/page.tsx
import { VerifyEmailForm } from '@/components/auth/verify-email/VerifyForm'
import { Container } from '@/components/container/Container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Подтверждение email',
  description: 'Подтверждение email',
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>
}) {
  const { email } = await searchParams

  return (
    <Container className='flex items-center justify-center'>
      <VerifyEmailForm emailFromUrl={email} />
    </Container>
  )
}
