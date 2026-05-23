'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { useCountdown } from '../hooks/use-countdown'
import { LoginOtpSchema } from './login-otp.schema'

const OTP_ERRORS: Record<string, string> = {
  INVALID_OTP: 'Неверный код. Попробуйте ещё раз.',
  OTP_EXPIRED: 'Код истёк. Получите новый код.',
  TOO_MANY_ATTEMPTS: 'Слишком много попыток. Пожалуйста, попробуйте позже.',
  TOO_MANY_REQUESTS: 'Слишком много попыток. Пожалуйста, попробуйте позже.',
  SEND_RATE_LIMIT: 'Слишком много попыток. Пожалуйста, попробуйте позже.',
}

type Status = 'idle' | 'sending' | 'otp-ready' | 'submitting' | 'blocked'

export function useLoginOtp(form: UseFormReturn<LoginOtpSchema>) {
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
    const isValid = await trigger('email')
    if (!isValid) return

    setStatus('sending')
    clearErrors('otp')
    clearErrors('root')
    form.setValue('otp', '')

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: getValues('email'),
      type: 'sign-in',
    })

    if (error) {
      if (error.status === 429) {
        setError('root', { message: OTP_ERRORS.SEND_RATE_LIMIT })
        setStatus('otp-ready')
        start()
        return
      }

      setError('root', {
        message:
          OTP_ERRORS[error.code ?? ''] ??
          error.message ??
          'Не удалось отправить код',
      })
      setStatus('idle')
      return
    }

    setStatus('otp-ready')
    start()
  }

  const onSubmit = async ({ email, otp }: LoginOtpSchema) => {
    if (!isOtpReady) {
      setError('otp', { message: 'Введите код из email' })
      return
    }

    setStatus('submitting')

    const { error } = await authClient.signIn.emailOtp({ email, otp })

    if (error) {
      form.setValue('otp', '')

      if (error.status === 429) {
        setError('otp', { message: OTP_ERRORS.TOO_MANY_REQUESTS })
        setStatus('blocked')
        start()
        return
      }

      if (error.code === 'TOO_MANY_ATTEMPTS') {
        setError('otp', { message: OTP_ERRORS.TOO_MANY_ATTEMPTS })
        setStatus('blocked')
        start()
        return
      }

      setError('otp', {
        message: OTP_ERRORS[error.code ?? ''] ?? 'Ошибка при проверке кода',
      })
      setStatus('otp-ready')
      return
    }

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
