"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FontProvider } from "@/contexts/font-context";
import { BlurProvider } from "@/contexts/blur-context";
import { ThemeProvider } from "@/components/theme-provider";
import { ExecutionProvider } from "@/contexts/execution-context";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ExecutionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FontProvider>
            <BlurProvider>{children}</BlurProvider>
          </FontProvider>
        </ThemeProvider>
      </ExecutionProvider>
    </QueryClientProvider>
  );
};
