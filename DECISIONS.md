# Architectural Decisions (DECISIONS.md)

## DEC-001: Next.js 14 App Router + Single Page Layout
- **Konteks:** KaryaFlow dibangun sebagai tool internal UMKM dengan alur state-based yang cepat dan tanpa reload.
- **Keputusan:** Menggunakan Next.js 14 App Router dengan `src/app/page.tsx` sebagai Single Page Application (SPA) berbasis tab dan state interaktif, didukung Tailwind CSS dan Lucide React.
- **Dampak:** Responsif, transisi instan, dan mudah dikemas.

## DEC-002: Deterministic Financial & Duration Calculations
- **Konteks:** Menghindari halusinasi harga/durasi oleh LLM (Aturan Emas B3/B8).
- **Keputusan:** AI dilarang keras menghasilkan nominal Rupiah atau durasi hari. AI hanya memetakan `catalogItemId` dan `quantity`. Semua perhitungan dilakukan oleh fungsi matematika murni di kode (`calculate.ts`). Regex aktif membersihkan teks AI dari angka harga tidak sengaja.
- **Dampak:** Akurasi harga 100% konsisten terhadap katalog tarif pemilik usaha.

## DEC-003: Standalone Zero-API Demo Fallback
- **Konteks:** Demo ke juri atau saat kuota API habis harus tetap berjalan mulus tanpa error atau layar putih.
- **Keputusan:** Menyediakan mode simulasi dengan 3 set fixtures lengkap (Gemintang Production Web dan MemokuVisual Foto/Video) yang langsung memuat data tervalidasi tanpa panggilan jaringan.

