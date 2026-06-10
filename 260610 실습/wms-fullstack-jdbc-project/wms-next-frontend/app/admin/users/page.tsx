
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { ApiResponse, User } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  async function loadUsers() {
    try {
      const response = await apiFetch<ApiResponse<User[]>>('/api/admin/users');
      setUsers(response.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '사용자 목록 조회 실패');
    }
  }

  useEffect(() => { loadUsers(); }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">W</div>
          <div>
            <p className="brand-title">WMS Control</p>
            <p className="brand-subtitle">Admin Console</p>
          </div>
        </div>
        <div className="side-section-title">관리 메뉴</div>
        <nav className="side-nav">
          <Link className="side-link" href="/dashboard">대시보드</Link>
          <Link className="side-link" href="/contracts">계약 관리</Link>
          <Link className="side-link" href="/inbounds">입고 관리</Link>
          <Link className="side-link" href="/inventories">재고 관리</Link>
          <Link className="side-link" href="/outbounds">출고 관리</Link>
          <Link className="side-link" href="/notices">공지사항</Link>
          <Link className="side-link" href="/inquiries">문의 관리</Link>
          <Link className="side-link primary" href="/admin/users">관리자 사용자</Link>
        </nav>
        <div className="side-footer">
          <strong>ADMIN 전용</strong>
          <span>사용자 목록은 관리자 권한으로만 조회할 수 있습니다.</span>
        </div>
      </aside>
      <main className="main-area">
        <div className="container">
          <div className="toolbar">
            <div>
              <div className="breadcrumb">WMS / ADMIN</div>
              <h1>관리자 사용자 관리</h1>
              <p>등록된 사용자, 권한, 상태 정보를 조회합니다. 비밀번호 해시 값은 화면에 표시하지 않습니다.</p>
            </div>
            <Link className="button secondary" href="/dashboard">대시보드</Link>
          </div>
          {error && <div className="error">{error}</div>}
          <section className="section-grid">
            <div className="stat-card"><p className="stat-label">전체 사용자</p><p className="stat-value">{users.length}</p><p className="stat-help">users 테이블 기준</p></div>
            <div className="stat-card"><p className="stat-label">관리자</p><p className="stat-value">{users.filter((u) => u.role === 'ADMIN').length}</p><p className="stat-help">ADMIN 권한 사용자</p></div>
            <div className="stat-card"><p className="stat-label">일반 사용자</p><p className="stat-value">{users.filter((u) => u.role === 'USER').length}</p><p className="stat-help">USER 권한 사용자</p></div>
            <div className="stat-card"><p className="stat-label">활성 상태</p><p className="stat-value">{users.filter((u) => u.status !== 'INACTIVE').length}</p><p className="stat-help">사용 가능 계정</p></div>
          </section>
          <section className="card table-card">
            <div className="table-header">
              <h2 className="table-title">사용자 목록</h2>
              <span className="table-count">{users.length}명</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>ID</th><th>이메일</th><th>이름</th><th>권한</th><th>상태</th></tr></thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.name}</td>
                      <td><span className={`status ${String(user.role).toLowerCase()}`}>{user.role}</span></td>
                      <td><span className={`status ${String(user.status ?? '').toLowerCase()}`}>{user.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
