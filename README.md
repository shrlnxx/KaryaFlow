# KaryaFlow

> **AI Scope Guard & Margin Protection for Creative Freelancers and Agencies**  
> *Solusi Kecerdasan Artifisial untuk Ekosistem Ekonomi Kreatif (Ekraf) & Freelancer Indonesia — Track AI (Topik 1)*

---

## 🌟 Tentang KaryaFlow

**KaryaFlow** adalah platform web profesional yang dirancang khusus untuk melindungi pekerja lepas (*freelancer*) dan agensi kreatif subsektor Ekraf (Desain Web, Fotografi, Videografi, dll.) dari **scope creep**, revisi tanpa akhir tanpa kompensasi, dan kebocoran margin usaha.

Dengan pendekatan **Modern Bento Dashboard**, KaryaFlow memadukan kecerdasan **Gemini AI Multimodal** dengan **kalkulator deterministik 100% berbasis kode** untuk menjamin akurasi finansial dan transparansi ruang lingkup kerja.

---

## 🚀 Fitur Unggulan

### 1. 🍱 Bento Workspace Overview
- **Nilai Kontrak Terkonfirmasi**: Pemantauan nilai total proyek, alokasi DP 50%, dan pelunasan akhir secara real-time.
- **Radar Risiko Brief (Traffic Light)**: Visualisasi status klausul aman (*hijau*), ambigu (*kuning*), dan rawan (*merah*).
- **Protokol Revisi SOP**: Batasan revisi mayor, jatah *micro-change*, serta masa garansi bug/cacat kerja.

### 2. 🔍 Bedah Brief & WhatsApp Multimodal Analyzer
- **Upload Screenshot Chat WA**: Unggah tangkapan layar percakapan WhatsApp dari klien (drag-and-drop, file picker, atau tekan `Ctrl + V`).
- **Gemini Vision Deep Intent**: AI membaca bubble chat obrolan, membedakan pihak klien vs freelancer, dan mengekstrak *kebutuhan sebenarnya* di balik basa-basi klien.
- **Traffic Light Risk Detection**: Deteksi klausul berbahaya (misal: "revisi bebas tanpa batas", "garansi omset viral").
- **Draf Pertanyaan Klarifikasi WA**: Kunci ekspektasi tertulis sebelum klien membayar DP dengan 1-klik salin ke clipboard.

### 3. 🧾 Katalog Layanan & Kalkulator Nilai SKU Deterministik
- **Katalog Layanan Resmi**: Pemetaan item deliverable berdasarkan SKU baku studio (`WEB-LP-01`, `VID-HIGH-01`, dll.).
- **100% Code-Driven Calculation**: Seluruh perhitungan rupiah dihitung oleh kode matematis murni backend (AI dilarang mengarang nominal).

### 4. 📄 Proposal Formal A4 Siap Cetak / PDF
- Lembar penawaran resmi standar industri dengan 10 komponen scope protection (Kop usaha, ringkasan eksekutif, tabel SKU, daftar tegas pengecualian/exclusions, termin pembayaran, SOP revisi, dan legalitas).

### 5. 🛡️ Scope Guard Simulator & Margin Protector
- Menguji permintaan tambahan klien di tengah pengerjaan proyek.
- Menentukan apakah permintaan masuk kategori **COVERED** (masuk kuota), **OUT OF SCOPE** (biaya add-on resmi), atau **NEED CLARIFICATION**.
- Menghasilkan draf balasan WhatsApp yang santun, profesional, dan solutif.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **UI Library**: [React 18](https://react.dev/) & [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Engine**: Google Gemini API Multimodal Vision (`gemini-2.0-flash`, `gemini-1.5-flash`)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 💻 Memulai (Quick Start)

### 1. Clone Repositori
```bash
git clone https://github.com/shrlnxx/KaryaFlow.git
cd KaryaFlow
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Buka file `.env.local` dan masukkan API Key Gemini Anda dari [Google AI Studio](https://aistudio.google.com/):
```env
GEMINI_API_KEY=AIzaSy... atau AQ...
```
*(Catatan: KaryaFlow dilengkapi dengan Mode Smart Fallback. Jika API Key belum diisi, aplikasi tetap dapat dijalankan dan diuji dengan data deterministik).*

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 5. Menjalankan Pengujian Otomasi
```bash
npm test
```

---

## 📂 Struktur Direktori

```
karyaflow/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/        # Endpoint Gemini Multimodal Brief Analyzer
│   │   │   └── scope-guard/    # Endpoint Scope Guard Simulator
│   │   ├── globals.css         # Design tokens & Tailwind utility
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main application bento dashboard
│   ├── components/
│   │   ├── layout/             # AppShell, Topbar, Sidebar
│   │   ├── ui/                 # BentoCard, ImageDropzone
│   │   ├── A4Proposal.tsx      # Formal A4 Proposal view & print layout
│   │   └── ScopeGuardPanel.tsx # Scope Guard evaluator & simulation
│   ├── data/
│   │   ├── catalog.json        # Katalog resmi SKU & tarif acuan
│   │   └── mock-data.ts        # Data persona & skenario Gemintang / Memoku
│   └── lib/
│       ├── calculator.ts       # 100% deterministic pricing calculator
│       └── schemas.ts          # Zod validation schemas
├── tests/                      # Automated test suite
└── package.json
```

---

## 📄 Lisensi
Dikembangkan untuk kebutuhan Track AI GCC Ekraf 2026.
