import { LoginForm } from '@/components/auth/login/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход в аккаунт',
  description: 'Вход в аккаунт',
}

export default async function LoginPage() {
  return (
    <section className='container mx-auto flex min-h-[calc(100dvh-65px)] items-center justify-center px-4 py-8'>
      <LoginForm />
    </section>
  )
}
