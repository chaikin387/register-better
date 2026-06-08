import type { CategoryPageSelect } from '@/types/category-selects'

type Breadcrumb = Pick<CategoryPageSelect, 'id' | 'slug' | 'name'>

export function buildBreadcrumbs({ parent }: CategoryPageSelect): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = []

  for (let current = parent; current; current = current.parent) {
    breadcrumbs.unshift({
      id: current.id,
      slug: current.slug,
      name: current.name,
    })
  }

  return breadcrumbs
}
