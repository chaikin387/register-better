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
  params: Promise<{ id: string; slug: string }>
}

export default async function UpdateProductPage({ params }: Props) {
  const { id } = await params // slug не нужен — ищем только по id

  const [product, categories, brands] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
    getAdminBrands(),
  ])

  if (!product) notFound()

  return (
    <AdminProductForm
      product={product}
      categories={categories}
      brands={brands}
    />
  )
}
