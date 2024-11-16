import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/'

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || ''

  // Redirect to login if accessing protected route without token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to admin dashboard if accessing login page with valid token
  if (isPublicPath && token && path !== '/') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should be protected
export const config = {
  matcher: [
    '/',
    '/login',
    '/admin/:path*',
    '/meetings/:path*',
  ]
}
