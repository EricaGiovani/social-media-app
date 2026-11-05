"use client";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { store } from "@/store";
import { hydrate, logout } from "@/store/authSlice";
import { setUnauthorizedHandler } from "@/lib/api/client";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());

  useEffect(() => {
    store.dispatch(hydrate());
    setUnauthorizedHandler(() => {
      if (!store.getState().auth.token) return;
      store.dispatch(logout());
      qc.clear();
      toast.error("Session expired. Please login again.");
    });
    return () => setUnauthorizedHandler(null);
  }, [qc]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={qc}>
        {children}
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
    </Provider>
  );
}