import { SidebarToggle } from "@/app/_components/sidebar-toggle";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SelectTheme } from "@/components/ui/theme-toggler";
import { UIStructure } from "@/components/ui/ui-structure";
import { ThemeProvider } from "@/components/theme-provider";
import { UpgradeCTA } from "@/components/ui/upgrade-cta";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                <SidebarToggle />
                <div className="flex items-center gap-2">
                  <UpgradeCTA variant="topbar" />
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
