import Header from '@/components/header/Header'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { Geist, Geist_Mono } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'sonner'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='ru'
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        geist.variable
      )}
    >
      <body className='flex min-h-dvh flex-col'>
        <ThemeProvider>
          <NextTopLoader showSpinner={false} />
          <Header />
          <main className='flex flex-1'>{children}</main>
          <Toaster
            position='top-center'
            richColors
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
