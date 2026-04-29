'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      alert('회원가입에 실패했습니다.');
      return;
    }

    router.push('/login');
  }

  return (
    <main className="page">
      <form className="card form" onSubmit={handleSubmit}>
        <h1>회원가입</h1>

        <input
          placeholder="이름"
          value={form.name}
          onChange={function (event) {
            setForm({ ...form, name: event.target.value });
          }}
        />

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

        <select
          value={form.role}
          onChange={function (event) {
            setForm({ ...form, role: event.target.value });
          }}
        >
          <option value="user">사용자</option>
          <option value="admin">관리자</option>
        </select>

        <button type="submit">회원가입</button>
      </form>
    </main>
  );
}