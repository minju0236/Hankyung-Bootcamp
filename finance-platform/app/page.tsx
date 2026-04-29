import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page">
      <section className="card">
        <h1>Next Finance CRUD</h1>
        <p>Next.js App Router 기반 금융 계좌 관리 시스템입니다.</p>

        <div className="buttonGroup">
          <Link href="/signup">회원가입</Link>
          <Link href="/login">로그인</Link>
        </div>
      </section>
    </main>
  );
}