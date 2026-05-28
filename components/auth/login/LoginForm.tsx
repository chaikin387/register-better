'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, EyeOff, RefreshCw, Send } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { loginOtpSchema, LoginOtpSchema } from './login-otp.schema'
import { loginSchema, LoginSchema } from './login.schema'
import { useLogin } from './use-login'
import { useLoginOtp } from './use-login-otp'

const OTP_LENGTH = 6

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  const passwordForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = passwordForm

  const {
    onSubmit: onSubmitPassword,
    onChange: onChangePassword,
    isSubmitting: isSubmittingPassword,
    countdown: countdownPassword,
    disabled: disabledPassword,
  } = useLogin(passwordForm)

  const otpForm = useForm<LoginOtpSchema>({
    resolver: zodResolver(loginOtpSchema),
    mode: 'onChange',
    defaultValues: { email: '', otp: '' },
  })

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    setValue: setOtpValue,
    formState: { errors: otpErrors },
  } = otpForm

  const {
    onSubmit: onSubmitOtp,
    onSendCode,
    countdown: countdownOtp,
    codeSent,
    isSending,
    isSubmitting: isSubmittingOtp,
    disabled: disabledOtp,
  } = useLoginOtp(otpForm)

  const [email, otp] = useWatch({
    control: otpForm.control,
    name: ['email', 'otp'],
  })

  const otpRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabledOtp.otp) otpRef.current?.focus()
  }, [disabledOtp.otp])

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
          <CardTitle>Войти в аккаунт</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue='password'>
            <TabsList className='mb-4 w-full'>
              <TabsTrigger
                value='password'
                className='flex-1'
              >
                По паролю
              </TabsTrigger>
              <TabsTrigger
                value='otp'
                className='flex-1'
              >
                По коду
              </TabsTrigger>
            </TabsList>

            {/* ================= ФОРМА: ПО ПАРОЛЮ ================= */}
            <TabsContent value='password'>
              <CardDescription className='mb-4'>
                Введите email и пароль
              </CardDescription>

              <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <Input
                        type='email'
                        placeholder='Email'
                        autoComplete='email'
                        {...registerPassword('email', {
                          onChange: onChangePassword,
                        })}
                        className='h-10'
                      />
                      <FieldError errors={[passwordErrors.email]} />
                    </Field>

                    <Field>
                      <FieldContent className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Пароль'
                          autoComplete='current-password'
                          {...registerPassword('password', {
                            onChange: onChangePassword,
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
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </Button>
                      </FieldContent>
                      <div className='flex items-center justify-between'>
                        <FieldError errors={[passwordErrors.password]} />
                        <Link
                          href='/forgot-password'
                          replace
                          className='ml-auto text-sm text-primary hover:underline hover:underline-offset-3'
                        >
                          Забыли пароль?
                        </Link>
                      </div>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                {passwordErrors.root && (
                  <p className='mt-5 text-center text-sm font-medium text-destructive'>
                    {passwordErrors.root.message}
                  </p>
                )}

                <Button
                  type='submit'
                  disabled={disabledPassword.submit}
                  className='mt-5 w-full'
                >
                  {countdownPassword > 0 ? (
                    <>
                      Повторить через{' '}
                      <span className='font-medium tabular-nums'>
                        {countdownPassword}с
                      </span>
                    </>
                  ) : (
                    <>
                      {isSubmittingPassword && (
                        <Spinner data-icon='inline-start' />
                      )}
                      Войти
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* ================= ФОРМА: ПО ОДНОРАЗОВОМУ КОДУ ================= */}
            <TabsContent value='otp'>
              <CardDescription className='mb-4'>
                Введите email и код
              </CardDescription>

              <form onSubmit={handleSubmitOtp(onSubmitOtp)}>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <Input
                        type='email'
                        placeholder='Email'
                        autoComplete='email'
                        {...registerOtp('email')}
                        className='h-10'
                      />
                      <FieldError errors={[otpErrors.email]} />
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
                            <span className='font-medium'>«Отправить код»</span>{' '}
                            для подтверждения email
                          </span>
                        )}

                        <Button
                          type='button'
                          variant='ghost'
                          onClick={onSendCode}
                          disabled={disabledOtp.sendCode}
                          className='self-start'
                        >
                          {countdownOtp > 0 ? (
                            <>
                              Повторно отправить код через{' '}
                              <span className='font-medium text-destructive tabular-nums'>
                                {countdownOtp}с
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
                            setOtpValue('otp', val, { shouldValidate: true })
                          }
                          disabled={disabledOtp.otp}
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

                        <FieldError errors={[otpErrors.otp]} />
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                {otpErrors.root && (
                  <p className='mt-5 text-center text-sm font-medium text-destructive'>
                    {otpErrors.root.message}
                  </p>
                )}

                <Button
                  type='submit'
                  disabled={disabledOtp.submit}
                  className='mt-5 w-full'
                >
                  {isSubmittingOtp && <Spinner data-icon='inline-start' />}
                  Войти
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className='mt-5 text-center text-sm text-muted-foreground'>
            Нет аккаунта?{' '}
            <Link
              href='/register'
              replace
              className='font-medium text-primary hover:underline hover:underline-offset-3'
            >
              Создать аккаунт
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
