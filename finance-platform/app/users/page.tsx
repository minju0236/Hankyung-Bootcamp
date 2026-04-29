'use client';

import { useEffect, useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(function () {
    async function loadUsers() {
      const response = await fetch('/api/admin/users');

      if (!response.ok) {
        alert('사용자 목록 조회에 실패했습니다.');
        return;
      }

      const data = await response.json();
      setUsers(data.users);
    }

    loadUsers();
  }, []);

  return (
    <main className="page">
      <section className="card">
        <h1>관리자 사용자 관리</h1>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>권한</th>
              <th>상태</th>
              <th>생성일</th>
            </tr>
          </thead>

          <tbody>
            {users.map(function (user) {
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{user.created_at}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}