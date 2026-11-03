import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KaryaFlow: AI Scope dan Margin Guard untuk UMKM Ekraf",
  description: "Alat bantu analisis brief klien dan proteksi batasan revisi kerja untuk UMKM kreatif dan teknologi Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#F8F9FB] text-[#171717] font-sans antialiased selection:bg-[#171717] selection:text-white">
        {children}
      </body>
    </html>
  );
}
