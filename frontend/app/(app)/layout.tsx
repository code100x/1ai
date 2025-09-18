"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SelectTheme } from "@/components/ui/theme-toggler";
import { UIStructure } from "@/components/ui/ui-structure";
import { ThemeProvider } from "@/components/theme-provider";
import { UpgradeCTA } from "@/components/ui/upgrade-cta";
import { useUser } from "@/hooks/useUser";

import Link from "next/link";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: isUserLoading } = useUser();

  return (
    <>
      <SidebarProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UIStructure />
          <SidebarInset className="min-!h-svh p-2">
            <div className="bg-muted/60 relative h-[calc(100vh-16px)] min-h-[calc(100vh-16px)] w-full rounded-xl p-4">
              <div className="absolute top-0 left-0 z-[50] flex h-12 w-full items-center justify-between px-3">
                <SidebarTrigger className="shrink-0" />
                {/* <SidebarToggle /> */}
                <div className="flex items-center gap-2">
                  <UpgradeCTA variant="topbar" />
                  {!isUserLoading && !user && (
                    <Link
                      href="/auth"
                      className="flex items-center w-full text-white dark:text-neutral-900 text-xs h-8 bg-neutral-800 dark:bg-zinc-100 font-bold px-4 rounded-2xl inset-shadow-xs inset-shadow-white/20 border border-black/4 outline-0"
                    >
                      Login
                    </Link>
                  )}
                  <SelectTheme />
                </div>
              </div>
              <div className="mx-auto flex h-auto w-full max-w-3xl flex-col overflow-y-hidden">
                <div className="flex-1">{children}</div>
              </div>
            </div>
          </SidebarInset>
        </ThemeProvider>
      </SidebarProvider>
    </>
  );
}
