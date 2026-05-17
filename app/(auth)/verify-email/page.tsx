// verify/page.tsx
import { VerifyEmailForm } from '@/components/auth/verify-email/VerifyForm'
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
    <section className='container mx-auto flex min-h-[calc(100dvh-65px)] items-center justify-center px-4 py-8'>
      <VerifyEmailForm emailFromUrl={email} />
    </section>
  )
}
