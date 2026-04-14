import { Link, Outlet, useLocation } from 'react-router-dom';

function MainLayout() {
  const location = useLocation();

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div style={styles.logo}>ServiceDesk Admin</div>
        <div style={styles.userBox}>운영관리자 선생님</div>
      </header>

      <div style={styles.body}>
        <aside style={styles.sidebar}>
          <Link
            to="/dashboard"
            style={
              location.pathname === '/dashboard'
                ? { ...styles.menu, ...styles.activeMenu }
                : styles.menu
            }
          >
            대시보드
          </Link>

          <Link
            to="/tickets"
            style={
              location.pathname === '/tickets'
                ? { ...styles.menu, ...styles.activeMenu }
                : styles.menu
            }
          >
            문의 관리
          </Link>

          <Link
            to="/reports"
            style={
              location.pathname === '/reports'
                ? { ...styles.menu, ...styles.activeMenu }
                : styles.menu
            }
          >
            통계 보기
          </Link>
        </aside>

        <main style={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f8'
  },
  header: {
    height: '70px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px'
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold'
  },
  userBox: {
    color: '#374151'
  },
  body: {
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    minHeight: 'calc(100vh - 70px)'
  },
  sidebar: {
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px'
  },
  menu: {
    textDecoration: 'none',
    color: '#111827',
    padding: '12px 14px',
    borderRadius: '10px',
    marginBottom: '10px'
  },
  activeMenu: {
    backgroundColor: '#111827',
    color: '#ffffff'
  },
  main: {
    padding: '24px'
  }
};

export default MainLayout;