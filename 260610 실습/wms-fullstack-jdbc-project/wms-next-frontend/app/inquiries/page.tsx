'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/lib/types';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>({title: '', content: '', status: ''});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadItems() {
    try {
      const response = await apiFetch<ApiResponse<any[]>>('/api/inquiries');
      setItems(response.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '목록 조회 실패');
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await apiFetch('/api/inquiries', { method: 'POST', body: JSON.stringify(form) });
      setMessage('등록되었습니다.');
      setForm({title: '', content: '', status: ''});
      await loadItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : '등록 실패');
    }
  }

  async function handleDelete(id: number) {
    await apiFetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    await loadItems();
  }

  useEffect(() => { loadItems(); }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">W</div>
          <div>
            <p className="brand-title">WMS Control</p>
            <p className="brand-subtitle">SUPPORT Module</p>
          </div>
        </div>
        <div className="side-section-title">업무 메뉴</div>
        <nav className="side-nav">
          <Link className="side-link" href="/dashboard">대시보드</Link>
          <Link className="side-link" href="/contracts">계약 관리</Link>
          <Link className="side-link" href="/inbounds">입고 관리</Link>
          <Link className="side-link" href="/inventories">재고 관리</Link>
          <Link className="side-link" href="/outbounds">출고 관리</Link>
          <Link className="side-link" href="/notices">공지사항</Link>
          <Link className="side-link" href="/inquiries">문의 관리</Link>
          <Link className="side-link admin" href="/admin/users">관리자 사용자</Link>
        </nav>
        <div className="side-footer">
          <strong>문의 관리</strong>
          <span>등록, 조회, 삭제 흐름을 API와 연결합니다.</span>
        </div>
      </aside>
      <main className="main-area">
        <div className="container">
          <div className="toolbar">
            <div>
              <div className="breadcrumb">WMS / SUPPORT</div>
              <h1>문의 관리</h1>
              <p>고객 문의 내용과 처리 상태를 조회하고 등록합니다.</p>
            </div>
            <Link className="button secondary" href="/dashboard">대시보드</Link>
          </div>
          {message && <div className="notice">{message}</div>}
          {error && <div className="error">{error}</div>}
          <section className="card form-card">
            <h2 className="form-title">신규 데이터 등록</h2>
            <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label>제목</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="출고 일정 문의" />
            </div>
            <div className="field">
              <label>내용</label>
              <input name="content" value={form.content} onChange={handleChange} placeholder="A창고 출고 가능 일정을 확인 부탁드립니다." />
            </div>
            <div className="field">
              <label>상태</label>
              <input name="status" value={form.status} onChange={handleChange} placeholder="PENDING" />
            </div>
              <div className="form-actions">
                <button className="button" type="submit">등록</button>
              </div>
            </form>
          </section>
          <section className="card table-card">
            <div className="table-header">
              <h2 className="table-title">문의 관리 목록</h2>
              <span className="table-count">{items.length}건</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>제목</th><th>내용</th><th>상태</th><th>처리</th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}><td>{String(item.title ?? '')}</td><td>{String(item.content ?? '')}</td><td><span className={`status ${String(item.status ?? "").toLowerCase()}`}>{String(item.status ?? '')}</span></td><td><button className="button danger" onClick={() => handleDelete(item.id)}>삭제</button></td></tr>
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
