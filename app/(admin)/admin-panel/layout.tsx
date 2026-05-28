import { AdminSidebar } from '@/components/admin-panel/admin-sidebar/AdminSidebar'
import { AdminSidebarHeader } from '@/components/admin-panel/admin-sidebar/AdminSidebarHeader'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main className='flex flex-1 flex-col'>
          <AdminSidebarHeader />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
