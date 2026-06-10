"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-minimal">
      <section className="landing-minimal-hero">
        <div className="landing-badge">WMS Fullstack Platform</div>

        <h1>
          창고 운영을 더 단순하게,
          <br />
          업무 흐름은 더 명확하게
        </h1>

        <p>
          계약, 입고, 재고, 출고 관리를 하나의 흐름으로 연결하는
          웹 기반 WMS 업무 관리 시스템입니다.
        </p>

        <div className="landing-minimal-actions">
          <Link href="/login" className="primary-action">
            로그인
          </Link>
          <Link href="/signup" className="secondary-action">
            회원가입
          </Link>
        </div>
      </section>

      <section className="landing-minimal-info">
        <div>
          <strong>Contract</strong>
          <span>계약 등록과 상태 관리</span>
        </div>
        <div>
          <strong>Inventory</strong>
          <span>입고·재고·출고 흐름 관리</span>
        </div>
        <div>
          <strong>Admin</strong>
          <span>사용자와 운영 데이터 관리</span>
        </div>
      </section>
    </main>
  );
}