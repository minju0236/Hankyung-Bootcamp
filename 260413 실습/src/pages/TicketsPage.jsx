import { useEffect, useState } from 'react';
import TicketForm from '../components/TicketForm';
import TicketTable from '../components/TicketTable';

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    customer_name: '',
    title: '',
    content: '',
    status: '접수대기'
  });

  useEffect(function () {
    loadTickets();
  }, []);

  async function loadTickets() {
    const response = await fetch(
      '/api/tickets?keyword=' +
        encodeURIComponent(keyword) +
        '&status=' +
        encodeURIComponent(status)
    );

    const data = await response.json();
    setTickets(data);
  }

  async function createTicket() {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (data.success) {
      resetForm();
      loadTickets();
    }
  }

  async function updateTicket() {
    const response = await fetch('/api/tickets/' + editId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (data.success) {
      resetForm();
      loadTickets();
    }
  }

  async function deleteTicket(id) {
    const response = await fetch('/api/tickets/' + id, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      loadTickets();
    }
  }

  function startEdit(ticket) {
    setEditId(ticket.id);
    setForm({
      customer_name: ticket.customer_name,
      title: ticket.title,
      content: ticket.content,
      status: ticket.status
    });
  }

  function resetForm() {
    setEditId(null);
    setForm({
      customer_name: '',
      title: '',
      content: '',
      status: '접수대기'
    });
  }

  async function handleSubmit() {
    if (editId) {
      updateTicket();
    } else {
      createTicket();
    }
  }

  return (
    <div>
      <h1 style={styles.title}>문의 관리</h1>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="검색어 입력"
          value={keyword}
          onChange={function (e) {
            setKeyword(e.target.value);
          }}
          style={styles.searchInput}
        />

        <select
          value={status}
          onChange={function (e) {
            setStatus(e.target.value);
          }}
          style={styles.searchInput}
        >
          <option value="">전체 상태</option>
          <option value="접수대기">접수대기</option>
          <option value="처리중">처리중</option>
          <option value="처리완료">처리완료</option>
        </select>

        <button onClick={loadTickets} style={styles.searchButton}>
          검색
        </button>
      </div>

      <TicketForm
        form={form}
        setForm={setForm}
        editId={editId}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />

      <TicketTable
        tickets={tickets}
        onEdit={startEdit}
        onDelete={deleteTicket}
      />
    </div>
  );
}

const styles = {
  title: {
    marginBottom: '20px'
  },
  searchBox: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  searchInput: {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '10px'
  },
  searchButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#111827',
    color: '#ffffff',
    cursor: 'pointer'
  }
};

export default TicketsPage;