import { CategoryView } from '@/components/sheet-catalog/CategoryView'
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
  return (
    <section className='container mx-auto px-4 py-8'>
      <CategoryView slug={slug} />
    </section>
  )
}
