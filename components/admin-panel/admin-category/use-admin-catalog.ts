'use client'

import { useState } from 'react'

import type { AdminCategoryTreeSelect } from '@/types/admin-category-selects'

interface CreateDialogState {
  parentId: string | null
  level: number
}

function insertChild(
  list: AdminCategoryTreeSelect[],
  newCat: AdminCategoryTreeSelect
): AdminCategoryTreeSelect[] {
  return list.map((item) => {
    if (item.id === newCat.parentId)
      return { ...item, children: [...(item.children ?? []), newCat] }
    if (item.children?.length)
      return { ...item, children: insertChild(item.children, newCat) }
    return item
  })
}

function updateItem(
  list: AdminCategoryTreeSelect[],
  updated: AdminCategoryTreeSelect
): AdminCategoryTreeSelect[] {
  return list.map((item) => {
    if (item.id === updated.id)
      return { ...item, ...updated, children: item.children }
    if (item.children?.length)
      return { ...item, children: updateItem(item.children, updated) }
    return item
  })
}

function removeItem(
  list: AdminCategoryTreeSelect[],
  id: string
): AdminCategoryTreeSelect[] {
  return list
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: item.children ? removeItem(item.children, id) : [],
    }))
}

function swapItems(
  list: AdminCategoryTreeSelect[],
  idA: string,
  idB: string
): AdminCategoryTreeSelect[] {
  const idxA = list.findIndex((c) => c.id === idA)
  const idxB = list.findIndex((c) => c.id === idB)

  if (idxA !== -1 && idxB !== -1) {
    const next = [...list]
    ;[next[idxA], next[idxB]] = [next[idxB], next[idxA]]
    return next
  }

  return list.map((item) =>
    item.children?.length
      ? { ...item, children: swapItems(item.children, idA, idB) }
      : item
  )
}

export function useAdminCatalog(initialCategories: AdminCategoryTreeSelect[]) {
  const [categories, setCategories] = useState(initialCategories)
  const [createDialog, setCreateDialog] = useState<CreateDialogState | null>(
    null
  )
  const [updateCategory, setUpdateCategory] =
    useState<AdminCategoryTreeSelect | null>(null)
  const [deleteCategory, setDeleteCategory] =
    useState<AdminCategoryTreeSelect | null>(null)

  function handleCreateSuccess(newCat: AdminCategoryTreeSelect) {
    setCategories((prev) =>
      newCat.parentId === null ? [...prev, newCat] : insertChild(prev, newCat)
    )
  }

  function handleUpdateSuccess(updated: AdminCategoryTreeSelect) {
    setCategories((prev) => updateItem(prev, updated))
  }

  function handleDeleteSuccess(id: string) {
    setCategories((prev) => removeItem(prev, id))
  }

  function handleSwapSuccess(idA: string, idB: string) {
    setCategories((prev) => swapItems(prev, idA, idB))
  }

  return {
    categories,
    createDialog,
    updateCategory,
    deleteCategory,
    setCreateDialog,
    setUpdateCategory,
    setDeleteCategory,
    handleCreateSuccess,
    handleUpdateSuccess,
    handleDeleteSuccess,
    handleSwapSuccess,
  }
}
