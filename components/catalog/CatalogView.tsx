import { getCategoriesCatalog } from '@/services/category.service'
import { notFound } from 'next/navigation'
import { CatalogBreadcrumbs } from '../breadcrumbs/CatalogBreadcrumbs'
import { CategoryCard } from './CategoryCard'

export const CatalogView = async () => {
  const categories = await getCategoriesCatalog()

  if (!categories?.length) notFound()

  return (
    <section className='container mx-auto px-4 pt-2 pb-8'>
      <CatalogBreadcrumbs />

      <h1 className='mt-4 mb-6 text-2xl font-bold'>Каталог</h1>

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </section>
  )
}
