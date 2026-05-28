import { AdminPanelClient } from '@/components/admin-panel/AdminPanelClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Админ-панель',
  description: 'Админ-панель',
}

export default async function AdminPanelPage() {
  return <AdminPanelClient />
}
