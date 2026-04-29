import { NextRequest } from 'next/server';
import { ResultSetHeader } from 'mysql2';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/session';
import { badRequest, forbidden, ok, unauthorized } from '@/lib/responses';

type UpdateUserBody = {
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
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

  const body = (await request.json()) as UpdateUserBody;

  if (!body.role || !body.status) {
    return badRequest('권한과 상태는 필수입니다.');
  }

  if (!['user', 'admin'].includes(body.role)) {
    return badRequest('권한 값이 올바르지 않습니다.');
  }

  if (!['active', 'inactive'].includes(body.status)) {
    return badRequest('상태 값이 올바르지 않습니다.');
  }

  await pool.query<ResultSetHeader>(
    `
    UPDATE users
    SET role = ?, status = ?
    WHERE id = ?
    `,
    [body.role, body.status, targetUserId]
  );

  return ok({
    message: '사용자 권한 및 상태가 변경되었습니다.'
  });
}

export async function DELETE(
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

  if (targetUserId === admin.userId) {
    return badRequest('현재 로그인한 관리자 본인은 삭제할 수 없습니다.');
  }

  await pool.query<ResultSetHeader>(
    `
    DELETE FROM users
    WHERE id = ?
    `,
    [targetUserId]
  );

  return ok({
    message: '사용자가 삭제되었습니다.'
  });
}