import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Главная страница',
  description: 'Главная страница',
}

const items = Array.from({ length: 60 }, (_, i) => i + 1)

export default function Page() {
  return (
    <section className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-2xl font-bold'>Главная страница</h1>

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {items.map((item) => (
          <div
            key={item}
            className='flex aspect-square items-center justify-center rounded-xl border bg-muted/30 text-lg font-medium'
          >
            Card {item}
          </div>
        ))}
      </div>
    </section>
  )
}
