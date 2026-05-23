import { CategoryView } from '@/components/catalog/CategoryView'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = {
  title: 'Каталог',
  description: 'Каталог',
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <CategoryView slug={slug} />
}
