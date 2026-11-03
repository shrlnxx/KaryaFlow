import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KaryaFlow: AI Scope dan Margin Guard untuk UMKM Ekraf",
  description: "Alat bantu analisis brief klien dan proteksi batasan revisi kerja untuk UMKM kreatif dan teknologi Indonesia",
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F8F9FB] text-[#171717] font-sans antialiased selection:bg-[#171717] selection:text-white">
        {children}
      </body>
    </html>
  );
}
