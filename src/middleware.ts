import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has('session')
 
  if (request.nextUrl.pathname.startsWith('/login') && hasSession) {
    return NextResponse.redirect(new URL('/', request.url))
  }
 
  if (!hasSession && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
