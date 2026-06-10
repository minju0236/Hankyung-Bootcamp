import { NextRequest } from 'next/server';
import { proxyRequest } from '../_proxy';

export async function GET(request: NextRequest) {
  return proxyRequest(request, '/api/outbounds', 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, '/api/outbounds', 'POST');
}
