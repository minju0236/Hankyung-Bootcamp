import { NextRequest, NextResponse } from 'next/server';

const SPRING_API_BASE_URL = process.env.SPRING_API_BASE_URL || 'http://localhost:3200';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const springResponse = await fetch(`${SPRING_API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const json = await springResponse.json();
  const response = NextResponse.json(json, { status: springResponse.status });
  const token = json?.data?.token;
  if (springResponse.ok && token) {
    response.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 60 * 60,
    });
  }
  return response;
}
