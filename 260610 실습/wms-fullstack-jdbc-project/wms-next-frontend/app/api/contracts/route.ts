import { NextRequest } from 'next/server';
import { proxyRequest } from '../_proxy';

export async function GET(request: NextRequest) {
  return proxyRequest(request, '/api/contracts', 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, '/api/contracts', 'POST');
}
