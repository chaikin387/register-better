'use client'

import { useState } from 'react'

import { AdminCategoryTreeSelect } from '@/types/admin-category-selects'

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

// --- Мутации дерева ---

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
  id: number
): AdminCategoryTreeSelect[] {
  return list
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: item.children ? removeItem(item.children, id) : [],
    }))
}

// Меняет два элемента местами на любом уровне дерева.
// Повторный вызов с теми же id — автоматический откат.
function swapItems(
  list: AdminCategoryTreeSelect[],
  idA: number,
  idB: number
): AdminCategoryTreeSelect[] {
  const idxA = list.findIndex((c) => c.id === idA)
  const idxB = list.findIndex((c) => c.id === idB)

  if (idxA !== -1 && idxB !== -1) {
    const next = [...list]
    ;[next[idxA], next[idxB]] = [next[idxB], next[idxA]]
    return next
  }

  // Не нашли на этом уровне — ищем глубже
  return list.map((item) =>
    item.children?.length
      ? { ...item, children: swapItems(item.children, idA, idB) }
      : item
  )
}

// --- Хук ---

export function useAdminCatalog(initialCategories: AdminCategoryTreeSelect[]) {
  const [categories, setCategories] = useState(initialCategories)
  const [createDialog, setCreateDialog] =
    useState<CreateDialogState>(CREATE_DIALOG_CLOSED)
  const [UpdateDialog, setUpdateDialog] =
    useState<UpdateDialogState>(UPDATE_DIALOG_CLOSED)
  const [deleteDialog, setDeleteDialog] =
    useState<DeleteDialogState>(DELETE_DIALOG_CLOSED)

  // --- Диалоги ---

  const openCreateDialog = (parentId: number | null, targetLevel: number) =>
    setCreateDialog({ isOpen: true, parentId, level: targetLevel })
  const closeCreateDialog = () => setCreateDialog(CREATE_DIALOG_CLOSED)

  const openUpdateDialog = (category: AdminCategoryTreeSelect) =>
    setUpdateDialog({ isOpen: true, category })
  const closeUpdateDialog = () => setUpdateDialog(UPDATE_DIALOG_CLOSED)

  const openDeleteDialog = (category: AdminCategoryTreeSelect) =>
    setDeleteDialog({ isOpen: true, category })
  const closeDeleteDialog = () => setDeleteDialog(DELETE_DIALOG_CLOSED)

  // --- Мутации ---

  const handleCreateSuccess = (newCat: AdminCategoryTreeSelect) =>
    setCategories((prev) =>
      newCat.parentId === null ? [...prev, newCat] : insertChild(prev, newCat)
    )

  const handleUpdateSuccess = (updated: AdminCategoryTreeSelect) =>
    setCategories((prev) => updateItem(prev, updated))

  const handleDeleteSuccess = (id: number) =>
    setCategories((prev) => removeItem(prev, id))

  // Оптимистичный swap: применяется до ответа сервера.
  // При ошибке вызывается повторно — swap идемпотентен относительно пары id.
  const handleSwapSuccess = (idA: number, idB: number) =>
    setCategories((prev) => swapItems(prev, idA, idB))

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
    handleSwapSuccess,
  }
}
