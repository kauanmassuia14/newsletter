import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const outfit = Outfit({ variable: "--font-heading", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Connect & Story — Eventos, Palestras e Storytelling",
  description: "A newsletter premium sobre eventos, palestras e storytelling que transforma sua perspectiva profissional.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
