import { useEffect, useState } from 'react';
import SummaryCard from '../components/SummaryCard';

function DashboardPage() {
  const [summary, setSummary] = useState({
    totalCount: 0,
    waitingCount: 0,
    workingCount: 0,
    doneCount: 0
  });

  useEffect(function () {
    loadSummary();
  }, []);

  async function loadSummary() {
    const response = await fetch('/api/dashboard/summary');
    const data = await response.json();
    setSummary(data);
  }

  return (
    <div>
      <h1 style={styles.title}>운영 대시보드</h1>

      <div style={styles.grid}>
        <SummaryCard label="전체 문의" value={summary.totalCount} />
        <SummaryCard label="접수대기" value={summary.waitingCount} />
        <SummaryCard label="처리중" value={summary.workingCount} />
        <SummaryCard label="처리완료" value={summary.doneCount} />
      </div>
    </div>
  );
}

const styles = {
  title: {
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px'
  }
};

export default DashboardPage;