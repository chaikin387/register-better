'use client'

import { Plus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminProductItemSelect } from '@/types/admin-product-selects'
import { formatPrice } from '@/utils/format-price'

interface Props {
  initialProducts: AdminProductItemSelect[]
}

function getProductStats(variants: AdminProductItemSelect['variants']) {
  if (!variants || variants.length === 0) {
    return { totalStock: 0, priceRange: 'Нет цены' }
  }

  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
  const prices = variants.map((v) => Number(v.price))
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  const priceRange =
    minPrice === maxPrice
      ? formatPrice(minPrice)
      : `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`

  return { totalStock, priceRange }
}

export function AdminProductsClient({ initialProducts }: Props) {
  return (
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

      {/* Таблица / пустое состояние */}
      <div className='rounded-xl border bg-card p-6'>
        {initialProducts.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <ShoppingBag className='mb-4 size-10 text-muted-foreground opacity-20' />
            <p className='text-sm text-muted-foreground'>Товаров пока нет.</p>
            <p className='mt-1 text-xs text-muted-foreground/70'>
              Создайте свой первый товар, чтобы он появился на витрине.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse text-left text-sm'>
              <thead>
                <tr className='border-b bg-secondary/20 font-medium text-muted-foreground'>
                  <th className='p-4'>Название товара</th>
                  <th className='p-4'>Категория</th>
                  <th className='p-4'>Диапазон цен</th>
                  <th className='p-4'>Остаток</th>
                  <th className='p-4'>Статус</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {initialProducts.map((product) => {
                  const { totalStock, priceRange } = getProductStats(
                    product.variants
                  )

                  return (
                    <tr
                      key={product.id}
                      className='transition-colors hover:bg-secondary/5'
                    >
                      <td className='p-4 font-medium'>
                        <div className='flex flex-col'>
                          <span>{product.name}</span>
                          {product.brand && (
                            <span className='text-xs font-normal text-muted-foreground'>
                              {product.brand.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='p-4 text-muted-foreground'>
                        {product.category.name}
                      </td>
                      <td className='p-4 font-mono font-medium text-foreground'>
                        {priceRange}
                      </td>
                      <td className='p-4 font-mono'>
                        {totalStock > 0 ? (
                          <span className='text-foreground'>
                            {totalStock} шт.
                          </span>
                        ) : (
                          <span className='font-medium text-destructive'>
                            Нет в наличии
                          </span>
                        )}
                      </td>
                      <td className='p-4'>
                        <Badge
                          variant={product.isActive ? 'default' : 'secondary'}
                        >
                          {product.isActive ? 'Активен' : 'Черновик'}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
