// build-admin-product-breadcrumbs.ts
import type { AdminProductItemSelect } from '@/types/admin-product-selects'

type Breadcrumb = Pick<
  AdminProductItemSelect['category'],
  'id' | 'slug' | 'name'
>

export function adminProductBreadcrumbs(
  category: AdminProductItemSelect['category']
): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = []

  for (
    let current: typeof category | null = category;
    current;
    current = current.parent ?? null
  ) {
    breadcrumbs.unshift({
      id: current.id,
      slug: current.slug,
      name: current.name,
    })
  }

  return breadcrumbs
}
