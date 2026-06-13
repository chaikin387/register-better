import { AdminBrandsClient } from '@/components/admin-panel/admin-brand/AdminBrandsClient'
import { Metadata } from 'next'
import { getAdminBrands } from '../../_actions/admin-brand/get-brand'

export const metadata: Metadata = {
  title: 'Бренды | Админ-панель',
  description: 'Управление брендами ',
}

export default async function BrandsPage() {
  const initialBrands = await getAdminBrands()

  return <AdminBrandsClient initialBrands={initialBrands} />
}
