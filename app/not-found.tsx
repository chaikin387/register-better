import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-6 text-center'>
      <p className='text-8xl font-bold tracking-tighter text-muted-foreground/20'>
        404
      </p>

      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold'>Страница не найдена</h1>
        <p className='text-sm text-muted-foreground'>
          Возможно, она была удалена или вы перешли по неверной ссылке
        </p>
      </div>

      <Button
        asChild
        variant='secondary'
      >
        <Link href='/'>На главную</Link>
      </Button>
    </div>
  )
}
