'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { useCountdown } from '../hooks/use-countdown'
import { ForgotPasswordSchema } from './forgot-password.schema'

const OTP_ERRORS: Record<string, string> = {
  INVALID_OTP: 'Неверный код',
  OTP_EXPIRED: 'Код истёк. Запросите новый',
  TOO_MANY_ATTEMPTS: 'Слишком много попыток. Получите новый код.',
  TOO_MANY_REQUESTS: 'Слишком много запросов. Получите новый код.',
}

type Status = 'idle' | 'sending' | 'otp-ready' | 'submitting' | 'blocked'

export function useForgotPassword(form: UseFormReturn<ForgotPasswordSchema>) {
  const router = useRouter()
  const { setError, trigger, getValues, clearErrors } = form

  const [status, setStatus] = useState<Status>('idle')

  const { countdown, start } = useCountdown(60)

  const isSending = status === 'sending'
  const isOtpReady = status === 'otp-ready'
  const isSubmitting = status === 'submitting'
  const isBlocked = status === 'blocked'
  const codeSent = status !== 'idle'

  const onSendCode = async () => {
    const isValid = await trigger(['email', 'password', 'confirmPassword'])
    if (!isValid) return

    setStatus('sending')
    clearErrors()
    form.setValue('otp', '')

    const { error } = await authClient.emailOtp.requestPasswordReset({
      email: getValues('email'),
    })

    if (error) {
      setError('root', {
        message: error.message ?? 'Не удалось отправить код. Попробуйте позже',
      })
      setStatus('idle')
      return
    }

    setStatus('otp-ready')
    start()
  }

  const onSubmit = async ({ email, otp, password }: ForgotPasswordSchema) => {
    if (!isOtpReady) {
      setError('otp', { message: 'Введите код из email' })
      return
    }

    setStatus('submitting')

    const { error } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
    })

    if (error) {
      form.setValue('otp', '')

      if (error.status === 429) {
        setError('otp', { message: OTP_ERRORS.TOO_MANY_REQUESTS })
        start()
        setStatus('blocked')
        return
      }

      if (error.code === 'TOO_MANY_ATTEMPTS') {
        setError('otp', { message: OTP_ERRORS.TOO_MANY_ATTEMPTS })
        start()
        setStatus('blocked')
        return
      }

      setError('otp', {
        message: OTP_ERRORS[error.code ?? ''] ?? 'Ошибка при проверке кода',
      })
      setStatus('otp-ready')
      return
    }

    await authClient.signIn.email({ email, password })

    router.replace('/')
    router.refresh()
  }

  const disabled = {
    sendCode: isSending || isSubmitting || countdown > 0,
    otp: !isOtpReady || isSubmitting,
    submit: isSubmitting || isBlocked,
  }

  return {
    onSendCode,
    onSubmit,
    countdown,
    codeSent,
    isSending,
    isSubmitting,
    disabled,
  }
}
