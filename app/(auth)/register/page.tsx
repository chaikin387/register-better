import { RegisterForm } from '@/components/auth/register/RegisterForm'
import { Container } from '@/components/container/Container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Регистрация аккаунта',
  description: 'Регистрация аккаунта',
}

export default async function RegisterPage() {
  return (
    <Container className='flex min-h-[calc(100vh-65px)] items-center justify-center'>
      <RegisterForm />
    </Container>
  )
}
