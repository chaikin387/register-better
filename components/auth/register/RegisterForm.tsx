// register-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, RefreshCw, Send } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

import { Spinner } from '@/components/ui/spinner'
import { registerSchema, RegisterSchema } from './register.schema'
import { useRegister } from './use-register'

const OTP_LENGTH = 6

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = form

  const {
    onSendCode,
    onSubmit,
    countdown,
    codeSent,
    isSending,
    isSubmitting,
    disabled,
  } = useRegister(form)

  const email = useWatch({ control: form.control, name: 'email' })
  const otp = useWatch({ control: form.control, name: 'otp' })

  const otpRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled.otp) otpRef.current?.focus()
  }, [disabled.otp])

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader className='p-4'>
        <CardTitle>Создать аккаунт</CardTitle>
        <CardDescription>Введите свои данные для регистрации</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <Input
                  type='text'
                  placeholder='Имя'
                  autoComplete='name'
                  {...register('name')}
                  className='h-10'
                />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field>
                <Input
                  type='email'
                  placeholder='Email'
                  autoComplete='email'
                  {...register('email')}
                  className='h-10'
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field>
                <FieldContent className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Пароль'
                    autoComplete='new-password'
                    {...register('password', {
                      onChange: () => trigger(['password', 'confirmPassword']),
                    })}
                    className='h-10 pr-10'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute inset-y-0 right-2 my-auto'
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </FieldContent>
                <FieldError errors={[errors.password]} />
              </Field>

              <Field>
                <FieldContent className='relative'>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Повторите пароль'
                    autoComplete='new-password'
                    {...register('confirmPassword', {
                      onChange: () => trigger(['password', 'confirmPassword']),
                    })}
                    className='h-10 pr-10'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className='absolute inset-y-0 right-2 my-auto'
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </Button>
                </FieldContent>
                <FieldError errors={[errors.confirmPassword]} />
              </Field>

              <Field className='rounded-md bg-secondary/30 p-2'>
                <FieldContent className='gap-3'>
                  {codeSent ? (
                    <p className='flex items-baseline gap-2 text-muted-foreground'>
                      <span className='size-2 shrink-0 animate-pulse rounded-full bg-green-500' />
                      <span className='select-none'>
                        Код отправлен на email:{' '}
                        <strong className='font-medium break-all text-foreground'>
                          {email}
                        </strong>
                      </span>
                    </p>
                  ) : (
                    <span className='text-muted-foreground'>
                      Нажмите{' '}
                      <span className='font-medium'>«Отправить код»</span> для
                      подтверждения email
                    </span>
                  )}

                  <Button
                    type='button'
                    variant='ghost'
                    onClick={onSendCode}
                    disabled={disabled.sendCode}
                    className='self-start'
                  >
                    {countdown > 0 ? (
                      <>
                        Повторно отправить код через{' '}
                        <span className='font-medium text-destructive tabular-nums'>
                          {countdown}с
                        </span>
                      </>
                    ) : (
                      <>
                        {isSending ? (
                          <Spinner data-icon='inline-start' />
                        ) : codeSent ? (
                          <RefreshCw className='size-3' />
                        ) : (
                          <Send className='size-3' />
                        )}
                        {codeSent ? 'Повторно отправить код' : 'Отправить код'}
                      </>
                    )}
                  </Button>

                  <InputOTP
                    id='otp'
                    ref={otpRef}
                    maxLength={OTP_LENGTH}
                    value={otp}
                    onChange={(val) =>
                      setValue('otp', val, { shouldValidate: true })
                    }
                    disabled={disabled.otp}
                    containerClassName='w-fit'
                  >
                    <InputOTPGroup className='gap-1.5'>
                      {Array.from({ length: OTP_LENGTH }, (_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className='rounded-lg border border-primary/30 first:rounded-lg last:rounded-lg'
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  <FieldError errors={[errors.otp]} />
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>

          {errors.root && (
            <p className='mt-5 text-center text-sm font-medium text-destructive'>
              {errors.root.message}
            </p>
          )}

          <Button
            type='submit'
            disabled={disabled.submit}
            className='mt-5 w-full'
          >
            {isSubmitting && <Spinner data-icon='inline-start' />}
            Зарегистрироваться
          </Button>
        </form>

        <p className='mt-5 text-center text-sm text-muted-foreground'>
          Уже есть аккаунт?{' '}
          <Link
            href='/login'
            replace
            className='font-medium text-primary hover:underline hover:underline-offset-3'
          >
            Войти
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
