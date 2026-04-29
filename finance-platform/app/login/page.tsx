'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      alert('로그인에 실패했습니다.');
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main className="page">
      <form className="card form" onSubmit={handleSubmit}>
        <h1>로그인</h1>

        <input
          placeholder="이메일"
          value={form.email}
          onChange={function (event) {
            setForm({ ...form, email: event.target.value });
          }}
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={function (event) {
            setForm({ ...form, password: event.target.value });
          }}
        />

        <button type="submit">로그인</button>
      </form>
    </main>
  );
}