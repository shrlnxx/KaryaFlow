# Status Kemajuan KaryaFlow (PROGRESS.md)

## Status Umum
- **Fase Saat Ini:** Fase 1 & Fondasi Fase 2/3 Berhasil Diselesaikan
- **Terakhir Diperbarui:** 2 November 2026
- **Build Status:** Next.js 14 Production Build PASSED (Zero TypeScript Errors)

## Log Tugas (PRD C)
- [x] **T0 — Inisialisasi Proyek:** Setup Next.js 14, TypeScript, Tailwind CSS, `config.ts`, `types.ts`, `DECISIONS.md`, `PROGRESS.md`.
- [x] **T1 — Katalog Seed & Editor Tarif:** Seed Website & Fotografi di `src/catalog/seed.ts` (Website & Fotografi).
- [x] **T2 — Kalkulasi Deterministik:** `src/lib/calculate.ts` & `src/lib/calculator.ts` menghitung subtotal, total, DP 50%, pelunasan 50%, pembulatan rupiah, dan proteksi harga deterministik berbasis `catalog.json`.
- [x] **T2.1 — Katalog Riil & Skema Zod (Putaran 2):**
  - `src/data/catalog.json`: Data katalog resmi untuk Gemintang Production (Web) & MemokuVisual (Foto/Video) dengan atribut, pengecualian, dan kebijakan revisi.
  - `src/lib/schemas.ts`: Skema validasi Zod untuk Brief Analyzer, Scope Guard, dan enum SKU dinamis otomatis dari `catalog.json` + `UNMAPPED`.
  - `src/lib/calculator.ts`: Fungsi murni deterministik `calculateQuotation()` dengan proteksi item `"UNMAPPED"` (label "Perlu dikonfirmasi", tanpa tebak harga).
- [x] **T3 — Fixtures 3 Skenario:** `src/fixtures/index.ts` menyediakan data simulasi lengkap (Gemintang Production Web & MemokuVisual Foto/Video) siap jalan 100% offline tanpa kuota API.
- [x] **T4 — UI Shell Dashboard Utama (`src/app/page.tsx`):**
  - [x] **Top Navbar Sticky:** Logo KaryaFlow dengan ShieldCheck + badge "AI Scope & Margin Guard", Brand Switcher (Gemintang 💻 vs MemokuVisual 📸), dan toggle "Mode Demo".
  - [x] **4-Segment Metric Strip:** Status analisis brief (monospaced), Total Nilai Kontrak (real-time kalkulator deterministik), Skema Termin (DP 50% & Pelunasan 50%), dan Batas Proteksi Scope.
  - [x] **Putaran 3 — Integrasi Interaksi UI:**
    - [x] State Brand terhubung ke `src/data/mock-data.ts` dan `src/data/catalog.json`.
    - [x] Chip kalimat brief interaktif dengan badge warna (Merah, Kuning, Hijau) dan accordion alasan analisis.
    - [x] Draf WhatsApp dengan checkbox interaktif dan tombol "Salin ke WhatsApp" dengan feedback teks berubah.
    - [x] Stepper kuantitas `[-]` `qty` `[+]` dan tombol "+ Tambah Item dari Katalog" memicu `calculateQuotation()` secara real-time.
    - [x] Item `UNMAPPED` berbadge "Perlu dikonfirmasi" tanpa merusak total angka dan dilindungi dari halusinasi harga.
  - [x] **Putaran 4 — Proposal A4 Siap PDF & Scope Guard:**
    - [x] `src/components/A4Proposal.tsx`: Lembaran A4 putih berbayang halus di atas latar abu-abu memuat 10 komponen proposal formal (Kop, No Dokumen, Masa Berlaku 7 Hari, Ringkasan WA, Kotak Nilai Kontrak DP 50%, Rincian SKU Deliverables, Daftar Excludes Tegas, Skema Termin, Batasan Revisi & Garansi, Ajakan Bertindak Balas 'SETUJU', Footer halaman).
    - [x] Tombol "Cetak / Simpan PDF" dengan aturan `@media print` presisi di `src/app/globals.css`.
    - [x] `src/components/ScopeGuardPanel.tsx`: 3 tombol simulasi juri (`[Uji Kasus Covered]`, `[Uji Kasus Out of Scope]`, `[Uji Kasus Ambigu]`), Banner Visual Besar verdict resmi, kartu Rincian Biaya Tambahan (Rp) deterministik, dan Kotak Draf Balasan WA sopan dengan 1-klik "Salin Draf WA".
  - [x] **Putaran 5 (Terakhir) — Integrasi Gemini API & Mekanisme Tahan-Gagal (Resilience):**
    - [x] `src/app/api/analyze/route.ts`: Endpoint backend terhubung ke `@google/generative-ai` memanggil `gemini-2.5-flash` (dengan fallback ke `gemini-1.5-flash`).
    - [x] System instruction ketat menyertakan isi `catalog.json` dan aturan emas: dilarang menulis harga angka.
    - [x] `responseSchema` mengunci output AI ke struktur JSON terstruktur.
    - [x] Validasi Zod via `BriefAnalyzerOutputSchema` dan kalkulasi Rupiah deterministik via `calculateQuotation()`.
    - [x] Auto-Fallback kokoh: Jika API Key kosong / HTTP 429 kuota habis / network error, mengembalikan data aman dari `src/data/mock-data.ts` dengan flag `isFallback: true` tanpa crash.
    - [x] Banner status di UI (`src/app/page.tsx`) menginformasikan mode live vs fallback secara transparan agar pengujian juri berjalan mulus tanpa hambatan kuota.
  - [x] **Fitur Input Brief Dinamis & Chat Klien (Putaran 5+):**
    - [x] Textarea bersih di Kolom Kiri untuk mengetik/menempel transkrip chat klien secara bebas.
    - [x] Tombol utama **[ Bedah Brief & Analisis AI ]** (Vercel Style) dan tombol sekunder **[ Muat Contoh Cepat ]**.
    - [x] Terhubung langsung ke API `/api/analyze` dengan fallback parser cerdas yang mendeteksi frasa risiko, klausul performa, kriteria visual, dan scope creep secara real-time.
    - [x] Seluruh chip Traffic Light, draf pertanyaan WA, dan kalkulasi tabel harga menyesuaikan secara dinamis dengan brief baru.
- [x] **T5 — Parser Chat & Anonymizer:**
  - `src/lib/parseChat.ts`: parsing WhatsApp format ID/EN, 12/24 jam, multiline merge, buang baris sistem enkripsi/media.
  - `src/lib/anonymize.ts`: masking regex nomor telepon Indonesia, email, link URL, NIK KTP, dan nomor rekening.
- [x] **T7 — Prompts & Guardrails Validasi:**
  - `src/prompts/analyze.ts` & `src/prompts/scopeGuard.ts`: system prompt resmi PRD B5 & B6.
  - `src/lib/verifyQuotes.ts`: verifikasi kutipan AI terhadap teks chat asli.
  - `src/lib/validate.ts`: pembersihan regex angka harga yang dikarang AI dan penegakan aturan bisnis.
  - `src/lib/gemini.ts`: wrapper client Gemini dengan backoff retry dan penanganan kuota ramah.
- [x] **T10 — Generator Proposal A4:** `src/lib/buildProposal.ts` untuk layout dokumen formal dan deteksi placeholder `[...]`.
- [x] **T11 — Draf Klarifikasi WA:** `src/lib/clarify.ts` template pembuat pesan WhatsApp tanpa API.

## Langkah Selanjutnya (Fase 3 & 4)
- [ ] Pengujian 12 kasus Scope Guard (`tests/scopeGuard.cases.json`)
- [ ] Validasi data riil dengan mitra UMKM Gemintang & MemokuVisual
- [ ] Pembuatan slide deck presentasi (7 slide) dan video demo 3 menit
