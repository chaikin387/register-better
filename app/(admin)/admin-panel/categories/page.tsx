import { AdminCategoriesClient } from '@/components/admin-panel/admin-category/AdminCategoriesClient'

import { Metadata } from 'next'
import { getAdminCategories } from '../../_actions/categories/get-category'

export const metadata: Metadata = {
  title: 'Категории | Админ-панель',
  description: 'Управление категориями ',
}

export default async function CategoriesPage() {
  const initialCategories = await getAdminCategories()

  return <AdminCategoriesClient initialCategories={initialCategories} />
}
