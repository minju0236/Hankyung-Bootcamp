import { createContext, useContext } from 'react';
import useTickets from '../hooks/useTickets';

const TicketContext = createContext();

export function TicketProvider({ children }) {
  const ticketState = useTickets();

  return (
    <TicketContext.Provider value={ticketState}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTicketContext() {
  return useContext(TicketContext);
}