import { CatalogView } from '@/components/catalog/CatalogView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Каталог товаров',
  description: 'Каталог товаров',
}

export default function Page() {
  return <CatalogView />
}
