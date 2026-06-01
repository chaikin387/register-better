import { getAdminCategories } from '@/app/(admin)/_actions/categories/get-category'
import { AdminProductCreateForm } from '@/components/admin-panel/admin-product/AdminProductCreateForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Новый товар | Админ-панель',
  description: 'Создание нового товара и модификаций',
}

export default async function CreateProductPage() {
  const categoriesTree = await getAdminCategories()

  return <AdminProductCreateForm categories={categoriesTree} />
}
