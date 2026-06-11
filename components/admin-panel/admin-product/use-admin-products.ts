'use client'

import { useState } from 'react'

import type { AdminProductItemSelect } from '@/types/admin-product-selects'

export function useAdminProducts() {
  const [deleteProduct, setDeleteProduct] =
    useState<AdminProductItemSelect | null>(null)

  return {
    deleteProduct,
    setDeleteProduct,
  }
}
