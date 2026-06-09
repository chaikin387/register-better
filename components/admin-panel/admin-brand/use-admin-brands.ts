'use client'

import { useState } from 'react'

import type { AdminBrandSelectItem } from '@/types/admin-brand.selects'

export function useAdminBrands(initialBrands: AdminBrandSelectItem[]) {
  const [brands, setBrands] = useState<AdminBrandSelectItem[]>(initialBrands)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateBrand, setUpdateBrand] = useState<AdminBrandSelectItem | null>(
    null
  )
  const [deleteBrand, setDeleteBrand] = useState<AdminBrandSelectItem | null>(
    null
  )

  function handleCreateSuccess(brand: AdminBrandSelectItem) {
    setBrands((prev) =>
      [...prev, brand].sort((a, b) => a.name.localeCompare(b.name))
    )
  }

  function handleUpdateSuccess(updated: AdminBrandSelectItem) {
    setBrands((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
  }

  function handleDeleteSuccess(id: string) {
    setBrands((prev) => prev.filter((b) => b.id !== id))
  }

  return {
    brands,
    createOpen,
    updateBrand,
    deleteBrand,
    setCreateOpen,
    setUpdateBrand,
    setDeleteBrand,
    handleCreateSuccess,
    handleUpdateSuccess,
    handleDeleteSuccess,
  }
}
