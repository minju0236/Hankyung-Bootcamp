import { getSessionUser } from '@/lib/session';
import { ok, unauthorized } from '@/lib/responses';

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  return ok({ user });
}