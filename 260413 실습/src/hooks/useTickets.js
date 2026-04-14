import { useState } from 'react';

function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadTickets(keyword = '', status = '') {
    setLoading(true);

    const response = await fetch(
      '/api/tickets?keyword=' +
        encodeURIComponent(keyword) +
        '&status=' +
        encodeURIComponent(status)
    );

    const data = await response.json();
    setTickets(data);
    setLoading(false);
  }

  async function createTicket(form) {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    return await response.json();
  }

  async function updateTicket(id, form) {
    const response = await fetch('/api/tickets/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    return await response.json();
  }

  async function deleteTicket(id) {
    const response = await fetch('/api/tickets/' + id, {
      method: 'DELETE'
    });

    return await response.json();
  }

  return {
    tickets,
    loading,
    loadTickets,
    createTicket,
    updateTicket,
    deleteTicket
  };
}

export default useTickets;