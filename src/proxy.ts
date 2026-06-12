import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export default async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  let session = null;

  if (sessionCookie) {
    try {
      session = await decrypt(sessionCookie);
    } catch (e) {
      session = null;
    }
  }

  const { pathname } = request.nextUrl;

  // Protect /audit
  if (pathname.startsWith('/audit')) {
    if (!session) return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!session || session.user.role !== 'SUPERVISOR') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect root based on role
  if (pathname === '/') {
    if (!session) return NextResponse.redirect(new URL('/login', request.url));
    if (session.user.role === 'SUPERVISOR') return NextResponse.redirect(new URL('/dashboard', request.url));
    return NextResponse.redirect(new URL('/audit', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/audit/:path*', '/dashboard/:path*'],
};
