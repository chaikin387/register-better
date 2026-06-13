import { AdminCategoriesClient } from '@/components/admin-panel/admin-category/AdminCategoriesClient'

import { Metadata } from 'next'
import { getAdminAttributes } from '../../_actions/admin-attribute/get-attributes'
import { getAdminCategories } from '../../_actions/admin-category/get-category'

export const metadata: Metadata = {
  title: 'Категории | Админ-панель',
  description: 'Управление категориями ',
}

export default async function CategoriesPage() {
  const [categories, allAttributes] = await Promise.all([
    getAdminCategories(),
    getAdminAttributes(),
  ])

  return (
    <AdminCategoriesClient
      initialCategories={categories}
      allAttributes={allAttributes}
    />
  )
}
