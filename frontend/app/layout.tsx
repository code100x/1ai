import "@/styles/globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";
import { Inter, Syne } from "next/font/google";
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
				<Providers>{children}</Providers>
				<Toaster />
			</body>
		</html>
  );
}
