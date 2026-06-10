'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/lib/types';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>({itemName: '', quantity: '', outboundStatus: '', receiverName: '', outboundDate: ''});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadItems() {
    try {
      const response = await apiFetch<ApiResponse<any[]>>('/api/outbounds');
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
      await apiFetch('/api/outbounds', { method: 'POST', body: JSON.stringify(form) });
      setMessage('등록되었습니다.');
      setForm({itemName: '', quantity: '', outboundStatus: '', receiverName: '', outboundDate: ''});
      await loadItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : '등록 실패');
    }
  }

  async function handleDelete(id: number) {
    await apiFetch(`/api/outbounds/${id}`, { method: 'DELETE' });
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
            <p className="brand-subtitle">OUTBOUND Module</p>
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
          <strong>출고 관리</strong>
          <span>등록, 조회, 삭제 흐름을 API와 연결합니다.</span>
        </div>
      </aside>
      <main className="main-area">
        <div className="container">
          <div className="toolbar">
            <div>
              <div className="breadcrumb">WMS / OUTBOUND</div>
              <h1>출고 관리</h1>
              <p>출고 요청, 수량, 수령처, 출고 상태를 관리합니다.</p>
            </div>
            <Link className="button secondary" href="/dashboard">대시보드</Link>
          </div>
          {message && <div className="notice">{message}</div>}
          {error && <div className="error">{error}</div>}
          <section className="card form-card">
            <h2 className="form-title">신규 데이터 등록</h2>
            <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label>물품명</label>
              <input name="itemName" value={form.itemName} onChange={handleChange} placeholder="유압 밸브" />
            </div>
            <div className="field">
              <label>수량</label>
              <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="15" />
            </div>
            <div className="field">
              <label>상태</label>
              <input name="outboundStatus" value={form.outboundStatus} onChange={handleChange} placeholder="REQUESTED" />
            </div>
            <div className="field">
              <label>수령처</label>
              <input name="receiverName" value={form.receiverName} onChange={handleChange} placeholder="부산 현장" />
            </div>
            <div className="field">
              <label>출고일</label>
              <input name="outboundDate" value={form.outboundDate} onChange={handleChange} placeholder="2026-06-06" />
            </div>
              <div className="form-actions">
                <button className="button" type="submit">등록</button>
              </div>
            </form>
          </section>
          <section className="card table-card">
            <div className="table-header">
              <h2 className="table-title">출고 관리 목록</h2>
              <span className="table-count">{items.length}건</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>물품명</th><th>수량</th><th>상태</th><th>수령처</th><th>출고일</th><th>처리</th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}><td>{String(item.itemName ?? '')}</td><td>{String(item.quantity ?? '')}</td><td><span className={`status ${String(item.outboundStatus ?? "").toLowerCase()}`}>{String(item.outboundStatus ?? '')}</span></td><td>{String(item.receiverName ?? '')}</td><td>{String(item.outboundDate ?? '')}</td><td><button className="button danger" onClick={() => handleDelete(item.id)}>삭제</button></td></tr>
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
