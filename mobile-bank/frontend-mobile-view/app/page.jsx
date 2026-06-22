"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "./store/authStore";
import { useAccount, useLogin, useRegister, useTransactions, useRecentRecipients } from "./hooks/useBankQueries";

function money(value) {
  return Number(value || 0).toLocaleString("ko-KR") + "원";
}
function txLabel(type) {
  return { DEPOSIT: "입금", WITHDRAW: "출금", TRANSFER_OUT: "송금", TRANSFER_IN: "입금" }[type] || type;
}
function errorOf(...items) {
  return items.find((item) => item?.error)?.error?.message || "";
}

export default function MobileViewPage() {
  const [form, setForm] = useState({ username: "user1", password: "1234", name: "모바일사용자" });
  const [mode, setMode] = useState("login");
  const auth = useAuthStore();
  const login = useLogin();
  const register = useRegister();
  const account = useAccount();
  const tx = useTransactions();
  const recent = useRecentRecipients();
  const transactions = tx.data || [];
  const latest = transactions[0];
  const recentList = useMemo(() => (recent.data || []).slice(0, 4), [recent.data]);

  if (!auth.token) {
    return (
      <main className="phone-bg">
        <section className="phone-card auth-card">
          <div className="status-bar"><span>9:41</span><span>5G 100%</span></div>
          <div className="app-mark">충</div>
          <p className="eyebrow">CHUNGJEONG BANK</p>
          <h1>빠르고 안전한<br />모바일 뱅킹</h1>
          <p className="lead">조회는 모바일 조회 서버, 거래는 별도 거래 서버에서 처리됩니다. 로그인 세션은 Redis에 저장됩니다.</p>

          <div className="segmented">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>로그인</button>
            <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>회원가입</button>
          </div>

          <div className="input-stack">
            <label>아이디</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <label>비밀번호</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {mode === "register" && <><label>이름</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></>}
          </div>

          <button className="primary wide" onClick={() => mode === "login" ? login.mutate({ username: form.username, password: form.password }) : register.mutate(form)}>
            {mode === "login" ? "로그인" : "회원가입 후 시작"}
          </button>
          <p className="error-text">{errorOf(login, register)}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="phone-bg">
      <section className="phone-frame">
        <div className="status-bar"><span>9:41</span><span>5G 100%</span></div>
        <header className="mobile-header">
          <div><p>안녕하세요</p><h1>{auth.profile?.name || auth.profile?.username}님</h1></div>
          <button className="icon-button" onClick={auth.logout}>종료</button>
        </header>

        <section className="balance-card">
          <div className="card-top"><span>충정 주거래 계좌</span><b>{account.data?.status || "-"}</b></div>
          <h2>{account.isLoading ? "조회 중" : money(account.data?.balance)}</h2>
          <p>{account.data?.accountNumber || "계좌 정보를 불러오는 중입니다"}</p>
          <div className="quick-actions">
            <a href="/action">송금</a><a href="/action">입금</a><a href="/action">출금</a>
          </div>
        </section>

        <section className="notice-card">
          <div><strong>Redis 세션 공유</strong><p>조회 서버 3002에서 로그인해도 거래 서버 3003에서 같은 인증 상태를 사용합니다.</p></div>
          <span>LIVE</span>
        </section>

        <section className="section-block">
          <div className="section-head"><h2>최근 송금 대상</h2><a href="/action">관리</a></div>
          <div className="recipient-row">
            {(recentList.length ? recentList : ["110-100-000002", "110-100-000003", "110-100-000004"]).map((item, idx) => <div className="recipient" key={item + idx}><span>{idx + 1}</span><p>{item}</p></div>)}
          </div>
        </section>

        <section className="section-block">
          <div className="section-head"><h2>거래내역</h2><button onClick={() => { account.refetch(); tx.refetch(); recent.refetch(); }}>새로고침</button></div>
          {latest && <div className="latest-card"><span>최근 거래</span><strong>{txLabel(latest.type)}</strong><b>{money(latest.amount)}</b><p>{latest.memo || "메모 없음"}</p></div>}
          <div className="tx-list">
            {transactions.slice(0, 8).map((item) => <div className="tx-item" key={item.id}><div><strong>{txLabel(item.type)}</strong><p>{item.memo || item.createdAt}</p></div><b>{money(item.amount)}</b></div>)}
            {!transactions.length && <p className="empty">거래내역이 없습니다.</p>}
          </div>
        </section>

        <nav className="bottom-nav"><span className="active">홈</span><a href="/action">거래</a><span>내역</span><span>설정</span></nav>
      </section>
    </main>
  );
}
