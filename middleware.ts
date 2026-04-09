import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const PUBLIC_ROUTES = ['/', '/sign-in', '/sign-up', '/api/auth/sign-in', '/api/auth/sign-up']
const AUTH_ROUTES = ['/sign-in', '/sign-up']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('ss_session')?.value

  // Allow public API routes (webhooks, etc.)
  if (pathname.startsWith('/api/webhooks')) {
    return NextResponse.next()
  }

  // Check session validity
  let session = null
  if (token) {
    session = await verifyToken(token)
  }

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname === r)
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!session && !isPublicRoute && !pathname.startsWith('/api/auth')) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
