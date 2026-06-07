'use client'

import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  FolderPlus,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { swapCategoryOrder } from '@/app/(admin)/_actions/categories/swap-category-order'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { AdminCategoryTreeSelect } from '@/types/admin-category-selects'

import { useAdminCategoryContext } from './AdminCategoryContext'

interface Props {
  category: AdminCategoryTreeSelect
  prev?: AdminCategoryTreeSelect
  next?: AdminCategoryTreeSelect
  level?: number
}

export function AdminCategoryTree({ category, prev, next, level = 1 }: Props) {
  const {
    openCreateDialog,
    openUpdateDialog,
    openDeleteDialog,
    handleSwapSuccess,
  } = useAdminCategoryContext()

  const [isExpanded, setIsExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()

  const children = category.children ?? []
  const hasChildren = children.length > 0
  const canCreateChild = level < 4

  function swap(sibling: AdminCategoryTreeSelect) {
    startTransition(async () => {
      // Оптимистичный апдейт интерфейса (меняем местами локально)
      handleSwapSuccess(category.id, sibling.id)

      const result = await swapCategoryOrder(
        category.id,
        category.sortOrder,
        sibling.id,
        sibling.sortOrder
      )

      if (!result.success) {
        // Откат изменений назад в случае ошибки на сервере
        handleSwapSuccess(category.id, sibling.id)
        toast.error(result.error)
      }
    })
  }

  return (
    <div className='flex flex-col gap-1.5'>
      <div
        data-level={level}
        className={cn(
          'flex items-center justify-between rounded-lg border bg-background p-2 transition-colors hover:bg-accent/40',
          'data-[level="2"]:pl-6',
          'data-[level="3"]:pl-10',
          'data-[level="4"]:pl-14',
          !category.isActive && 'bg-muted/20 opacity-60'
        )}
      >
        <div className='flex min-w-0 items-center gap-3'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            disabled={!hasChildren}
            onClick={() => setIsExpanded((prev) => !prev)}
            className={cn(
              'size-7 shrink-0 text-muted-foreground transition-transform disabled:opacity-0',
              isExpanded && 'rotate-90'
            )}
          >
            <ChevronRight className='size-4' />
          </Button>

          <div className='flex min-w-0 flex-col'>
            <span className='truncate text-sm font-medium tracking-tight'>
              {category.name}
            </span>
            <span className='truncate font-mono text-[10px] text-muted-foreground'>
              /{category.slug}
            </span>
          </div>

          <span className='shrink-0 rounded bg-secondary p-1 text-xs text-muted-foreground select-none'>
            L{level}
          </span>

          <span
            className={cn(
              'size-2 shrink-0 rounded-full',
              category.isActive ? 'bg-green-500' : 'bg-muted-foreground/40'
            )}
          />
        </div>

        <div className='ml-4 flex shrink-0 items-center gap-0.5'>
          {/* Сортировка: Вверх */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                disabled={!prev || isPending}
                onClick={() => prev && swap(prev)}
                className='size-8 text-muted-foreground hover:text-foreground disabled:opacity-30'
              >
                <ArrowUp className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Переместить вверх</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                disabled={!next || isPending}
                onClick={() => next && swap(next)}
                className='size-8 text-muted-foreground hover:text-foreground disabled:opacity-30'
              >
                <ArrowDown className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Переместить вниз</TooltipContent>
          </Tooltip>

          {/* Действие: Добавить подкатегорию */}
          {canCreateChild && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => openCreateDialog(category.id, level + 1)}
                  className='size-8 text-muted-foreground hover:text-foreground'
                >
                  <FolderPlus className='size-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Добавить подкатегорию</TooltipContent>
            </Tooltip>
          )}

          {/* Действие: Редактировать */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => openUpdateDialog(category)}
                className='size-8 text-muted-foreground hover:text-foreground'
              >
                <Pencil className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Редактировать</TooltipContent>
          </Tooltip>

          {/* Действие: Удалить */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => openDeleteDialog(category)}
                className='size-8 text-muted-foreground hover:text-destructive'
              >
                <Trash2 className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Удалить категорию</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Рекурсивный рендер вложенных уровней (L2-L4) */}
      {hasChildren && isExpanded && (
        <>
          {children.map((child, i) => (
            <AdminCategoryTree
              key={child.id}
              category={child}
              level={level + 1}
              prev={children[i - 1]}
              next={children[i + 1]}
            />
          ))}
        </>
      )}
    </div>
  )
}
