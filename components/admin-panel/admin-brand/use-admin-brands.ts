'use client'

import { useState } from 'react'

import type { AdminBrandSelectItem } from '@/types/admin-brand.selects'

export function useAdminBrands() {
  const [createOpen, setCreateOpen] = useState(false)
  const [updateBrand, setUpdateBrand] = useState<AdminBrandSelectItem | null>(
    null
  )
  const [deleteBrand, setDeleteBrand] = useState<AdminBrandSelectItem | null>(
    null
  )

  return {
    createOpen,
    updateBrand,
    deleteBrand,
    setCreateOpen,
    setUpdateBrand,
    setDeleteBrand,
  }
}
