'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { useCountdown } from '../hooks/use-countdown'
import { LoginSchema } from './login.schema'

const LOGIN_ERRORS: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'Неверный email или пароль.',
  TOO_MANY_REQUESTS: 'Слишком много попыток. Пожалуйста, попробуйте позже.',
  CHANGE_CREDENTIALS: 'Сначала измените email или пароль.',
}

type Status = 'idle' | 'submitting' | 'blocked'

export function useLogin(form: UseFormReturn<LoginSchema>) {
  const router = useRouter()
  const { setError, clearErrors } = form

  const [status, setStatus] = useState<Status>('idle')
  const [invalidCredentials, setInvalidCredentials] = useState(false)

  const { countdown, start } = useCountdown(60, () => {
    clearErrors()
    setStatus('idle')
  })

  const isSubmitting = status === 'submitting'
  const isBlocked = status === 'blocked'

  const onSubmit = async ({ email, password }: LoginSchema) => {
    if (invalidCredentials) {
      setError('email', { message: LOGIN_ERRORS.CHANGE_CREDENTIALS })
      return
    }

    setStatus('submitting')

    const { error } = await authClient.signIn.email({ email, password })

    if (error) {
      if (error.code === 'EMAIL_NOT_VERIFIED') {
        router.replace(`/verify-email?email=${encodeURIComponent(email)}`)
        return
      }

      if (error.status === 429) {
        setError('root', { message: LOGIN_ERRORS.TOO_MANY_REQUESTS })
        start()
        setStatus('blocked')
        return
      }

      if (error.code === 'INVALID_EMAIL_OR_PASSWORD') {
        setInvalidCredentials(true)
        setError('email', { message: LOGIN_ERRORS.INVALID_EMAIL_OR_PASSWORD })
        setStatus('idle')
        return
      }

      setError('root', {
        message: error.message ?? 'Что-то пошло не так. Попробуйте позже.',
      })
      setStatus('idle')
      return
    }

    router.replace('/')
    router.refresh()
  }

  const onChange = () => {
    if (invalidCredentials) {
      setInvalidCredentials(false)
      clearErrors()
    }
  }

  const disabled = {
    submit: isSubmitting || isBlocked,
  }

  return { onSubmit, onChange, isSubmitting, countdown, disabled }
}
