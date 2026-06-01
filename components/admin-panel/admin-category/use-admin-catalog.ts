'use client'

import { AdminCategoryTreeSelect } from '@/types/admin-category-selects'
import { useState } from 'react'

interface CreateDialogState {
  isOpen: boolean
  parentId: number | null
  level: number
}

interface UpdateDialogState {
  isOpen: boolean
  category: AdminCategoryTreeSelect | null
}

interface DeleteDialogState {
  isOpen: boolean
  category: AdminCategoryTreeSelect | null
}

const CREATE_DIALOG_CLOSED: CreateDialogState = {
  isOpen: false,
  parentId: null,
  level: 1,
}
const UPDATE_DIALOG_CLOSED: UpdateDialogState = {
  isOpen: false,
  category: null,
}
const DELETE_DIALOG_CLOSED: DeleteDialogState = {
  isOpen: false,
  category: null,
}

function insertChild(
  list: AdminCategoryTreeSelect[],
  newCat: AdminCategoryTreeSelect
): AdminCategoryTreeSelect[] {
  return list.map((item) => {
    if (item.id === newCat.parentId)
      return { ...item, children: [...(item.children || []), newCat] }
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
  id: number
): AdminCategoryTreeSelect[] {
  return list
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: item.children ? removeItem(item.children, id) : [],
    }))
}

export function useAdminCatalog(initialCategories: AdminCategoryTreeSelect[]) {
  const [categories, setCategories] =
    useState<AdminCategoryTreeSelect[]>(initialCategories)
  const [createDialog, setCreateDialog] =
    useState<CreateDialogState>(CREATE_DIALOG_CLOSED)
  const [UpdateDialog, setUpdateDialog] =
    useState<UpdateDialogState>(UPDATE_DIALOG_CLOSED)
  const [deleteDialog, setDeleteDialog] =
    useState<DeleteDialogState>(DELETE_DIALOG_CLOSED)

  const openCreateDialog = (parentId: number | null, targetLevel: number) =>
    setCreateDialog({ isOpen: true, parentId, level: targetLevel })

  const closeCreateDialog = () => setCreateDialog(CREATE_DIALOG_CLOSED)

  const openUpdateDialog = (category: AdminCategoryTreeSelect) =>
    setUpdateDialog({ isOpen: true, category })

  const closeUpdateDialog = () => setUpdateDialog(UPDATE_DIALOG_CLOSED)

  const openDeleteDialog = (category: AdminCategoryTreeSelect) =>
    setDeleteDialog({ isOpen: true, category })

  const closeDeleteDialog = () => setDeleteDialog(DELETE_DIALOG_CLOSED)

  const handleCreateSuccess = (newCat: AdminCategoryTreeSelect) =>
    setCategories((prev) =>
      newCat.parentId === null ? [...prev, newCat] : insertChild(prev, newCat)
    )

  const handleUpdateSuccess = (updated: AdminCategoryTreeSelect) =>
    setCategories((prev) => updateItem(prev, updated))

  const handleDeleteSuccess = (id: number) =>
    setCategories((prev) => removeItem(prev, id))

  return {
    categories,
    createDialog,
    UpdateDialog,
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
