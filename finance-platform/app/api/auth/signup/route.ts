import { NextRequest } from 'next/server';
import { ResultSetHeader } from 'mysql2';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { badRequest, created } from '@/lib/responses';

type SignupBody = {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as SignupBody;

  if (!body.name || !body.email || !body.password) {
    return badRequest('이름, 이메일, 비밀번호는 필수입니다.');
  }

  const passwordHash = await hashPassword(body.password);
  const role = body.role === 'admin' ? 'admin' : 'user';

  await pool.query<ResultSetHeader>(
    `
    INSERT INTO users (name, email, password_hash, role)
    VALUES (?, ?, ?, ?)
    `,
    [body.name, body.email, passwordHash, role]
  );

  return created({
    message: '회원가입이 완료되었습니다.'
  });
}