'use client'

import type { AdminCategoryTreeSelect } from '@/types/admin-category-selects'
import { useState } from 'react'

interface CreateDialogState {
  parentId: string | null
  level: number
}

export function useAdminCatalog() {
  const [createDialog, setCreateDialog] = useState<CreateDialogState | null>(
    null
  )
  const [updateCategory, setUpdateCategory] =
    useState<AdminCategoryTreeSelect | null>(null)
  const [deleteCategory, setDeleteCategory] =
    useState<AdminCategoryTreeSelect | null>(null)

  return {
    createDialog,
    updateCategory,
    deleteCategory,
    setCreateDialog,
    setUpdateCategory,
    setDeleteCategory,
  }
}
