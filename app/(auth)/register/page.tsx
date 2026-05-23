import { RegisterForm } from '@/components/auth/register/RegisterForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Регистрация аккаунта',
  description: 'Регистрация аккаунта',
}

export default async function RegisterPage() {
  return <RegisterForm />
}
