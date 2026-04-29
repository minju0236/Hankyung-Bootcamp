'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    });

    if (!response.ok) {
      alert('로그아웃에 실패했습니다.');
      return;
    }

    router.push('/login');
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout}>
      로그아웃
    </button>
  );
}