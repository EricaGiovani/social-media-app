"use client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { store } from "@/store/index";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  return (
    <Provider store={store}>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </Provider>
  );
}