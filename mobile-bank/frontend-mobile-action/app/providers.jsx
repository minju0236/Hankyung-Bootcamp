"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 5000, refetchOnWindowFocus: false },
      mutations: { retry: 0 }
    }
  }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
