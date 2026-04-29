import { NextRequest } from 'next/server';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/session';
import { badRequest, created, ok, unauthorized } from '@/lib/responses';

type AccountRow = RowDataPacket & {
  id: number;
  balance: string;
};

type TransactionBody = {
  accountId: number;
  transactionType: 'deposit' | 'withdraw';
  amount: number;
  memo?: string;
};

type CountRow = RowDataPacket & {
  totalCount: number;
};

export async function GET(request: NextRequest) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const type = searchParams.get('type') || '';
  const accountId = searchParams.get('accountId') || '';
  const keyword = searchParams.get('keyword') || '';
  const minAmount = searchParams.get('minAmount') || '';
  const maxAmount = searchParams.get('maxAmount') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 10;
  const offset = (safePage - 1) * safeLimit;

  const whereConditions: string[] = ['t.user_id = ?'];
  const whereValues: unknown[] = [user.userId];

  if (type === 'deposit' || type === 'withdraw') {
    whereConditions.push('t.transaction_type = ?');
    whereValues.push(type);
  }

  if (accountId) {
    whereConditions.push('t.account_id = ?');
    whereValues.push(Number(accountId));
  }

  if (keyword) {
    whereConditions.push('t.memo LIKE ?');
    whereValues.push(`%${keyword}%`);
  }

  if (minAmount) {
    whereConditions.push('t.amount >= ?');
    whereValues.push(Number(minAmount));
  }

  if (maxAmount) {
    whereConditions.push('t.amount <= ?');
    whereValues.push(Number(maxAmount));
  }

  if (startDate) {
    whereConditions.push('DATE(t.created_at) >= ?');
    whereValues.push(startDate);
  }

  if (endDate) {
    whereConditions.push('DATE(t.created_at) <= ?');
    whereValues.push(endDate);
  }

  const whereSql = whereConditions.join(' AND ');

  const [countRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT COUNT(*) AS totalCount
    FROM account_transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE ${whereSql}
    `,
    whereValues
  );

  const totalCount = Number(countRows[0].totalCount);
  const totalPages = Math.ceil(totalCount / safeLimit);

  const [rows] = await pool.query(
    `
    SELECT
      t.id,
      t.account_id,
      a.account_name,
      t.transaction_type,
      t.amount,
      t.memo,
      t.created_at
    FROM account_transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE ${whereSql}
    ORDER BY t.id DESC
    LIMIT ? OFFSET ?
    `,
    [...whereValues, safeLimit, offset]
  );

  return ok({
    transactions: rows,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalCount,
      totalPages
    },
    filters: {
      type,
      accountId,
      keyword,
      minAmount,
      maxAmount,
      startDate,
      endDate
    }
  });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const body = (await request.json()) as TransactionBody;

  if (!body.accountId || !body.transactionType || !body.amount) {
    return badRequest('계좌, 거래 유형, 금액은 필수입니다.');
  }

  if (body.transactionType !== 'deposit' && body.transactionType !== 'withdraw') {
    return badRequest('거래 유형이 올바르지 않습니다.');
  }

  if (body.amount <= 0) {
    return badRequest('거래 금액은 0보다 커야 합니다.');
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [accountRows] = await connection.query<AccountRow[]>(
      `
      SELECT id, balance
      FROM accounts
      WHERE id = ? AND user_id = ? AND status = 'active'
      FOR UPDATE
      `,
      [body.accountId, user.userId]
    );

    const account = accountRows[0];

    if (!account) {
      await connection.rollback();
      return badRequest('사용 가능한 계좌가 없습니다.');
    }

    const currentBalance = Number(account.balance);

    if (body.transactionType === 'withdraw' && currentBalance < body.amount) {
      await connection.rollback();
      return badRequest('잔액이 부족합니다.');
    }

    const nextBalance =
      body.transactionType === 'deposit'
        ? currentBalance + body.amount
        : currentBalance - body.amount;

    await connection.query<ResultSetHeader>(
      `
      UPDATE accounts
      SET balance = ?
      WHERE id = ? AND user_id = ?
      `,
      [nextBalance, body.accountId, user.userId]
    );

    await connection.query<ResultSetHeader>(
      `
      INSERT INTO account_transactions
        (account_id, user_id, transaction_type, amount, memo)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        body.accountId,
        user.userId,
        body.transactionType,
        body.amount,
        body.memo || null
      ]
    );

    await connection.commit();

    return created({
      message: '거래가 등록되었습니다.',
      balance: nextBalance
    });
  } catch {
    await connection.rollback();

    return badRequest('거래 처리 중 오류가 발생했습니다.');
  } finally {
    connection.release();
  }
}