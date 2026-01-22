import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'admin_session';
const SESSION_TOKEN = 'arbafix_admin_authenticated';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page and login API
  if (
    pathname === '/admin/login' ||
    pathname === '/api/admin/login'
  ) {
    return NextResponse.next();
  }

  // Protect admin API routes (except login)
  if (pathname.startsWith('/api/admin/')) {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);

    if (sessionCookie?.value !== SESSION_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
