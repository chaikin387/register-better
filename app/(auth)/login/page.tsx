import { LoginForm } from '@/components/auth/login/LoginForm'
import { Container } from '@/components/container/Container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход в аккаунт',
  description: 'Вход в аккаунт',
}

export default async function LoginPage() {
  return (
    <Container className='flex min-h-[calc(100vh-65px)] items-center justify-center'>
      <LoginForm />
    </Container>
  )
}
