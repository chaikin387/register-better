import { AdminProductsClient } from '@/components/admin-panel/admin-product/AdminProductsClient'
import { Metadata } from 'next'
import { getAdminProducts } from '../../_actions/products/get-product'

export const metadata: Metadata = {
  title: 'Товары | Админ-панель',
  description: 'Управление товарами ',
}

export default async function ProductsPage() {
  const initialProducts = await getAdminProducts()
  return <AdminProductsClient initialProducts={initialProducts} />
}
