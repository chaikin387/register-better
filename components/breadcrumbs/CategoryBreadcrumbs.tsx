import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { type CategoryPage } from '@/types/category-selects'

import Link from 'next/link'
import { Fragment } from 'react'
import { buildBreadcrumbs } from './build-breadcrumbs'

interface Props {
  category: CategoryPage
}

export const CategoryBreadcrumbs = ({ category }: Props) => {
  const breadcrumbs = buildBreadcrumbs(category)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/'>Главная</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/catalog'>Каталог</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map((crumb) => (
          <Fragment key={crumb.slug}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/catalog/${crumb.slug}`}>{crumb.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}

        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{category.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
