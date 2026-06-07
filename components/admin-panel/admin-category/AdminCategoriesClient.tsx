'use client'

import { FolderTree, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { AdminCategoryTreeSelect } from '@/types/admin-category-selects'

import { AdminCategoryProvider } from './AdminCategoryContext'
import { AdminCategoryDeleteDialog } from './AdminCategoryDeleteDialog'
import { AdminCategoryDialog } from './AdminCategoryDialog'
import { AdminCategoryTree } from './AdminCategoryTree'
import { useAdminCatalog } from './use-admin-catalog'

interface Props {
  initialCategories: AdminCategoryTreeSelect[]
}

export function AdminCategoriesClient({ initialCategories }: Props) {
  const {
    categories,
    createDialog,
    UpdateDialog,
    deleteDialog,
    openCreateDialog,
    openUpdateDialog,
    openDeleteDialog,
    closeCreateDialog,
    closeUpdateDialog,
    closeDeleteDialog,
    handleCreateSuccess,
    handleUpdateSuccess,
    handleDeleteSuccess,
  } = useAdminCatalog(initialCategories)

  return (
    <AdminCategoryProvider
      value={{ openCreateDialog, openUpdateDialog, openDeleteDialog }}
    >
      <div className='space-y-6 px-4 py-8'>
        <div className='flex items-center justify-between border-b pb-4'>
          <div>
            <h1 className='flex items-center gap-2 text-2xl font-bold tracking-tight'>
              <FolderTree className='size-6 text-muted-foreground' />
              Категории
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Управление структурой категорий (максимум 4 уровня)
            </p>
          </div>
          <Button onClick={() => openCreateDialog(null, 1)}>
            <Plus />
            Создать категорию L1
          </Button>
        </div>

        <div className='max-w-3xl rounded-xl border bg-card p-6'>
          {categories.length === 0 ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>
              Категорий пока нет. Создайте первую корневую категорию.
            </p>
          ) : (
            <div className='space-y-2'>
              {categories.map((category) => (
                <AdminCategoryTree
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          )}
        </div>

        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            <span className='size-2 rounded-full bg-green-500' />
            Активна
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='size-2 rounded-full bg-muted-foreground/40' />
            Неактивна
          </span>
        </div>
      </div>

      <AdminCategoryDialog
        isOpen={createDialog.isOpen}
        parentId={createDialog.parentId}
        level={createDialog.level}
        onClose={closeCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      {UpdateDialog.category && (
        <AdminCategoryDialog
          isOpen={UpdateDialog.isOpen}
          category={UpdateDialog.category}
          onClose={closeUpdateDialog}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {deleteDialog.category && (
        <AdminCategoryDeleteDialog
          isOpen={deleteDialog.isOpen}
          category={deleteDialog.category}
          onClose={closeDeleteDialog}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </AdminCategoryProvider>
  )
}
