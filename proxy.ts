import { getSessionCookie } from 'better-auth/cookies'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const session = getSessionCookie(request, { cookiePrefix: 'register-better' })

  if (request.nextUrl.pathname === '/verify-email') {
    const email = request.nextUrl.searchParams.get('email')
    if (!email) return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!session && request.nextUrl.pathname === '/profile') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (
    session &&
    ['/login', '/register', '/forgot-password'].includes(
      request.nextUrl.pathname
    )
  ) {
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
  ],
}
