// import { type CategoryPage } from '@/types/category-selects'

// type Breadcrumb = {
//   slug: string
//   name: string
// }

// export function buildBreadcrumbs(category: CategoryPage): Breadcrumb[] {
//   const crumbs: Breadcrumb[] = []
//   let parent = category.parent

//   while (parent) {
//     crumbs.unshift({ slug: parent.slug, name: parent.name })
//     parent = parent.parent ?? null
//   }

//   return crumbs
// }

import { type CategoryPage } from '@/types/category-selects'

type Breadcrumb = {
  slug: string
  name: string
}

export function buildBreadcrumbs(category: CategoryPage): Breadcrumb[] {
  const crumbs: Breadcrumb[] = []

  for (let node = category.parent; node; node = node.parent) {
    crumbs.push({ slug: node.slug, name: node.name })
  }

  return crumbs.reverse()
}
