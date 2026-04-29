import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieName = process.env.TOKEN_COOKIE_NAME || 'token';
  const token = request.cookies.get(cookieName)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const user = await verifyToken(token);

    if (pathname.startsWith('/admin') && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/accounts/:path*', '/admin/:path*']
};