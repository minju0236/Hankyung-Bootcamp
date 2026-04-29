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
  const [message, setMessage] = useState('');
  const [newPasswords, setNewPasswords] = useState<Record<number, string>>({});

  async function loadUsers() {
    const response = await fetch('/api/admin/users');

    if (!response.ok) {
      alert('사용자 목록 조회에 실패했습니다.');
      return;
    }

    const data = await response.json();
    setUsers(data.users);
  }

  useEffect(function () {
    loadUsers();
  }, []);

  async function handleChangeRoleStatus(
    userId: number,
    role: 'user' | 'admin',
    status: 'active' | 'inactive'
  ) {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role,
        status
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || '사용자 정보 변경에 실패했습니다.');
      return;
    }

    setMessage(data.message);
    await loadUsers();
  }

  async function handleResetPassword(userId: number) {
    const newPassword = newPasswords[userId];

    if (!newPassword) {
      alert('새 비밀번호를 입력하세요.');
      return;
    }

    const response = await fetch(`/api/admin/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || '비밀번호 재설정에 실패했습니다.');
      return;
    }

    setMessage(data.message);
    setNewPasswords({
      ...newPasswords,
      [userId]: ''
    });
  }

  async function handleDeleteUser(userId: number) {
    const isConfirmed = confirm('정말 이 사용자를 삭제하시겠습니까?');

    if (!isConfirmed) {
      return;
    }

    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || '사용자 삭제에 실패했습니다.');
      return;
    }

    setMessage(data.message);
    await loadUsers();
  }

  return (
    <main className="page">
      <section className="card">
        <h1>관리자 사용자 관리</h1>
        <p>사용자 권한, 상태, 비밀번호, 삭제 작업을 관리합니다.</p>

        {message && <p>{message}</p>}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>권한</th>
              <th>상태</th>
              <th>비밀번호 재설정</th>
              <th>삭제</th>
            </tr>
          </thead>

          <tbody>
            {users.map(function (user) {
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td>
                    <select
                      value={user.role}
                      onChange={function (event) {
                        handleChangeRoleStatus(
                          user.id,
                          event.target.value as 'user' | 'admin',
                          user.status
                        );
                      }}
                    >
                      <option value="user">사용자</option>
                      <option value="admin">관리자</option>
                    </select>
                  </td>

                  <td>
                    <select
                      value={user.status}
                      onChange={function (event) {
                        handleChangeRoleStatus(
                          user.id,
                          user.role,
                          event.target.value as 'active' | 'inactive'
                        );
                      }}
                    >
                      <option value="active">활성</option>
                      <option value="inactive">비활성</option>
                    </select>
                  </td>

                  <td>
                    <input
                      type="password"
                      placeholder="새 비밀번호"
                      value={newPasswords[user.id] || ''}
                      onChange={function (event) {
                        setNewPasswords({
                          ...newPasswords,
                          [user.id]: event.target.value
                        });
                      }}
                    />

                    <button
                      type="button"
                      onClick={function () {
                        handleResetPassword(user.id);
                      }}
                    >
                      재설정
                    </button>
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={function () {
                        handleDeleteUser(user.id);
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={7}>사용자 목록이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}