import { atom } from 'jotai';

export const ticketsAtom = atom([]);
export const loadingAtom = atom(false);

export const fetchTicketsAtom = atom(
  null,
  async function (get, set, params) {
    const keyword = params.keyword || '';
    const status = params.status || '';

    set(loadingAtom, true);

    const response = await fetch(
      '/api/tickets?keyword=' +
        encodeURIComponent(keyword) +
        '&status=' +
        encodeURIComponent(status)
    );

    const data = await response.json();

    set(ticketsAtom, data);
    set(loadingAtom, false);
  }
);