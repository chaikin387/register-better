'use client'

import type { AdminCategoryTreeSelect } from '@/types/admin-category-selects'
import { createContext, ReactNode, useContext } from 'react'

interface Props {
  openCreateDialog: (parentId: string | null, parentLevel: number) => void
  openUpdateDialog: (category: AdminCategoryTreeSelect) => void
  openDeleteDialog: (category: AdminCategoryTreeSelect) => void
}

const AdminCategoryContext = createContext<Props | null>(null)

export function AdminCategoryProvider({
  children,
  value,
}: {
  children: ReactNode
  value: Props
}) {
  return (
    <AdminCategoryContext.Provider value={value}>
      {children}
    </AdminCategoryContext.Provider>
  )
}

export function useAdminCategoryContext() {
  const context = useContext(AdminCategoryContext)

  if (!context) {
    throw new Error(
      'Ошибка: Хук useAdminCategoryContext можно использовать только внутри компонента <AdminCategoryProvider />!'
    )
  }

  return context
}
