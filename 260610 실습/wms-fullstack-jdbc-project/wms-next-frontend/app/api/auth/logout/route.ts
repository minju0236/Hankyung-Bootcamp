import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true, message: '로그아웃되었습니다.', data: null });
  response.cookies.set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
