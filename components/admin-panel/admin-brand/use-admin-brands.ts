'use client'

import type { AdminBrandSelectItem } from '@/types/admin-brand.selects'
import { useState } from 'react'

interface DialogState {
  isOpen: boolean
  brand: AdminBrandSelectItem | null
}

const CLOSED: DialogState = { isOpen: false, brand: null }

export function useAdminBrands(initialBrands: AdminBrandSelectItem[]) {
  const [brands, setBrands] = useState<AdminBrandSelectItem[]>(initialBrands)
  const [createDialog, setCreateDialog] = useState<DialogState>(CLOSED)
  const [updateDialog, setUpdateDialog] = useState<DialogState>(CLOSED)
  const [deleteDialog, setDeleteDialog] = useState<DialogState>(CLOSED)

  const openCreateDialog = () => setCreateDialog({ isOpen: true, brand: null })
  const closeCreateDialog = () => setCreateDialog(CLOSED)

  const openUpdateDialog = (brand: AdminBrandSelectItem) =>
    setUpdateDialog({ isOpen: true, brand })
  const closeUpdateDialog = () => setUpdateDialog(CLOSED)

  const openDeleteDialog = (brand: AdminBrandSelectItem) =>
    setDeleteDialog({ isOpen: true, brand })
  const closeDeleteDialog = () => setDeleteDialog(CLOSED)

  const handleCreateSuccess = (brand: AdminBrandSelectItem) =>
    setBrands((prev) =>
      [...prev, brand].sort((a, b) => a.name.localeCompare(b.name))
    )

  const handleUpdateSuccess = (updated: AdminBrandSelectItem) =>
    setBrands((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))

  const handleDeleteSuccess = (id: number) =>
    setBrands((prev) => prev.filter((b) => b.id !== id))

  return {
    brands,
    createDialog,
    updateDialog,
    deleteDialog,
    openCreateDialog,
    closeCreateDialog,
    openUpdateDialog,
    closeUpdateDialog,
    openDeleteDialog,
    closeDeleteDialog,
    handleCreateSuccess,
    handleUpdateSuccess,
    handleDeleteSuccess,
  }
}
