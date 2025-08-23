import "@/styles/globals.css";
import type { Metadata } from "next";
import { FontProvider } from "@/contexts/font-context";
import { BlurProvider } from "@/contexts/blur-context";
import { Toaster } from "sonner";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { ConversationProvider } from "@/contexts/conversation-context";
import { Plus_Jakarta_Sans } from "next/font/google";
export const metadata: Metadata = siteConfig;

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className}`}>
        <ConversationProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <FontProvider>
              <BlurProvider>
                {children}
                <Toaster />
              </BlurProvider>
            </FontProvider>
          </ThemeProvider>
        </ConversationProvider>
      </body>
    </html>
  );
}
