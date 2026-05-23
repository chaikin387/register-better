import { type CategoryPage } from '@/types/category-selects'

type Breadcrumb = {
  slug: string
  name: string
}

export function buildBreadcrumbs(category: CategoryPage): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = []

  let current = category.parent

  while (current) {
    breadcrumbs.push({
      slug: current.slug,
      name: current.name,
    })

    current = current.parent
  }

  return breadcrumbs.reverse()
}
