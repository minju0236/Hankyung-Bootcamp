import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import pool from '@/lib/db';
import { signToken } from '@/lib/jwt';
import { comparePassword } from '@/lib/password';
import { badRequest, unauthorized } from '@/lib/responses';

type UserRow = RowDataPacket & {
  id: number;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
};

type LoginBody = {
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LoginBody;

  if (!body.email || !body.password) {
    return badRequest('이메일과 비밀번호는 필수입니다.');
  }

  const [rows] = await pool.query<UserRow[]>(
    `
    SELECT id, email, password_hash, role, status
    FROM users
    WHERE email = ?
    `,
    [body.email]
  );

  const user = rows[0];

  if (!user) {
    return unauthorized('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  if (user.status !== 'active') {
    return unauthorized('비활성화된 사용자입니다.');
  }

  const isValid = await comparePassword(body.password, user.password_hash);

  if (!isValid) {
    return unauthorized('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const response = NextResponse.json({
    message: '로그인 성공',
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });

  response.cookies.set(process.env.TOKEN_COOKIE_NAME || 'token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60
  });

  return response;
}