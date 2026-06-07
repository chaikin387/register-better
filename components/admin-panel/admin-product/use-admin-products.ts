'use client'

import type { AdminProductItemSelect } from '@/types/admin-product-selects'
import { useState } from 'react'

interface DialogState {
  isOpen: boolean
  product: AdminProductItemSelect | null
}

const CLOSED: DialogState = { isOpen: false, product: null }

export function useAdminProducts(initialProducts: AdminProductItemSelect[]) {
  const [products, setProducts] =
    useState<AdminProductItemSelect[]>(initialProducts)
  const [deleteDialog, setDeleteDialog] = useState<DialogState>(CLOSED)

  const openDeleteDialog = (product: AdminProductItemSelect) =>
    setDeleteDialog({ isOpen: true, product })
  const closeDeleteDialog = () => setDeleteDialog(CLOSED)

  // На будущее: если при создании/апдейте товаров тоже решишь сделать диалоги вместо страниц,
  // стейты под них уже будут легко расширяться здесь.

  const handleDeleteSuccess = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id))

  return {
    products,
    deleteDialog,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteSuccess,
  }
}
