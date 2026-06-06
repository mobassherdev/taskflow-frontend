import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));

  // Access token is stored in localStorage (client-only), so we use a
  // cookie as a presence signal set by the client after login
  const hasSession = request.cookies.has('tf_session');

  if (!isPublic && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublic && hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
