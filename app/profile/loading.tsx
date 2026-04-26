import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className='flex min-h-[85vh] items-center justify-center'>
      <Loader2 className='text-muted-foreground size-12 animate-spin' />
    </div>
  )
}
