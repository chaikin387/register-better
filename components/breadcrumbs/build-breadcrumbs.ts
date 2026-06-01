import type { CategoryPageSelect } from '@/types/category-selects'

type Breadcrumb = Pick<CategoryPageSelect, 'slug' | 'name'>

export function buildBreadcrumbs({ parent }: CategoryPageSelect): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = []

  for (let current = parent; current; current = current.parent) {
    breadcrumbs.push({ slug: current.slug, name: current.name })
  }

  return breadcrumbs.reverse()
}
