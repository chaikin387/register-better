'use client'

import { type AdminCategoryTree } from '@/types/admin-category-selects'
import { useState } from 'react'

// ── Типы ─────────────────────────────────────────────────────────────────────

interface CreateModalState {
  isOpen: boolean
  parentId: number | null
  level: number
}
interface EditModalState {
  isOpen: boolean
  category: AdminCategoryTree | null
}
interface DeleteModalState {
  isOpen: boolean
  category: AdminCategoryTree | null
}

const CREATE_MODAL_CLOSED: CreateModalState = {
  isOpen: false,
  parentId: null,
  level: 1,
}
const EDIT_MODAL_CLOSED: EditModalState = { isOpen: false, category: null }
const DELETE_MODAL_CLOSED: DeleteModalState = { isOpen: false, category: null }

// ── Утилиты ──────────────────────────────────────────────────────────────────

function findCategory(
  list: AdminCategoryTree[],
  id: number
): AdminCategoryTree | null {
  for (const item of list) {
    if (item.id === id) return item
    if (item.children?.length) {
      const found = findCategory(item.children, id)
      if (found) return found
    }
  }
  return null
}

function insertChild(
  list: AdminCategoryTree[],
  newCat: AdminCategoryTree
): AdminCategoryTree[] {
  return list.map((item) => {
    if (item.id === newCat.parentId)
      return { ...item, children: [...(item.children || []), newCat] }
    if (item.children?.length)
      return { ...item, children: insertChild(item.children, newCat) }
    return item
  })
}

function updateItem(
  list: AdminCategoryTree[],
  updated: AdminCategoryTree
): AdminCategoryTree[] {
  return list.map((item) => {
    if (item.id === updated.id)
      return { ...item, ...updated, children: item.children }
    if (item.children?.length)
      return { ...item, children: updateItem(item.children, updated) }
    return item
  })
}

function removeItem(
  list: AdminCategoryTree[],
  id: number
): AdminCategoryTree[] {
  return list
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: item.children ? removeItem(item.children, id) : [],
    }))
}

// ── Хук ──────────────────────────────────────────────────────────────────────

export function useAdminCatalog(initialCategories: AdminCategoryTree[]) {
  const [categories, setCategories] =
    useState<AdminCategoryTree[]>(initialCategories)
  const [createModal, setCreateModal] =
    useState<CreateModalState>(CREATE_MODAL_CLOSED)
  const [editModal, setEditModal] = useState<EditModalState>(EDIT_MODAL_CLOSED)
  const [deleteModal, setDeleteModal] =
    useState<DeleteModalState>(DELETE_MODAL_CLOSED)

  const openCreateModal = (parentId: number | null, targetLevel: number) =>
    setCreateModal({ isOpen: true, parentId, level: targetLevel })

  const closeCreateModal = () => setCreateModal(CREATE_MODAL_CLOSED)

  const openEditModal = (categoryId: number) => {
    const category = findCategory(categories, categoryId)
    if (category) setEditModal({ isOpen: true, category })
  }

  const closeEditModal = () => setEditModal(EDIT_MODAL_CLOSED)

  const openDeleteModal = (category: AdminCategoryTree) =>
    setDeleteModal({ isOpen: true, category })

  const closeDeleteModal = () => setDeleteModal(DELETE_MODAL_CLOSED)

  const handleCreateSuccess = (newCat: AdminCategoryTree) =>
    setCategories((prev) =>
      newCat.parentId === null ? [...prev, newCat] : insertChild(prev, newCat)
    )

  const handleEditSuccess = (updated: AdminCategoryTree) =>
    setCategories((prev) => updateItem(prev, updated))

  const handleDeleteSuccess = (id: number) =>
    setCategories((prev) => removeItem(prev, id))

  return {
    categories,
    createModal,
    editModal,
    deleteModal,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
  }
}
