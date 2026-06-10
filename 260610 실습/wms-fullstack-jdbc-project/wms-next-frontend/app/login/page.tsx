
'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: 'admin@test.com', password: '1234' });
  const [error, setError] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(form) });
      router.push('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : '로그인 실패');
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
              <p className="brand-subtitle">Warehouse Operations Platform</p>
            </div>
          </div>
          <h1>창고 운영 데이터를 한 화면에서 관리합니다.</h1>
          <p>계약, 입고, 재고, 출고 흐름을 API 기반으로 연결하고 관리자와 일반 사용자 권한을 분리합니다.</p>
        </div>
      </section>
      <section className="auth-card-wrap">
        <div className="auth-card">
          <h2>로그인</h2>
          <p>테스트 계정으로 접속한 뒤 WMS 업무 화면을 확인합니다.</p>
          {error && <div className="error">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>이메일</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="admin@test.com" />
            </div>
            <div className="field">
              <label>비밀번호</label>
              <input name="password" value={form.password} onChange={handleChange} placeholder="1234" type="password" />
            </div>
            <button className="button" type="submit">로그인</button>
          </form>
          <div className="auth-links">
            <Link href="/signup">회원가입</Link>
            <Link href="/">첫 화면으로 이동</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
