'use client'

import { useState } from 'react'

import { getAdminCategoryAttributes } from '@/app/(admin)/_actions/admin-category-attribute/get-category-attribute'
import type { AdminCategoryAttributeSelectItem } from '@/types/admin-category-attribute'
import type { AdminCategoryTreeSelect } from '@/types/admin-category-selects'

interface CreateDialogState {
  parentId: string | null
  level: number
}

interface AttributesDialogState {
  category: AdminCategoryTreeSelect
  categoryAttributes: AdminCategoryAttributeSelectItem[]
}

export function useAdminCategories() {
  const [createDialog, setCreateDialog] = useState<CreateDialogState | null>(
    null
  )
  const [updateCategory, setUpdateCategory] =
    useState<AdminCategoryTreeSelect | null>(null)
  const [deleteCategory, setDeleteCategory] =
    useState<AdminCategoryTreeSelect | null>(null)
  const [attributesDialog, setAttributesDialog] =
    useState<AttributesDialogState | null>(null)

  async function openAttributesDialog(category: AdminCategoryTreeSelect) {
    const categoryAttributes = await getAdminCategoryAttributes(category.id)
    setAttributesDialog({ category, categoryAttributes })
  }

  return {
    createDialog,
    updateCategory,
    deleteCategory,
    attributesDialog,
    setCreateDialog,
    setUpdateCategory,
    setDeleteCategory,
    setAttributesDialog,
    openAttributesDialog,
  }
}
