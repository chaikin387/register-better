import { getCategoryBySlug } from '@/services/category.service'
import { notFound } from 'next/navigation'
import { CategoryBreadcrumbs } from '../breadcrumbs/CategoryBreadcrumbs'
import { CategoryCard } from './CategoryCard'

interface Props {
  slug: string
}

export const CategoryView = async ({ slug }: Props) => {
  const category = await getCategoryBySlug(slug)

  if (!category) notFound()

  return (
    <>
      <CategoryBreadcrumbs category={category} />

      <h1 className='mt-4 mb-6 text-2xl font-bold'>{category.name}</h1>

      {category.children.length > 0 ? (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {category.children.map((child) => (
            <CategoryCard
              key={child.id}
              category={child}
            />
          ))}
        </div>
      ) : (
        <p className='text-muted-foreground'>Товары появятся здесь</p>
      )}
    </>
  )
}
