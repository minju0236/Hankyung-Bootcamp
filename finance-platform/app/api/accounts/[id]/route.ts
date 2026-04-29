import { NextRequest } from 'next/server';
import { ResultSetHeader } from 'mysql2';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/session';
import { badRequest, ok, unauthorized } from '@/lib/responses';

type UpdateAccountBody = {
  accountName: string;
  status: 'active' | 'closed';
};

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const { id } = await context.params;
  const body = (await request.json()) as UpdateAccountBody;

  if (!body.accountName || !body.status) {
    return badRequest('계좌명과 상태는 필수입니다.');
  }

  await pool.query<ResultSetHeader>(
    `
    UPDATE accounts
    SET account_name = ?, status = ?
    WHERE id = ? AND user_id = ?
    `,
    [body.accountName, body.status, id, user.userId]
  );

  return ok({
    message: '계좌가 수정되었습니다.'
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const { id } = await context.params;

  await pool.query<ResultSetHeader>(
    `
    DELETE FROM accounts
    WHERE id = ? AND user_id = ?
    `,
    [id, user.userId]
  );

  return ok({
    message: '계좌가 삭제되었습니다.'
  });
}