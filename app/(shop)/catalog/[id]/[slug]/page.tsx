import { CategoryView } from '@/components/catalog/CategoryView'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string; slug: string }>
}

export const metadata: Metadata = {
  title: 'Каталог',
  description: 'Каталог',
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <CategoryView id={id} />
}
