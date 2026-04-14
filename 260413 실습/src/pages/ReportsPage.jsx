import { useEffect, useState } from 'react';

function ReportsPage() {
  const [rows, setRows] = useState([]);

  useEffect(function () {
    loadReport();
  }, []);

  async function loadReport() {
    const response = await fetch('/api/reports/status');
    const data = await response.json();
    setRows(data);
  }

  return (
    <div>
      <h1 style={styles.title}>상태별 문의 통계</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>상태</th>
            <th style={styles.th}>건수</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(function (row, index) {
            return (
              <tr key={index}>
                <td style={styles.td}>{row.status}</td>
                <td style={styles.td}>{row.count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  title: {
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff'
  },
  th: {
    borderBottom: '1px solid #d1d5db',
    padding: '12px',
    textAlign: 'left'
  },
  td: {
    borderBottom: '1px solid #e5e7eb',
    padding: '12px'
  }
};

export default ReportsPage;