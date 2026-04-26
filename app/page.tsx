import Container from '@/components/container/Container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Главная страница',
  description: 'Главная страница',
}

export default function Page() {
  return (
    <Container>
      <h1 className='text-2xl font-bold'>Главная страница</h1>
    </Container>
  )
}
