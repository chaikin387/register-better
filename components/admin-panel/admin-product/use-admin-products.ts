'use client'

import { useState } from 'react'

import type { AdminProductItemSelect } from '@/types/admin-product-selects'

export function useAdminProducts(initialProducts: AdminProductItemSelect[]) {
  const [products, setProducts] =
    useState<AdminProductItemSelect[]>(initialProducts)
  const [deleteProduct, setDeleteProduct] =
    useState<AdminProductItemSelect | null>(null)

  function handleDeleteSuccess(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return {
    products,
    deleteProduct,
    setDeleteProduct,
    handleDeleteSuccess,
  }
}
