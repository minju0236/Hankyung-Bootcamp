"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "./store/authStore";
import { useAdminDashboard, useAdminMutation, useLogin } from "./hooks/useBankQueries";

function formatMoney(value) {
  const number = Number(value || 0);
  return number.toLocaleString("ko-KR") + "원";
}

function getErrorMessage(error) {
  return error?.message ? String(error.message) : "";
}

function NavItem({ active, label, icon }) {
  return <a className={`nav-item ${active ? "active" : ""}`} href="#"> <span>{icon}</span>{label}</a>;
}

export default function AdminPage() {
  const auth = useAuthStore();
  const [login, setLogin] = useState({ username: "admin", password: "admin123" });
  const [user, setUser] = useState({ username: "staff1", password: "1234", name: "운영직원", role: "USER" });
  const [account, setAccount] = useState({ userId: 2, initialBalance: 100000 });
  const [password, setPassword] = useState({ userId: 2, password: "1234" });
  const [status, setStatus] = useState({ userId: 2, status: "LOCKED" });
  const [closeAccount, setCloseAccount] = useState({ accountId: "" });

  const loginMutation = useLogin();
  const dashboard = useAdminDashboard();
  const createUser = useAdminMutation("/admin/users");
  const createAccount = useAdminMutation("/admin/accounts");
  const changePassword = useAdminMutation(`/admin/users/${password.userId}/password`, "PATCH");
  const changeStatus = useAdminMutation(`/admin/users/${status.userId}/status`, "PATCH");
  const closeAccountMutation = useAdminMutation(`/admin/accounts/${closeAccount.accountId}`, "DELETE");

  const data = dashboard.data || {};
  const users = data.users || [];
  const accounts = data.accounts || [];
  const transactions = data.transactions || [];
  const auditLogs = data.auditLogs || [];
  const totalBalance = useMemo(
    () => accounts.reduce((sum, item) => sum + Number(item.balance || 0), 0),
    [accounts]
  );

  if (!auth.token) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <div className="auth-brand">
            <div className="brand-logo">충</div>
            <div>
              <p>Chungjeong Bank Admin</p>
              <h1>관리자 콘솔 로그인</h1>
            </div>
          </div>
          <p className="auth-copy">회원, 계좌, 거래, Redis 감사 로그를 관리하는 PC 전용 운영 화면입니다.</p>
          <div className="auth-form">
            <label>관리자 ID</label>
            <input value={login.username} onChange={(e) => setLogin({ ...login, username: e.target.value })} />
            <label>비밀번호</label>
            <input type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
            <button className="primary wide" onClick={() => loginMutation.mutate(login)} disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "로그인 확인 중" : "로그인"}
            </button>
            <p className="error-text">{getErrorMessage(loginMutation.error)}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="side-brand">
          <div className="brand-logo">충</div>
          <div>
            <strong>충정은행</strong>
            <span>Admin Console</span>
          </div>
        </div>
        <nav className="side-nav">
          <NavItem active icon="홈" label="대시보드" />
          <NavItem icon="회원" label="회원 관리" />
          <NavItem icon="계좌" label="계좌 관리" />
          <NavItem icon="거래" label="거래 모니터링" />
          <NavItem icon="로그" label="Redis 감사 로그" />
        </nav>
        <div className="side-footer">
          <span>Next Admin 3001</span>
          <small>GCP VM · Nginx Routed</small>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <p className="crumb">운영 관리 / 관리자 콘솔</p>
            <h1>관리자 업무 대시보드</h1>
          </div>
          <div className="top-actions">
            <button className="ghost" onClick={() => dashboard.refetch()}>새로고침</button>
            <div className="profile-chip">
              <span>{auth.profile?.name || auth.profile?.username || "관리자"}</span>
              <button onClick={auth.logout}>로그아웃</button>
            </div>
          </div>
        </header>

        <main className="content">
          <section className="hero-card">
            <div>
              <span className="hero-label">Google-style Admin UI</span>
              <h2>금융 운영 데이터를 한 화면에서 관리합니다</h2>
              <p>Spring Boot API, MariaDB/JPA, Redis 세션·캐시·감사 로그를 기준으로 운영 상태를 확인합니다.</p>
            </div>
            <div className="hero-status">
              <span>API</span>
              <strong>3004</strong>
            </div>
          </section>

          <section className="metric-grid">
            <div className="metric-card"><span>회원</span><strong>{data.userCount ?? users.length}</strong><p>활성·잠금 사용자</p></div>
            <div className="metric-card"><span>계좌</span><strong>{data.accountCount ?? accounts.length}</strong><p>생성·해지 계좌</p></div>
            <div className="metric-card"><span>거래</span><strong>{data.transactionCount ?? transactions.length}</strong><p>최근 거래 모니터링</p></div>
            <div className="metric-card"><span>총 잔액</span><strong>{formatMoney(totalBalance)}</strong><p>대시보드 캐시 대상</p></div>
          </section>

          <section className="operation-grid">
            <div className="panel">
              <div className="panel-head"><h2>회원 생성</h2><span>USER / ADMIN</span></div>
              <input placeholder="아이디" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
              <input placeholder="이름" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
              <input placeholder="초기 비밀번호" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
              <select value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}><option>USER</option><option>ADMIN</option></select>
              <button onClick={() => createUser.mutate(user)}>회원 생성</button>
              <p className="error-text">{getErrorMessage(createUser.error)}</p>
            </div>

            <div className="panel">
              <div className="panel-head"><h2>계좌 생성</h2><span>관리자 발급</span></div>
              <input placeholder="사용자 ID" value={account.userId} onChange={(e) => setAccount({ ...account, userId: Number(e.target.value) })} />
              <input placeholder="초기 잔액" value={account.initialBalance} onChange={(e) => setAccount({ ...account, initialBalance: Number(e.target.value) })} />
              <button onClick={() => createAccount.mutate(account)}>계좌 생성</button>
              <p className="error-text">{getErrorMessage(createAccount.error)}</p>
            </div>

            <div className="panel">
              <div className="panel-head"><h2>비밀번호 변경</h2><span>운영자 조치</span></div>
              <input placeholder="사용자 ID" value={password.userId} onChange={(e) => setPassword({ ...password, userId: Number(e.target.value) })} />
              <input placeholder="새 비밀번호" value={password.password} onChange={(e) => setPassword({ ...password, password: e.target.value })} />
              <button onClick={() => changePassword.mutate({ password: password.password })}>비밀번호 변경</button>
              <p className="error-text">{getErrorMessage(changePassword.error)}</p>
            </div>

            <div className="panel danger-panel">
              <div className="panel-head"><h2>상태/계좌 해지</h2><span>위험 작업</span></div>
              <input placeholder="사용자 ID" value={status.userId} onChange={(e) => setStatus({ ...status, userId: Number(e.target.value) })} />
              <select value={status.status} onChange={(e) => setStatus({ ...status, status: e.target.value })}><option>LOCKED</option><option>ACTIVE</option></select>
              <button className="secondary" onClick={() => changeStatus.mutate({ status: status.status })}>사용자 상태 변경</button>
              <input placeholder="해지 계좌 ID" value={closeAccount.accountId} onChange={(e) => setCloseAccount({ accountId: e.target.value })} />
              <button className="danger" onClick={() => closeAccountMutation.mutate({})}>계좌 해지</button>
            </div>
          </section>

          <section className="data-grid">
            <div className="table-panel wide">
              <div className="panel-head"><h2>회원 목록</h2><span>{users.length}명</span></div>
              <div className="table-wrap">
                <table><thead><tr><th>ID</th><th>아이디</th><th>이름</th><th>권한</th><th>상태</th></tr></thead><tbody>{users.map((u) => <tr key={u.id}><td>{u.id}</td><td>{u.username}</td><td>{u.name}</td><td>{String(u.role)}</td><td><span className={`status ${String(u.status).toLowerCase()}`}>{String(u.status)}</span></td></tr>)}</tbody></table>
              </div>
            </div>

            <div className="table-panel wide">
              <div className="panel-head"><h2>계좌 목록</h2><span>{accounts.length}건</span></div>
              <div className="table-wrap">
                <table><thead><tr><th>ID</th><th>User</th><th>계좌번호</th><th>잔액</th><th>상태</th></tr></thead><tbody>{accounts.map((a) => <tr key={a.id}><td>{a.id}</td><td>{a.userId}</td><td>{a.accountNumber}</td><td>{formatMoney(a.balance)}</td><td><span className={`status ${String(a.status).toLowerCase()}`}>{String(a.status)}</span></td></tr>)}</tbody></table>
              </div>
            </div>

            <div className="table-panel">
              <div className="panel-head"><h2>최근 거래</h2><span>{transactions.length}건</span></div>
              <div className="timeline">{transactions.slice(0, 8).map((t) => <div className="timeline-item" key={t.id}><div><strong>{t.type}</strong><p>{t.memo || "-"} · {t.fromAccountNumber || "외부"} → {t.toAccountNumber || "-"}</p></div><b>{formatMoney(t.amount)}</b></div>)}</div>
            </div>

            <div className="table-panel">
              <div className="panel-head"><h2>Redis 감사 로그</h2><span>{auditLogs.length}건</span></div>
              <div className="audit-list">{auditLogs.slice(0, 10).map((log, idx) => <code key={idx}>{log}</code>)}</div>
            </div>
          </section>
        </main>

        <footer className="app-footer">
          <span>충정은행 분산 시스템 실습</span>
          <span>Admin 3001 · API 3004 · Redis 6379 · MariaDB 3306</span>
        </footer>
      </div>
    </div>
  );
}
