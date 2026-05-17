import { CatalogView } from '@/components/sheet-catalog/CatalogView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Каталог товаров',
  description: 'Каталог товаров',
}

export default function Page() {
  return (
    <section className='container mx-auto px-4 py-8'>
      <CatalogView />
    </section>
  )
}
