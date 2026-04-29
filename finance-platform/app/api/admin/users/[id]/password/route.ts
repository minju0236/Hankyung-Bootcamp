import { NextRequest } from 'next/server';
import { ResultSetHeader } from 'mysql2';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/session';
import { hashPassword } from '@/lib/password';
import { badRequest, forbidden, ok, unauthorized } from '@/lib/responses';

type ResetPasswordBody = {
  newPassword: string;
};

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();

  if (!admin) {
    return unauthorized();
  }

  if (admin.role !== 'admin') {
    return forbidden();
  }

  const { id } = await context.params;
  const targetUserId = Number(id);

  if (!targetUserId) {
    return badRequest('사용자 ID가 올바르지 않습니다.');
  }

  const body = (await request.json()) as ResetPasswordBody;

  if (!body.newPassword) {
    return badRequest('새 비밀번호는 필수입니다.');
  }

  if (body.newPassword.length < 4) {
    return badRequest('새 비밀번호는 4자 이상이어야 합니다.');
  }

  const passwordHash = await hashPassword(body.newPassword);

  await pool.query<ResultSetHeader>(
    `
    UPDATE users
    SET password_hash = ?
    WHERE id = ?
    `,
    [passwordHash, targetUserId]
  );

  return ok({
    message: '비밀번호가 재설정되었습니다.'
  });
}