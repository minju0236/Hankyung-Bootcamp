
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import type { ApiResponse, User } from '@/lib/types';

const modules = [
  { href: '/contracts', kicker: 'CONTRACT', title: '계약 관리', desc: '고객 계약 요청과 보관 조건을 등록하고 조회합니다.' },
  { href: '/inbounds', kicker: 'INBOUND', title: '입고 관리', desc: '계약 기반 입고 데이터를 등록하고 상태를 확인합니다.' },
  { href: '/inventories', kicker: 'STOCK', title: '재고 관리', desc: '창고별 현재 재고와 안전재고 기준을 관리합니다.' },
  { href: '/outbounds', kicker: 'OUTBOUND', title: '출고 관리', desc: '출고 요청, 수량, 수령처, 처리 상태를 관리합니다.' },
  { href: '/notices', kicker: 'NOTICE', title: '공지사항', desc: '운영 공지와 시스템 안내를 등록하고 확인합니다.' },
  { href: '/inquiries', kicker: 'SUPPORT', title: '문의 관리', desc: '고객 문의와 처리 상태를 관리합니다.' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  async function loadCurrentUser() {
    try {
      const response = await apiFetch<ApiResponse<User>>('/api/auth/me');
      setUser(response.data);
    } catch {
      router.push('/login');
    }
  }

  async function handleLogout() {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  useEffect(() => { loadCurrentUser(); }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">W</div>
          <div>
            <p className="brand-title">WMS Control</p>
            <p className="brand-subtitle">Operations Console</p>
          </div>
        </div>
        <div className="side-section-title">업무 메뉴</div>
        <nav className="side-nav">
          <Link className="side-link primary" href="/dashboard">대시보드</Link>
          {modules.map((item) => <Link className="side-link" href={item.href} key={item.href}>{item.title}</Link>)}
          <Link className="side-link admin" href="/admin/users">관리자 사용자</Link>
        </nav>
        <div className="side-footer">
          <strong>{user ? `${user.name}님` : '로그인 확인 중'}</strong>
          <span>{user ? `권한 ${user.role}` : '세션 정보를 확인하고 있습니다.'}</span>
        </div>
      </aside>
      <main className="main-area">
        <div className="container">
          <div className="topbar">
            <div>
              <div className="breadcrumb">WMS / Dashboard</div>
              <h1 className="page-title">창고 운영 대시보드</h1>
              <p className="page-description">계약, 입고, 재고, 출고 업무를 하나의 흐름으로 연결하고 현재 로그인 사용자 권한에 따라 접근 범위를 제어합니다.</p>
            </div>
            <button className="button danger" onClick={handleLogout}>로그아웃</button>
          </div>
          <section className="section-grid">
            <div className="stat-card">
              <p className="stat-label">운영 메뉴</p>
              <p className="stat-value">6</p>
              <p className="stat-help">WMS 핵심 업무 화면</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">API 서버</p>
              <p className="stat-value">3200</p>
              <p className="stat-help">Spring Boot 내부 호출</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">외부 접속</p>
              <p className="stat-value">3100</p>
              <p className="stat-help">Next.js 단일 진입점</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">사용자 권한</p>
              <p className="stat-value">{user?.role || '-'}</p>
              <p className="stat-help">USER 또는 ADMIN</p>
            </div>
          </section>
          <section className="dashboard-grid">
            <div className="card pad">
              <div className="toolbar">
                <div>
                  <h1>업무 모듈</h1>
                  <p>창고 운영의 주요 흐름을 선택합니다.</p>
                </div>
              </div>
              <div className="module-grid">
                {modules.map((item) => (
                  <Link className="module-card" href={item.href} key={item.href}>
                    <div className="module-kicker">{item.kicker}</div>
                    <div className="module-title">{item.title}</div>
                    <p className="module-desc">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
            <div className="card pad">
              <div className="toolbar">
                <div>
                  <h1>운영 구조</h1>
                  <p>브라우저 요청은 Next.js API Route를 거쳐 Spring Boot로 전달됩니다.</p>
                </div>
              </div>
              <div className="pipeline">
                <div className="pipeline-row"><span className="pipeline-port">3100</span><div><p className="pipeline-name">Next.js</p><p className="pipeline-desc">화면과 API Route 처리</p></div></div>
                <div className="pipeline-row"><span className="pipeline-port">3200</span><div><p className="pipeline-name">Spring Boot</p><p className="pipeline-desc">인증과 WMS 업무 API</p></div></div>
                <div className="pipeline-row"><span className="pipeline-port">3306</span><div><p className="pipeline-name">MariaDB</p><p className="pipeline-desc">운영 데이터 저장</p></div></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
