import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Inter_Tight({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "RKV Consulting | AI agents for real estate investors",
  description:
    "RKV Consulting builds AI agents for real estate investors and investment companies, from a single agent to full systems across 1,000+ doors: seller leads, resident desk, rent follow-up, bookkeeping, investor updates and more.",
  openGraph: {
    title: "RKV Consulting | AI agents for real estate investors",
    description: "21 AI agents across acquisitions, operations, back office, capital and lending. You approve what matters.",
    type: "website",
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
