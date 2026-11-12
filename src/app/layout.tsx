import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'JSON to Schema Converter — TypeScript & Zod Engine',
  description: 'Fast, client-side JSON to TypeScript Interfaces, Types, and Zod Schemas parser with smart format detection and auto-fix.',
  keywords: ['json to zod', 'json to typescript', 'zod schema generator', 'developer tools', 'frontend utility'],
  authors: [{ name: 'Egho Pratama' }],
  openGraph: {
    title: 'JSON ➔ Schema Converter',
    description: '100% Client-side JSON parser for TypeScript & Zod schemas',
    type: 'website',
    locale: 'en_US',
    url: 'https://json-to-schema-nine.vercel.app'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON ➔ Schema Converter',
    description: 'Convert JSON responses to TypeScript & Zod schemas instantly.',
  },
  alternates: {
    canonical: 'https://json-to-schema-nine.vercel.app'
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
