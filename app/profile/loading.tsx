import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <div className='flex min-h-[85vh] items-center justify-center'>
      <Spinner className='size-10' />
    </div>
  )
}
