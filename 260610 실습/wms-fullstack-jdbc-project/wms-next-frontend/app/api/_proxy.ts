import { NextRequest, NextResponse } from 'next/server';

const SPRING_API_BASE_URL = process.env.SPRING_API_BASE_URL || 'http://localhost:3200';

export async function proxyRequest(request: NextRequest, path: string, method: string) {
  const token = request.cookies.get('token')?.value;
  const hasBody = !['GET', 'DELETE'].includes(method);
  const body = hasBody ? await request.text() : undefined;
  const response = await fetch(`${SPRING_API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });
  const text = await response.text();
  return new NextResponse(text, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
  });
}
