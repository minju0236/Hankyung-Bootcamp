import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export async function getSessionUser() {
  const cookieStore = await cookies();
  const cookieName = process.env.TOKEN_COOKIE_NAME || 'token';
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}