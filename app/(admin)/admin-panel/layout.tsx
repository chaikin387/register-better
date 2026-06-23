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
        <AdminSidebarHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
