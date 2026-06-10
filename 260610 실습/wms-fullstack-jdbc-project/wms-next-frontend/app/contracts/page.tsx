'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/lib/types';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>({customerName: '', itemName: '', quantity: '', warehouseName: '', contractStatus: '', requestNote: ''});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadItems() {
    try {
      const response = await apiFetch<ApiResponse<any[]>>('/api/contracts');
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
      await apiFetch('/api/contracts', { method: 'POST', body: JSON.stringify(form) });
      setMessage('등록되었습니다.');
      setForm({customerName: '', itemName: '', quantity: '', warehouseName: '', contractStatus: '', requestNote: ''});
      await loadItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : '등록 실패');
    }
  }

  async function handleDelete(id: number) {
    await apiFetch(`/api/contracts/${id}`, { method: 'DELETE' });
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
            <p className="brand-subtitle">CONTRACT Module</p>
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
          <strong>계약 관리</strong>
          <span>등록, 조회, 삭제 흐름을 API와 연결합니다.</span>
        </div>
      </aside>
      <main className="main-area">
        <div className="container">
          <div className="toolbar">
            <div>
              <div className="breadcrumb">WMS / CONTRACT</div>
              <h1>계약 관리</h1>
              <p>고객 계약 요청과 보관 조건을 등록하고 조회합니다.</p>
            </div>
            <Link className="button secondary" href="/dashboard">대시보드</Link>
          </div>
          {message && <div className="notice">{message}</div>}
          {error && <div className="error">{error}</div>}
          <section className="card form-card">
            <h2 className="form-title">신규 데이터 등록</h2>
            <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label>고객명</label>
              <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="삼성중공업" />
            </div>
            <div className="field">
              <label>물품명</label>
              <input name="itemName" value={form.itemName} onChange={handleChange} placeholder="유압 밸브" />
            </div>
            <div className="field">
              <label>수량</label>
              <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="30" />
            </div>
            <div className="field">
              <label>창고명</label>
              <input name="warehouseName" value={form.warehouseName} onChange={handleChange} placeholder="A창고" />
            </div>
            <div className="field">
              <label>상태</label>
              <input name="contractStatus" value={form.contractStatus} onChange={handleChange} placeholder="REQUESTED" />
            </div>
            <div className="field">
              <label>요청사항</label>
              <input name="requestNote" value={form.requestNote} onChange={handleChange} placeholder="입고 전 외관 검사" />
            </div>
              <div className="form-actions">
                <button className="button" type="submit">등록</button>
              </div>
            </form>
          </section>
          <section className="card table-card">
            <div className="table-header">
              <h2 className="table-title">계약 관리 목록</h2>
              <span className="table-count">{items.length}건</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>고객명</th><th>물품명</th><th>수량</th><th>창고</th><th>상태</th><th>요청사항</th><th>처리</th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}><td>{String(item.customerName ?? '')}</td><td>{String(item.itemName ?? '')}</td><td>{String(item.quantity ?? '')}</td><td>{String(item.warehouseName ?? '')}</td><td><span className={`status ${String(item.contractStatus ?? "").toLowerCase()}`}>{String(item.contractStatus ?? '')}</span></td><td>{String(item.requestNote ?? '')}</td><td><button className="button danger" onClick={() => handleDelete(item.id)}>삭제</button></td></tr>
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
