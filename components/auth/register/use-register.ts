'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { useCountdown } from '../hooks/use-countdown'
import { RegisterSchema } from './register.schema'

const SIGN_UP_ERRORS: Record<string, string> = {
  FAILED_TO_CREATE_USER: 'Не удалось создать аккаунт.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    'Email уже зарегистрирован. Попробуйте войти или восстановить пароль.',
  RATE_LIMIT: 'Слишком много попыток регистрации. Подождите немного.',
}

const OTP_ERRORS: Record<string, string> = {
  INVALID_OTP: 'Неверный код. Попробуйте ещё раз.',
  OTP_EXPIRED: 'Код истёк. Получите новый код.',
  TOO_MANY_ATTEMPTS: 'Слишком много попыток. Введите другой код.',
  TOO_MANY_REQUESTS: 'Слишком много попыток. Пожалуйста, попробуйте позже.',
  SEND_RATE_LIMIT: 'Слишком много попыток. Отправьте код позже.',
}

type Status = 'idle' | 'sending' | 'otp-ready' | 'submitting' | 'blocked'

export function useRegister(form: UseFormReturn<RegisterSchema>) {
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
    const isValid = await trigger([
      'name',
      'email',
      'password',
      'confirmPassword',
    ])
    if (!isValid) return

    setStatus('sending')
    clearErrors('otp')
    clearErrors('root')
    form.setValue('otp', '')

    const { error: signUpError } = await authClient.signUp.email({
      name: getValues('name'),
      email: getValues('email'),
      password: getValues('password'),
    })

    if (signUpError) {
      if (signUpError.status === 429) {
        setError('root', { message: SIGN_UP_ERRORS.RATE_LIMIT })
        setStatus('idle')
        start()
        return
      }

      setError('root', {
        message: SIGN_UP_ERRORS[signUpError.code ?? ''] ?? 'Ошибка регистрации',
      })
      setStatus('idle')
      return
    }

    const { error: otpError } = await authClient.emailOtp.sendVerificationOtp({
      email: getValues('email'),
      type: 'email-verification',
    })

    if (otpError) {
      if (otpError.status === 429) {
        setError('root', { message: OTP_ERRORS.SEND_RATE_LIMIT })
        setStatus('blocked')
        start()
        return
      }

      setError('root', {
        message: OTP_ERRORS[otpError.code ?? ''] ?? 'Не удалось отправить код',
      })
      setStatus('idle')
      return
    }

    setStatus('otp-ready')
    start()
  }

  const onSubmit = async ({ email, otp }: RegisterSchema) => {
    if (!isOtpReady) {
      setError('otp', { message: 'Введите код из email' })
      return
    }

    setStatus('submitting')

    const { error } = await authClient.emailOtp.verifyEmail({ email, otp })

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
    otp: !isOtpReady || isSubmitting || isBlocked,
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
