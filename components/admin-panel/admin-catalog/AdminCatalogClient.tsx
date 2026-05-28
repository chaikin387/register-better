'use client'

import { FolderTree, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type AdminCategoryTree } from '@/types/admin-category-selects'
import { AdminCatalogProvider } from './AdminCatalogContext'
import { AdminCategoryCreateModal } from './AdminCategoryCreateModal'
import { AdminCategoryDeleteModal } from './AdminCategoryDeleteModal'
import { AdminCategoryEditModal } from './AdminCategoryEditModal'
import { AdminCategoryItem } from './AdminCategoryItem'
import { useAdminCatalog } from './use-admin-catalog'

interface AdminCatalogClientProps {
  initialCategories: AdminCategoryTree[]
}

export function AdminCatalogClient({
  initialCategories,
}: AdminCatalogClientProps) {
  const {
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
  } = useAdminCatalog(initialCategories)

  return (
    <AdminCatalogProvider
      value={{ openCreateModal, openEditModal, openDeleteModal }}
    >
      <div className='space-y-6 px-4 py-8'>
        {/* Шапка каталога */}
        <div className='flex items-center justify-between border-b pb-4'>
          <div>
            <h1 className='flex items-center gap-2 text-2xl font-bold tracking-tight'>
              <FolderTree className='size-6 text-muted-foreground' />
              Каталог товаров
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Управление структурой категорий (максимум 4 уровня)
            </p>
          </div>
          <Button onClick={() => openCreateModal(null, 1)}>
            <Plus />
            Корневая категория
          </Button>
        </div>

        {/* Дерево категорий */}
        <div className='max-w-3xl rounded-xl border bg-card p-6'>
          {categories.length === 0 ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>
              Категорий пока нет. Создайте первую корневую цену.
            </p>
          ) : (
            <div className='space-y-2'>
              {categories.map((category) => (
                <AdminCategoryItem
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Модалка создания */}
      <AdminCategoryCreateModal
        isOpen={createModal.isOpen}
        parentId={createModal.parentId}
        level={createModal.level}
        onClose={closeCreateModal}
        onSuccess={handleCreateSuccess}
      />

      {/* Модалка редактирования */}
      {editModal.category && (
        <AdminCategoryEditModal
          isOpen={editModal.isOpen}
          category={editModal.category}
          onClose={closeEditModal}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Модалка удаления */}
      {deleteModal.category && (
        <AdminCategoryDeleteModal
          isOpen={deleteModal.isOpen}
          category={deleteModal.category}
          onClose={closeDeleteModal}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </AdminCatalogProvider>
  )
}
