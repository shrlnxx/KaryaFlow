import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
