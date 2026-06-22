"use client";

import { useState } from "react";
import { useAccount, useBankMutation, useLogin, useTransactions } from "./hooks/useBankQueries";
import { useAuthStore } from "./store/authStore";

function money(value) {
  return Number(value || 0).toLocaleString("ko-KR") + "원";
}

function errorOf(...items) {
  return items.find((item) => item?.error)?.error?.message || "";
}

function TxType({ type }) {
  const label = {
    DEPOSIT: "입금",
    WITHDRAW: "출금",
    TRANSFER_OUT: "송금",
    TRANSFER_IN: "입금 수취"
  }[type] || type;
  return <span className="type-pill">{label}</span>;
}

export default function MobileActionPage() {
  const auth = useAuthStore();
  const [loginForm, setLoginForm] = useState({ username: "user1", password: "1234" });
  const [amount, setAmount] = useState(10000);
  const [to, setTo] = useState("110-100-000002");
  const [memo, setMemo] = useState("모바일 송금");

  const account = useAccount();
  const tx = useTransactions();
  const login = useLogin();
  const deposit = useBankMutation("/bank/deposit");
  const withdraw = useBankMutation("/bank/withdraw");
  const transfer = useBankMutation("/bank/transfer");
  const multi = useBankMutation("/bank/multi-transfer");

  const result = deposit.data || withdraw.data || transfer.data || multi.data;
  const isBusy = deposit.isPending || withdraw.isPending || transfer.isPending || multi.isPending;

  if (!auth.token) {
    return (
      <main className="mobile-shell action-shell">
        <section className="device-card login-card">
          <div className="appbar compact-appbar">
            <a className="back-link" href="/">‹</a>
            <div>
              <p>충정은행</p>
              <h1>거래 인증</h1>
            </div>
            <span className="server-chip">3003</span>
          </div>

          <section className="signin-hero">
            <div className="google-dot">G</div>
            <p className="eyebrow">MOBILE ACTION SERVER</p>
            <h2>입금·출금·송금은<br />로그인 후 진행합니다</h2>
            <p>
              조회 서버에서 로그인한 세션과 같은 Redis 저장소를 사용합니다.
              분리된 프론트 서버에서도 인증 상태가 이어지는 구조를 확인합니다.
            </p>
          </section>

          <section className="form-card">
            <label>아이디</label>
            <input value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} />
            <label>비밀번호</label>
            <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
            <button className="primary-btn full" onClick={() => login.mutate(loginForm)} disabled={login.isPending}>
              {login.isPending ? "확인 중" : "로그인"}
            </button>
            <a className="subtle-link" href="/">조회 화면으로 이동</a>
            <p className="error-text">{errorOf(login)}</p>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="mobile-shell action-shell">
      <section className="device-card">
        <div className="appbar">
          <a className="back-link" href="/">‹</a>
          <div>
            <p>충정은행 거래</p>
            <h1>{auth.profile?.name || auth.profile?.username}님</h1>
          </div>
          <button className="logout-btn" onClick={auth.logout}>종료</button>
        </div>

        <section className="account-card google-blue-card">
          <div className="card-row">
            <span>충정 주거래 계좌</span>
            <strong>{account.data?.status || "조회 중"}</strong>
          </div>
          <h2>{account.data ? money(account.data.balance) : "잔액 조회 중"}</h2>
          <p>{account.data?.accountNumber || "계좌 정보를 불러오고 있습니다"}</p>
        </section>

        <section className="form-card transfer-card">
          <div className="section-title">
            <div>
              <p>거래 입력</p>
              <h2>금액과 대상 계좌</h2>
            </div>
            <button className="ghost-btn" onClick={() => { account.refetch(); tx.refetch(); }}>새로고침</button>
          </div>

          <label>금액</label>
          <div className="money-input">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <span>원</span>
          </div>

          <div className="preset-grid">
            {[10000, 30000, 50000, 100000].map((value) => (
              <button key={value} onClick={() => setAmount(value)}>{value.toLocaleString()}</button>
            ))}
          </div>

          <label>받는 계좌</label>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="110-100-000002" />

          <label>메모</label>
          <input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="메모" />

          <div className="action-buttons">
            <button className="secondary-btn" disabled={isBusy} onClick={() => deposit.mutate({ amount: Number(amount), memo: memo || "입금" })}>입금</button>
            <button className="secondary-btn" disabled={isBusy} onClick={() => withdraw.mutate({ amount: Number(amount), memo: memo || "출금" })}>출금</button>
            <button className="primary-btn span2" disabled={isBusy} onClick={() => transfer.mutate({ toAccountNumber: to, amount: Number(amount), memo: memo || "송금" })}>송금 실행</button>
            <button className="dark-btn span2" disabled={isBusy} onClick={() => multi.mutate({ memo: "다중송금", targets: [{ toAccountNumber: "110-100-000002", amount: 1000 }, { toAccountNumber: "110-100-000003", amount: 2000 }] })}>여러 회원에게 송금</button>
          </div>

          <p className="error-text">{errorOf(deposit, withdraw, transfer, multi)}</p>
        </section>

        {result && (
          <section className="result-card">
            <span>처리 완료</span>
            <h2>{result.message}</h2>
            <p>현재 잔액 {money(result.account?.balance)}</p>
          </section>
        )}

        <section className="list-card">
          <div className="section-title">
            <div>
              <p>최근 거래</p>
              <h2>거래 내역</h2>
            </div>
            <span className="server-chip">Redis 세션</span>
          </div>
          <div className="tx-list">
            {(tx.data || []).slice(0, 6).map((item) => (
              <div className="tx-item" key={item.id}>
                <div>
                  <TxType type={item.type} />
                  <strong>{item.memo || "거래"}</strong>
                  <p>{item.createdAt}</p>
                </div>
                <b>{money(item.amount)}</b>
              </div>
            ))}
            {!(tx.data || []).length && <p className="empty">거래내역이 없습니다.</p>}
          </div>
        </section>

        <nav className="bottom-nav">
          <a href="/">홈</a>
          <span className="active">거래</span>
          <a href="/">내역</a>
          <button onClick={auth.logout}>설정</button>
        </nav>
      </section>
    </main>
  );
}
