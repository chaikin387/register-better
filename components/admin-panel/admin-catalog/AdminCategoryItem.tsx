'use client'

import { ChevronRight, FolderPlus, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { type AdminCategoryTree } from '@/types/admin-category-selects'
import { useAdminCatalogContext } from './AdminCatalogContext'

interface Props {
  category: AdminCategoryTree
  level?: number
}

export function AdminCategoryItem({ category, level = 1 }: Props) {
  const { openCreateModal, openEditModal, openDeleteModal } =
    useAdminCatalogContext()
  const [isExpanded, setIsExpanded] = useState(false)

  const hasChildren = !!(category.children && category.children.length > 0)
  const canCreateChild = level < 4

  return (
    <div className='flex flex-col gap-1.5'>
      {/* Строка категории */}
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
          {/* Стрелочка раскрытия */}
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

          {/* Название и слаг категории */}
          <div className='flex min-w-0 flex-col'>
            <span className='truncate text-sm font-medium tracking-tight'>
              {category.name}
            </span>
            <span className='truncate font-mono text-[10px] text-muted-foreground'>
              /{category.slug}
            </span>
          </div>

          {/* Метка текущего уровня */}
          <span className='shrink-0 rounded bg-secondary p-1 text-xs text-muted-foreground select-none'>
            L{level}
          </span>
        </div>

        {/* Действия над категорией */}
        <div className='ml-4 flex shrink-0 items-center gap-0.5'>
          {/* Добавить подкатегорию */}
          {canCreateChild && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => openCreateModal(category.id, level + 1)}
                  className='size-8 text-muted-foreground hover:text-foreground'
                >
                  <FolderPlus className='size-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Добавить подкатегорию</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Редактировать */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => openEditModal(category.id)}
                className='size-8 text-muted-foreground hover:text-foreground'
              >
                <Pencil className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Редактировать</p>
            </TooltipContent>
          </Tooltip>

          {/* Удалить */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => openDeleteModal(category)}
                className='size-8 text-muted-foreground hover:text-destructive'
              >
                <Trash2 className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Удалить категорию</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Рендер вложенных детей (Рекурсия) */}
      {hasChildren && isExpanded && (
        <>
          {category.children?.map((child) => (
            <AdminCategoryItem
              key={child.id}
              category={child}
              level={level + 1}
            />
          ))}
        </>
      )}
    </div>
  )
}
