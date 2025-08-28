import "@/styles/globals.css";
import type { Metadata } from "next";
import { FontProvider } from "@/contexts/font-context";
import { BlurProvider } from "@/contexts/blur-context";
import { Toaster } from "sonner";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, Syne } from "next/font/google";
import { ExecutionProvider } from "@/contexts/execution-context";
export const metadata: Metadata = siteConfig;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["200", "400", "500"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${syne.variable}`}>
        <ExecutionProvider>
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
        </ExecutionProvider>
      </body>
    </html>
  );
}
