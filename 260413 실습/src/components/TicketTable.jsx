function TicketTable(props) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>번호</th>
          <th style={styles.th}>고객명</th>
          <th style={styles.th}>제목</th>
          <th style={styles.th}>상태</th>
          <th style={styles.th}>등록일</th>
          <th style={styles.th}>관리</th>
        </tr>
      </thead>

      <tbody>
        {props.tickets.map(function (ticket) {
          return (
            <tr key={ticket.id}>
              <td style={styles.td}>{ticket.id}</td>
              <td style={styles.td}>{ticket.customer_name}</td>
              <td style={styles.td}>{ticket.title}</td>
              <td style={styles.td}>{ticket.status}</td>
              <td style={styles.td}>{ticket.created_at}</td>
              <td style={styles.td}>
                <button
                  onClick={function () {
                    props.onEdit(ticket);
                  }}
                  style={styles.editButton}
                >
                  수정
                </button>

                <button
                  onClick={function () {
                    props.onDelete(ticket.id);
                  }}
                  style={styles.deleteButton}
                >
                  삭제
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff'
  },
  th: {
    borderBottom: '1px solid #d1d5db',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f9fafb'
  },
  td: {
    borderBottom: '1px solid #e5e7eb',
    padding: '12px'
  },
  editButton: {
    marginRight: '8px',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer'
  },
  deleteButton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    cursor: 'pointer'
  }
};

export default TicketTable;