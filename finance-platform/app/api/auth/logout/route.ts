import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    message: '로그아웃되었습니다.'
  });

  response.cookies.set(process.env.TOKEN_COOKIE_NAME || 'token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });

  return response;
}