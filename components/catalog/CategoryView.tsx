import { getCategoryById } from '@/app/(shop)/_actions/category'
import { notFound } from 'next/navigation'
import { CategoryBreadcrumbs } from '../breadcrumbs/CategoryBreadcrumbs'
import { CategoryCard } from './CategoryCard'

interface Props {
  id: string
}

export const CategoryView = async ({ id }: Props) => {
  const category = await getCategoryById(id)

  if (!category) notFound()

  return (
    <section className='container mx-auto px-4 pt-2 pb-8'>
      <CategoryBreadcrumbs category={category} />

      <h1 className='mt-4 mb-6 text-2xl font-bold'>
        {category.name}
        <span className='ml-2 text-xl font-normal text-muted-foreground'>
          ({category.products.length})
        </span>
      </h1>

      {category.children.length > 0 ? (
        // 1. Если есть подкатегории — показываем их
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {category.children.map((child) => (
            <CategoryCard
              key={child.id}
              category={child}
            />
          ))}
        </div>
      ) : category.products.length > 0 ? (
        // 2. Если подкатегорий нет, но есть товары — выводим список товаров
        <div>
          {category.products.map((product) => (
            <div key={product.id}>{product.name}</div>
          ))}
        </div>
      ) : (
        // 3. Если нет ни подкатегорий, ни товаров — показываем заглушку
        <p className='text-muted-foreground'>Товар скоро появится</p>
      )}
    </section>
  )
}
