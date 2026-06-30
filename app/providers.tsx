"use client";

import { QueryProvider } from "@/components/providers/query-provider";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
