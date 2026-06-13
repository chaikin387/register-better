import { Metadata } from 'next'

import { getAdminAttributes } from '@/app/(admin)/_actions/admin-attribute/get-attributes'
import { AdminAttributesClient } from '@/components/admin-panel/admin-attribute/AdminAttributesClient'

export const metadata: Metadata = {
  title: 'Атрибуты | Админ-панель',
  description: 'Управление атрибутами товаров',
}

export default async function AttributesPage() {
  const initialAttributes = await getAdminAttributes()

  return <AdminAttributesClient initialAttributes={initialAttributes} />
}
