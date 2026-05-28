import { FolderTree, Users, type LucideIcon } from 'lucide-react'

export interface AdminMenuItem {
  title: string
  url: string
  icon: LucideIcon // ◄── Жестко привязываем к типу иконок Lucide
}

export interface AdminMenuGroup {
  label: string
  items: AdminMenuItem[]
}

export const adminMenuGroups: AdminMenuGroup[] = [
  {
    label: 'Управление',
    items: [
      {
        title: 'Пользователи',
        url: '/admin-panel/users',
        icon: Users,
      },
      {
        title: 'Каталог товаров',
        url: '/admin-panel/admin-catalog',
        icon: FolderTree,
      },
    ],
  },
]
