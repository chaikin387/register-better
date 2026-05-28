import Header from '@/components/header/Header'

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex flex-1 flex-col'>
      <Header />
      {children}
    </main>
  )
}
