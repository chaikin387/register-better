import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const authRoutes = ['/login', '/register', '/forgot-password']

const protectedRoutes = ['/profile', '/admin-panel']

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (pathname === '/verify-email') {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (
    (pathname === '/admin-panel' || pathname.startsWith('/admin-panel/')) &&
    session?.user.role !== 'admin'
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (session && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/profile',
    '/admin-panel/:path*',
  ],
}
