import { ForgotPasswordForm } from '@/components/auth/forgot-password/ForgotPasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Восстановление пароля',
  description: 'Восстановление пароля',
}

export default async function ForgotPasswordPage() {
  return (
    <section className='container mx-auto flex min-h-[calc(100dvh-65px)] items-center justify-center px-4 py-8'>
      <ForgotPasswordForm />
    </section>
  )
}
