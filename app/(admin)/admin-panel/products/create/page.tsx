import { getAdminBrands } from '@/app/(admin)/_actions/admin-brand/get-brand'
import { getAdminCategories } from '@/app/(admin)/_actions/admin-category/get-category'
import { AdminProductForm } from '@/components/admin-panel/admin-product/AdminProductForm'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Новый товар | Админ-панель',
  description: 'Создание нового товара и модификаций',
}

export default async function CreateProductPage() {
  const [categories, brands] = await Promise.all([
    getAdminCategories(),
    getAdminBrands(),
  ])

  return (
    <AdminProductForm
      categories={categories}
      brands={brands}
    />
  )
}
