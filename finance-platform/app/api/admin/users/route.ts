import pool from '@/lib/db';
import { getSessionUser } from '@/lib/session';
import { forbidden, ok, unauthorized } from '@/lib/responses';

export async function GET() {
  const admin = await getSessionUser();

  if (!admin) return unauthorized();
  if (admin.role !== 'admin') return forbidden();

  const [rows] = await pool.query(`
    SELECT id, name, email, role, status, created_at
    FROM users
  `);

  return ok({
    users: rows
  });
}