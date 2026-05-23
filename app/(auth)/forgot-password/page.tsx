import { ForgotPasswordForm } from '@/components/auth/forgot-password/ForgotPasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Восстановление пароля',
  description: 'Восстановление пароля',
}

export default async function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
