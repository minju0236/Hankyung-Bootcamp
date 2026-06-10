
'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(form) });
      router.push('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : '회원가입 실패');
    }
  }

  return (
    <main className="auth-wrap">
      <section className="auth-visual">
        <div className="auth-copy">
          <div className="brand" style={{ paddingLeft: 0 }}>
            <div className="brand-mark">W</div>
            <div>
              <p className="brand-title">WMS Control Center</p>
              <p className="brand-subtitle">Access Management</p>
            </div>
          </div>
          <h1>업무 사용자를 등록하고 권한 기반으로 접근합니다.</h1>
          <p>회원가입 후 로그인 상태를 확인하고 계약, 입고, 재고, 출고 관리 화면으로 이동합니다.</p>
        </div>
      </section>
      <section className="auth-card-wrap">
        <div className="auth-card">
          <h2>회원가입</h2>
          <p>이름, 이메일, 비밀번호를 입력해 실습용 사용자를 등록합니다.</p>
          {error && <div className="error">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>이름</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="홍길동" />
            </div>
            <div className="field">
              <label>이메일</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="user@example.com" />
            </div>
            <div className="field">
              <label>비밀번호</label>
              <input name="password" value={form.password} onChange={handleChange} placeholder="비밀번호" type="password" />
            </div>
            <button className="button" type="submit">가입</button>
          </form>
          <div className="auth-links">
            <Link href="/login">로그인으로 이동</Link>
            <Link href="/">첫 화면으로 이동</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
