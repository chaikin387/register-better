// verify-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, RefreshCw, Send } from 'lucide-react'
import { useEffect, useRef } from 'react'
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
import Link from 'next/link'
import { useVerifyEmail } from './use-verify-email'
import { verifyEmailSchema, VerifyEmailSchema } from './verify-email.schema'

interface Props {
  emailFromUrl: string
}

const OTP_LENGTH = 6

export const VerifyEmailForm = ({ emailFromUrl }: Props) => {
  const form = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
    mode: 'onChange',
    defaultValues: {
      email: emailFromUrl,
      otp: '',
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  const {
    onSubmit,
    onSendCode,
    countdown,
    codeSent,
    isSending,
    isSubmitting,
    disabled,
  } = useVerifyEmail(form)

  const [email, otp] = useWatch({
    control: form.control,
    name: ['email', 'otp'],
  })

  const otpRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled.otp) otpRef.current?.focus()
  }, [disabled.otp])

  return (
    <section className='relative container mx-auto flex min-h-dvh items-center justify-center px-4'>
      <Link
        href='/'
        className='absolute top-4 left-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:top-8 md:left-8'
      >
        <ArrowLeft className='size-4' />
        <span>На главную</span>
      </Link>
      <Card className='w-full max-w-sm'>
        <CardHeader className='p-4'>
          <CardTitle>Завершение регистрации</CardTitle>
          <CardDescription>Введите код</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
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
                          {codeSent
                            ? 'Повторно отправить код'
                            : 'Отправить код'}
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
              Подтвердить и войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
