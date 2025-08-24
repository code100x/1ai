import { SidebarToggle } from "@/app/_components/sidebar-toggle";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SelectTheme } from "@/components/ui/theme-toggler";
import { UIStructure } from "@/components/ui/ui-structure";
import { ThemeProvider } from "@/components/theme-provider";
import { UpgradeCTA } from "@/components/ui/upgrade-cta";
import { ChatWrapper } from "@/contexts/chat-context";

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
          <SidebarInset className="!h-svh p-2">
            {/* add this wrapper so that the keydown can be accessed in whole chat screen */}
            <ChatWrapper>
              <div className="absolute top-0 left-0 z-[50] flex h-12 w-full items-center justify-between px-3">
                <SidebarToggle />
                <div className="flex items-center gap-2">
                  <UpgradeCTA variant="topbar" />
                  <SelectTheme />
                </div>
              </div>
              <div className="mx-auto flex max-h-fit w-full max-w-3xl flex-col overflow-y-hidden">
                <div className="flex-1">{children}</div>
              </div>
            </ChatWrapper>
          </SidebarInset>
        </ThemeProvider>
      </SidebarProvider>
    </>
  );
}
