import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function AdminSidebarHeader() {
  return (
    <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
      <div className='flex items-center gap-2'>
        <SidebarTrigger />
        <Separator
          orientation='vertical'
          className='h-6'
        />
      </div>
    </header>
  )
}
