'use client'

import { Pencil, Plus, Tag, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { AdminBrandSelectItem } from '@/types/admin-brand.selects'

import { AdminBrandCreateDialog } from './AdminBrandCreateDialog'
import { AdminBrandDeleteDialog } from './AdminBrandDeleteDialog'
import { AdminBrandUpdateDialog } from './AdminBrandUpdateDialog'
import { useAdminBrands } from './use-admin-brands'

interface Props {
  initialBrands: AdminBrandSelectItem[]
}

export function AdminBrandsClient({ initialBrands }: Props) {
  const {
    brands,
    createDialog,
    updateDialog,
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
  } = useAdminBrands(initialBrands)

  return (
    <>
      <div className='space-y-6 px-4 py-8'>
        <div className='flex items-center justify-between border-b pb-4'>
          <div>
            <h1 className='flex items-center gap-2 text-2xl font-bold tracking-tight'>
              <Tag className='size-6 text-muted-foreground' />
              Бренды
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Управление брендами товаров
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus />
            Добавить бренд
          </Button>
        </div>

        <div className='max-w-3xl rounded-xl border bg-card p-6'>
          {brands.length === 0 ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>
              Брендов пока нет. Добавьте первый.
            </p>
          ) : (
            <div className='space-y-2'>
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className={cn(
                    'flex items-center justify-between rounded-lg border bg-background p-2 transition-colors hover:bg-accent/40',
                    !brand.isActive && 'bg-muted/20 opacity-60'
                  )}
                >
                  <div className='flex min-w-0 items-center gap-3'>
                    <div className='flex min-w-0 flex-col'>
                      <span className='truncate text-sm font-medium'>
                        {brand.name}
                      </span>
                      <span className='truncate font-mono text-[10px] text-muted-foreground'>
                        /{brand.slug}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'size-2 shrink-0 rounded-full',
                        brand.isActive
                          ? 'bg-green-500'
                          : 'bg-muted-foreground/40'
                      )}
                    />
                  </div>

                  <div className='ml-4 flex shrink-0 items-center gap-0.5'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => openUpdateDialog(brand)}
                          className='size-8 text-muted-foreground hover:text-foreground'
                        >
                          <Pencil className='size-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Редактировать</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => openDeleteDialog(brand)}
                          className='size-8 text-muted-foreground hover:text-destructive'
                        >
                          <Trash2 className='size-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Удалить бренд</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            <span className='size-2 rounded-full bg-green-500' />
            Активен
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='size-2 rounded-full bg-muted-foreground/40' />
            Неактивен
          </span>
        </div>
      </div>

      <AdminBrandCreateDialog
        isOpen={createDialog.isOpen}
        onClose={closeCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      {updateDialog.brand && (
        <AdminBrandUpdateDialog
          isOpen={updateDialog.isOpen}
          brand={updateDialog.brand}
          onClose={closeUpdateDialog}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {deleteDialog.brand && (
        <AdminBrandDeleteDialog
          isOpen={deleteDialog.isOpen}
          brand={deleteDialog.brand}
          onClose={closeDeleteDialog}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}
