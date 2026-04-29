import Link from 'next/link';
import { getSessionUser } from '@/lib/session';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardPage() {
  const user = await getSessionUser();

  return (
    <main className="page">
      <section className="card">
        <h1>금융 대시보드</h1>
        <p>{user?.email}님이 로그인했습니다.</p>

        <div className="buttonGroup">
          <Link href="/accounts">계좌 관리</Link>
          <Link href="/transactions">거래 내역</Link>
          <Link href="/admin/users">관리자 사용자 관리</Link>
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}