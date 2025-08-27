import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Assume a user is not authenticated if there is no session cookie
  // In a real app, you'd verify a token here.
  const hasSession = request.cookies.has('session')
 
  if (request.nextUrl.pathname.startsWith('/login') && hasSession) {
    // Redirect logged-in users from the login page to the dashboard
    return NextResponse.redirect(new URL('/', request.url))
  }
 
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!hasSession) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
  }

  // For now, let's treat the root as the dashboard for authenticated users
  if (request.nextUrl.pathname === '/' && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (request.nextUrl.pathname === '/' && hasSession) {
    return NextResponse.rewrite(new URL('/dashboard', request.url))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
}
