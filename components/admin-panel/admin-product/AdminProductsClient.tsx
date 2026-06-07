'use client'

import { ChevronRight, Pencil, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { AdminProductItemSelect } from '@/types/admin-product-selects'

import { AdminProductDeleteDialog } from './AdminProductDeleteDialog'
import { useAdminProducts } from './use-admin-products'

interface Props {
  initialProducts: AdminProductItemSelect[]
}

export function AdminProductsClient({ initialProducts }: Props) {
  const {
    products,
    deleteDialog,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteSuccess,
  } = useAdminProducts(initialProducts)

  return (
    <>
      <div className='space-y-6 px-4 py-8'>
        {/* Шапка */}
        <div className='flex items-center justify-between border-b pb-4'>
          <div>
            <h1 className='flex items-center gap-2 text-2xl font-bold tracking-tight'>
              <ShoppingBag className='size-6 text-muted-foreground' />
              Товары
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Управление ассортиментом, ценами и модификациями (SKU)
            </p>
          </div>
          <Button asChild>
            <Link href='/admin-panel/products/create'>
              <Plus />
              Добавить товар
            </Link>
          </Button>
        </div>

        {/* Список */}
        <div className='rounded-xl border bg-card p-6'>
          {products.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 text-center'>
              <ShoppingBag className='mb-4 size-10 text-muted-foreground opacity-20' />
              <p className='text-sm text-muted-foreground'>Товаров пока нет.</p>
            </div>
          ) : (
            <div className='space-y-2'>
              {products.map((product) => {
                const mainSku = product.variants?.[0]?.sku ?? 'Нет SKU'

                return (
                  <div
                    key={product.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border bg-background p-3 transition-colors hover:bg-accent/40',
                      !product.isActive && 'bg-muted/20 opacity-60'
                    )}
                  >
                    {/* Левая часть */}
                    <div className='flex min-w-0 flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <span className='truncate text-sm font-medium tracking-tight'>
                          {product.name}
                        </span>

                        <Badge
                          variant='secondary'
                          className='px-1.5 py-0 font-mono text-[11px] font-normal tracking-wider select-all'
                        >
                          {mainSku}
                        </Badge>

                        <span
                          className={cn(
                            'size-2 shrink-0 rounded-full',
                            product.isActive
                              ? 'bg-green-500'
                              : 'bg-muted-foreground/40'
                          )}
                        />
                      </div>

                      <div className='flex items-center gap-1 text-[11px] text-muted-foreground/90'>
                        <span className='truncate'>
                          {product.category.name}
                        </span>
                        {product.brand && (
                          <>
                            <ChevronRight className='size-3.5 shrink-0 opacity-50' />
                            <span className='truncate'>
                              {product.brand.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Правая часть: Действия */}
                    <div className='ml-4 flex shrink-0 items-center gap-0.5'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            asChild
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='size-8 text-muted-foreground hover:text-foreground'
                          >
                            <Link
                              href={`/admin-panel/products/${product.id}/update`}
                            >
                              <Pencil className='size-4' />
                            </Link>
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
                            onClick={() => openDeleteDialog(product)}
                            className='size-8 text-muted-foreground hover:text-destructive'
                          >
                            <Trash2 className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Удалить товар</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Легенда */}
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

      {/* Диалог удаления */}
      {deleteDialog.product && (
        <AdminProductDeleteDialog
          isOpen={deleteDialog.isOpen}
          product={deleteDialog.product}
          onClose={closeDeleteDialog}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}
