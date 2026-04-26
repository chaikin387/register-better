import { ForgotPasswordForm } from '@/components/auth/forgot-password/ForgotPasswordForm'
import { Container } from '@/components/container/Container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Восстановление пароля',
  description: 'Восстановление пароля',
}

export default async function ForgotPasswordPage() {
  return (
    <Container className='flex items-center justify-center'>
      <ForgotPasswordForm />
    </Container>
  )
}
