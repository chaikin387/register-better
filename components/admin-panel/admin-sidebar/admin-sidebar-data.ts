import {
  FolderTree,
  ShoppingBag,
  Tag,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface AdminMenuItem {
  title: string
  url: string
  icon: LucideIcon
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
        title: 'Категории',
        url: '/admin-panel/categories',
        icon: FolderTree,
      },
      {
        title: 'Бренды',
        url: '/admin-panel/brands',
        icon: Tag,
      },
      {
        title: 'Товары',
        url: '/admin-panel/products',
        icon: ShoppingBag,
      },
    ],
  },
]
