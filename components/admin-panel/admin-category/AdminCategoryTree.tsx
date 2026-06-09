'use client'

import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  FolderPlus,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

import { swapCategoryOrder } from '@/app/(admin)/_actions/categories/swap-category-order'
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
    handleSwapSuccess,
  } = useAdminCategoryContext()
  const [isPending, startTransition] = useTransition()

  const children = category.children ?? []
  const hasChildren = children.length > 0

  function swap(sibling: AdminCategoryTreeSelect) {
    startTransition(async () => {
      handleSwapSuccess(category.id, sibling.id)
      const result = await swapCategoryOrder(
        category.id,
        category.sortOrder,
        sibling.id,
        sibling.sortOrder
      )
      if (!result.success) {
        handleSwapSuccess(category.id, sibling.id)
        toast.error(result.error)
      }
    })
  }

  return (
    <Collapsible disabled={!hasChildren}>
      <div className='flex items-center gap-3 rounded-lg border bg-background p-2 hover:bg-accent/40'>
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

        {/* Компактная панель действий (все кнопки в 1 строку) */}
        <div className='flex shrink-0 items-center gap-0.5'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon-lg'
                variant='ghost'
                disabled={!prev || isPending}
                onClick={() => prev && swap(prev)}
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
                size='icon-lg'
                variant='ghost'
                disabled={!next || isPending}
                onClick={() => next && swap(next)}
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
                size='icon-lg'
                variant='ghost'
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
                size='icon-lg'
                variant='ghost'
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
                size='icon-lg'
                variant='ghost'
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

      <CollapsibleContent className='mt-1.5 ml-4 space-y-1.5'>
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
