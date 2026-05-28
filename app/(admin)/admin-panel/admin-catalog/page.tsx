import { AdminCatalogClient } from '@/components/admin-panel/admin-catalog/AdminCatalogClient'

import { Metadata } from 'next'
import { getAdminCategoriesTree } from '../../_actions/get-category-tree'

export const metadata: Metadata = {
  title: 'Каталог товаров | Админ-панель',
  description: 'Управление категориями и структурой каталога',
}

export default async function CatalogPage() {
  const initialCategories = await getAdminCategoriesTree()

  return <AdminCatalogClient initialCategories={initialCategories} />
}
