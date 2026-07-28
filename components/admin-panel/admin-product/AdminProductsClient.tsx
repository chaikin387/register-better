'use client'

import {
  ChevronRight,
  PackagePlus,
  Pencil,
  Plus,
  Scale,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

import { deleteProductVariant } from '@/app/(admin)/_actions/admin-product-varinant/delete-product-variant'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { AdminProductItemSelect } from '@/types/admin-product-selects'
import { formatPrice } from '@/utils/format-price'
import { formatWeight } from '@/utils/format-weight'

import { AdminProductCategoryAttributeDialog } from './AdminProductCategoryAttributeDialog'
import { AdminProductDeleteDialog } from './AdminProductDeleteDialog'
import { AdminProductVariantDialog } from './AdminProductVariantDialog'
import { adminProductBreadcrumbs } from './admin-product-breadcrumbs'
import { useAdminProducts } from './use-admin-products'

interface Props {
  initialProducts: AdminProductItemSelect[]
}

export function AdminProductsClient({ initialProducts: products }: Props) {
  const {
    deleteProduct,
    attributesDialog,
    variantDialog,
    setDeleteProduct,
    setAttributesDialog,
    setVariantDialog,
    openAttributesDialog,
    openVariantDialog,
  } = useAdminProducts()

  async function handleDeleteVariant(variantId: string) {
    const result = await deleteProductVariant(variantId)
    if (!result.success) toast.error(result.error)
  }

  return (
    <section className='space-y-6 px-4 py-8'>
      <div className='flex items-end justify-between border-b pb-4'>
        <div className='flex flex-col gap-1'>
          <h1 className='flex items-center gap-2 text-2xl font-bold'>
            <ShoppingBag className='size-6 text-muted-foreground' />
            Товары
          </h1>
          <p className='text-sm text-muted-foreground'>Управление товарами</p>
        </div>
        <Button asChild>
          <Link href='/admin-panel/products/create'>
            <Plus />
            Добавить товар
          </Link>
        </Button>
      </div>

      <div className='rounded-xl border bg-card p-6'>
        {!products.length ? (
          <div className='flex flex-col items-center py-10 text-center'>
            <ShoppingBag className='mb-4 size-10 text-muted-foreground/20' />
            <p className='text-sm text-muted-foreground'>Товаров пока нет.</p>
          </div>
        ) : (
          <div className='space-y-2'>
            {products.map((product) => {
              const attributeCount = product._count.attributes
              const hasMultipleVariants = product.variants.length > 1
              const firstVariant = product.variants[0]

              return (
                <Collapsible
                  key={product.id}
                  disabled={!hasMultipleVariants}
                >
                  <div
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 transition-colors hover:bg-accent/40',
                      !product.isActive && 'opacity-60'
                    )}
                  >
                    <div className='flex flex-1 items-center gap-3'>
                      {hasMultipleVariants ? (
                        <CollapsibleTrigger className='group'>
                          <ChevronRight className='size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90' />
                        </CollapsibleTrigger>
                      ) : (
                        <div className='size-4' />
                      )}

                      <div className='flex flex-col gap-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <span className='truncate text-sm font-medium'>
                            {product.name}
                          </span>
                          {firstVariant && (
                            <Badge variant='secondary'>
                              Арт: {firstVariant.sku}
                            </Badge>
                          )}
                          {product.brand && (
                            <Badge className='bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'>
                              {product.brand.name}
                            </Badge>
                          )}
                          <span
                            className={cn(
                              'size-2 rounded-full',
                              product.isActive
                                ? 'bg-green-500'
                                : 'bg-muted-foreground/40'
                            )}
                          />
                        </div>
                        <div className='flex items-center gap-1 text-[11px] text-muted-foreground'>
                          {adminProductBreadcrumbs(product.category).map(
                            (category, index) => (
                              <React.Fragment key={category.id}>
                                {index > 0 && (
                                  <ChevronRight className='size-3 opacity-40' />
                                )}
                                <span>{category.name}</span>
                              </React.Fragment>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flex shrink-0 items-center gap-4'>
                      {!hasMultipleVariants && firstVariant && (
                        <>
                          <div className='flex flex-col items-end'>
                            <span className='font-medium'>
                              {formatPrice(firstVariant.price)}
                            </span>
                            <div className='flex items-center gap-1'>
                              <Scale className='size-3 opacity-60' />
                              <span className='text-xs text-muted-foreground'>
                                {formatWeight(firstVariant.weight)}
                              </span>
                            </div>
                          </div>
                          <Separator
                            orientation='vertical'
                            className='h-8'
                          />
                        </>
                      )}

                      <div className='flex items-center gap-0.5'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon-lg'
                              onClick={() => openAttributesDialog(product)}
                              className='relative text-muted-foreground hover:text-foreground'
                            >
                              <SlidersHorizontal className='size-4' />
                              {attributeCount > 0 && (
                                <span className='absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] leading-none text-primary-foreground'>
                                  {attributeCount}
                                </span>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Характеристики
                            {attributeCount > 0 ? ` (${attributeCount})` : ''}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon-lg'
                              onClick={() => openVariantDialog(product)}
                              className='text-muted-foreground hover:text-foreground'
                            >
                              <PackagePlus className='size-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Добавить вариант</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type='button'
                              asChild
                              size='icon-lg'
                              variant='ghost'
                              className='text-muted-foreground hover:text-foreground'
                            >
                              <Link
                                href={`/admin-panel/products/${product.id}/${product.slug}/update`}
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
                              size='icon-lg'
                              variant='ghost'
                              onClick={() => setDeleteProduct(product)}
                              className='text-muted-foreground hover:text-destructive'
                            >
                              <Trash2 className='size-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Удалить товар</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <CollapsibleContent className='mt-1.5 ml-7 space-y-1.5'>
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className='flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2'
                      >
                        <div className='flex flex-col gap-1'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <span className='font-mono text-xs text-muted-foreground'>
                              {variant.sku}
                            </span>
                            {variant.attributes.map((a) => (
                              <Badge
                                key={a.attributeValueId}
                                variant='secondary'
                              >
                                {a.attributeValue.value}
                              </Badge>
                            ))}
                          </div>
                          <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                            <span>{formatPrice(variant.price)}</span>
                            <Separator
                              orientation='vertical'
                              className='h-3'
                            />
                            <Scale className='size-3 opacity-60' />
                            <span>{formatWeight(variant.weight)}</span>
                            <Separator
                              orientation='vertical'
                              className='h-3'
                            />
                            <span>Остаток: {variant.stock}</span>
                          </div>
                        </div>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon-lg'
                              onClick={() => handleDeleteVariant(variant.id)}
                              className='text-muted-foreground hover:text-destructive'
                            >
                              <Trash2 className='size-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Удалить вариант</TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        )}
      </div>

      <div className='flex gap-4 text-xs text-muted-foreground'>
        <span className='flex items-center gap-1.5'>
          <span className='size-2 rounded-full bg-green-500' />
          Активен
        </span>
        <span className='flex items-center gap-1.5'>
          <span className='size-2 rounded-full bg-muted-foreground/40' />
          Неактивен
        </span>
      </div>

      {deleteProduct && (
        <AdminProductDeleteDialog
          isOpen
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
        />
      )}

      {attributesDialog && (
        <AdminProductCategoryAttributeDialog
          isOpen
          product={attributesDialog.product}
          categoryAttributes={attributesDialog.categoryAttributes}
          onClose={() => setAttributesDialog(null)}
        />
      )}

      {variantDialog && (
        <AdminProductVariantDialog
          isOpen
          product={variantDialog.product}
          categoryAttributes={variantDialog.categoryAttributes}
          onClose={() => setVariantDialog(null)}
        />
      )}
    </section>
  )
}
