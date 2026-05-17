import { RegisterForm } from '@/components/auth/register/RegisterForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Регистрация аккаунта',
  description: 'Регистрация аккаунта',
}

export default async function RegisterPage() {
  return (
    <section className='container mx-auto flex min-h-[calc(100dvh-65px)] items-center justify-center px-4 py-8'>
      <RegisterForm />
    </section>
  )
}
