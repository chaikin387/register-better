'use client'

import { type AdminCategoryTree } from '@/types/admin-category-selects'
import { createContext, ReactNode, useContext } from 'react'

interface AdminCatalogContextType {
  openCreateModal: (parentId: number | null, parentLevel: number) => void
  openEditModal: (categoryId: number) => void
  openDeleteModal: (category: AdminCategoryTree) => void
}

const AdminCatalogContext = createContext<AdminCatalogContextType | null>(null)

export function AdminCatalogProvider({
  children,
  value,
}: {
  children: ReactNode
  value: AdminCatalogContextType
}) {
  return (
    <AdminCatalogContext.Provider value={value}>
      {children}
    </AdminCatalogContext.Provider>
  )
}

export function useAdminCatalogContext() {
  const context = useContext(AdminCatalogContext)

  if (!context) {
    throw new Error(
      'Ошибка: Хук useAdminCatalogContext можно использовать только внутри компонента <AdminCatalogProvider />!'
    )
  }

  return context
}
