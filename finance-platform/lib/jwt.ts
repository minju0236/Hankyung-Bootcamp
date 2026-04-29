import { jwtVerify, SignJWT } from 'jose';

export type AppRole = 'user' | 'admin';

export type AppJwtPayload = {
  userId: number;
  email: string;
  role: AppRole;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET 환경 변수가 없습니다.');
  }

  return new TextEncoder().encode(secret);
}

export async function signToken(payload: AppJwtPayload) {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<AppJwtPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());

  return {
    userId: Number(payload.userId),
    email: String(payload.email),
    role: payload.role as AppRole
  };
}