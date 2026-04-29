import { NextRequest } from 'next/server';
import { ResultSetHeader } from 'mysql2';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/session';
import { badRequest, created, ok, unauthorized } from '@/lib/responses';

type CreateAccountBody = {
  accountNumber: string;
  accountName: string;
  balance: number;
};

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const [rows] = await pool.query(
    `
    SELECT id, account_number, account_name, balance, status, created_at
    FROM accounts
    WHERE user_id = ?
    ORDER BY id DESC
    `,
    [user.userId]
  );

  return ok({ accounts: rows });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const body = (await request.json()) as CreateAccountBody;

  if (!body.accountNumber || !body.accountName) {
    return badRequest('계좌번호와 계좌명은 필수입니다.');
  }

  await pool.query<ResultSetHeader>(
    `
    INSERT INTO accounts (user_id, account_number, account_name, balance)
    VALUES (?, ?, ?, ?)
    `,
    [user.userId, body.accountNumber, body.accountName, Number(body.balance || 0)]
  );

  return created({
    message: '계좌가 등록되었습니다.'
  });
}