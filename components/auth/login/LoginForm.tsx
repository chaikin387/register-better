'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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

import { Spinner } from '@/components/ui/spinner'
import { loginSchema, LoginSchema } from './login.schema'
import { useLogin } from './use-login'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const { onSubmit, onChange, isSubmitting, countdown, disabled } =
    useLogin(form)

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader className='p-4'>
        <CardTitle>Войти в аккаунт</CardTitle>
        <CardDescription>Введите данные для входа</CardDescription>
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
                  {...register('email', { onChange })}
                  className='h-10'
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field>
                <FieldContent className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Пароль'
                    autoComplete='current-password'
                    {...register('password', { onChange })}
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
                <div className='flex items-center justify-between'>
                  <FieldError errors={[errors.password]} />
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
            {countdown > 0 ? (
              <>
                Повторить через{' '}
                <span className='font-medium tabular-nums'>{countdown}с</span>
              </>
            ) : (
              <>
                {isSubmitting && <Spinner data-icon='inline-start' />}
                Войти
              </>
            )}
          </Button>
        </form>

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
  )
}
