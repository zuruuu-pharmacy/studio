import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has('session')
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup') || request.nextUrl.pathname.startsWith('/forgot-password');
 
  if (isAuthPage) {
    // If the user is on an auth page and has a session, redirect to home
    if (hasSession) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Otherwise, let them view the auth page
    return NextResponse.next()
  }
 
  // For all other pages, if the user is not authenticated, redirect to login
  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
