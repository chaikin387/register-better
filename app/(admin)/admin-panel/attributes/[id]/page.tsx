import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getAdminAttributeValues } from '@/app/(admin)/_actions/admin-attribute-value/get-attribute-values'
import { getAdminAttributeById } from '@/app/(admin)/_actions/admin-attribute/get-attribute-by-id'
import { AdminAttributeValuesClient } from '@/components/admin-panel/admin-attribute-value/AdminAttributeValuesClient'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const attribute = await getAdminAttributeById(id)

  return {
    title: attribute
      ? `${attribute.name} | Атрибуты`
      : 'Атрибут | Админ-панель',
  }
}

export default async function AttributeValuesPage({ params }: Props) {
  const { id } = await params

  const [attribute, initialValues] = await Promise.all([
    getAdminAttributeById(id),
    getAdminAttributeValues(id),
  ])

  if (!attribute) notFound()

  return (
    <AdminAttributeValuesClient
      attribute={attribute}
      initialValues={initialValues}
    />
  )
}
