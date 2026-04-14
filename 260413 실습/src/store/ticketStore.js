import { create } from 'zustand';

const useTicketStore = create(function (set) {
  return {
    tickets: [],
    loading: false,

    loadTickets: async function (keyword = '', status = '') {
      set({ loading: true });

      const response = await fetch(
        '/api/tickets?keyword=' +
          encodeURIComponent(keyword) +
          '&status=' +
          encodeURIComponent(status)
      );

      const data = await response.json();

      set({
        tickets: data,
        loading: false
      });
    },

    createTicket: async function (form) {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      return await response.json();
    },

    updateTicket: async function (id, form) {
      const response = await fetch('/api/tickets/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      return await response.json();
    },

    deleteTicket: async function (id) {
      const response = await fetch('/api/tickets/' + id, {
        method: 'DELETE'
      });

      return await response.json();
    }
  };
});

export default useTicketStore;