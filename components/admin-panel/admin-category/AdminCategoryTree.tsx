'use client'

import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  FolderPlus,
  Pencil,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

import { swapCategoryOrder } from '@/app/(admin)/_actions/admin-category/swap-category-order'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
    openAttributesDialog,
  } = useAdminCategoryContext()

  const children = category.children ?? []
  const hasChildren = children.length > 0
  const attributeCount = category._count.categoryAttributes

  async function handleSwap(
    current: AdminCategoryTreeSelect,
    sibling: AdminCategoryTreeSelect
  ) {
    const result = await swapCategoryOrder(
      current.id,
      current.sortOrder,
      sibling.id,
      sibling.sortOrder
    )

    if (!result.success) {
      toast.error(result.error)
    }
  }

  return (
    <Collapsible disabled={!hasChildren}>
      <div
        className={cn(
          'flex items-center justify-between gap-3 rounded-lg border bg-background p-2 transition-colors hover:bg-accent/40',
          !category.isActive && 'opacity-60'
        )}
      >
        <CollapsibleTrigger
          disabled={!hasChildren}
          className='group flex flex-1 items-center gap-3'
        >
          <ChevronRight
            className={cn(
              'size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-90',
              !hasChildren && 'opacity-0'
            )}
          />

          <div className='flex min-w-0 flex-col'>
            <span className='truncate text-sm font-medium tracking-tight'>
              {category.name}
            </span>
            <span className='text-[10px] text-muted-foreground'>
              /{category.slug}
            </span>
          </div>

          <span className='rounded-sm bg-accent/40 p-1 text-xs text-muted-foreground'>
            L{level}
          </span>

          <span
            className={cn(
              'size-2 shrink-0 rounded-full',
              category.isActive ? 'bg-green-500' : 'bg-muted-foreground/40'
            )}
          />
        </CollapsibleTrigger>

        <div className='flex shrink-0 items-center gap-0.5'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon-lg'
                disabled={!prev}
                onClick={() => prev && handleSwap(category, prev)}
                className='text-muted-foreground hover:text-foreground disabled:opacity-30'
              >
                <ArrowUp className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Переместить вверх</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon-lg'
                disabled={!next}
                onClick={() => next && handleSwap(category, next)}
                className='text-muted-foreground hover:text-foreground disabled:opacity-30'
              >
                <ArrowDown className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Переместить вниз</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon-lg'
                disabled={level >= 4}
                onClick={() => openCreateDialog(category.id, level + 1)}
                className='text-muted-foreground hover:text-foreground disabled:opacity-30'
              >
                <FolderPlus className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Добавить подкатегорию</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon-lg'
                onClick={() => openAttributesDialog(category)}
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
              Атрибуты{attributeCount > 0 ? ` (${attributeCount})` : ''}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon-lg'
                onClick={() => openUpdateDialog(category)}
                className='text-muted-foreground hover:text-foreground'
              >
                <Pencil className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Редактировать</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon-lg'
                onClick={() => openDeleteDialog(category)}
                className='text-muted-foreground hover:text-destructive'
              >
                <Trash2 className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Удалить категорию</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <CollapsibleContent className='mt-1.5 ml-7 space-y-1.5'>
        {children.map((child, i) => (
          <AdminCategoryTree
            key={child.id}
            category={child}
            prev={children[i - 1]}
            next={children[i + 1]}
            level={level + 1}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
