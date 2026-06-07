import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getAdminBrands } from '@/app/(admin)/_actions/brand/get-brand'
import { getAdminCategories } from '@/app/(admin)/_actions/categories/get-category'
import { getAdminProductById } from '@/app/(admin)/_actions/products/get-product-by-id'
import { AdminProductForm } from '@/components/admin-panel/admin-product/AdminProductForm'

export const metadata: Metadata = {
  title: 'Редактирование товара | Админ-панель',
  description: 'Редактирование информации о товаре',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function UpdateProductPage({ params }: Props) {
  const { id } = await params
  const productId = parseInt(id, 10)

  const [product, categories, brands] = await Promise.all([
    getAdminProductById(productId),
    getAdminCategories(),
    getAdminBrands(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <AdminProductForm
      product={product}
      categories={categories}
      brands={brands}
    />
  )
}
