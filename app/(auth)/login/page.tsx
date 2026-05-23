import { LoginForm } from '@/components/auth/login/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход в аккаунт',
  description: 'Вход в аккаунт',
}

export default async function LoginPage() {
  return <LoginForm />
}
