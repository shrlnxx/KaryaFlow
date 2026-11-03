# KaryaFlow Design Direction (DESIGN.md)

## Identitas Produk
- **Produk:** KaryaFlow — AI Brief Analyzer & Scope Guard untuk UMKM Ekraf
- **Karakter Visual:** Utilitarian, presisi, tenang, dapat diandalkan oleh pemilik studio kreatif dan teknologi.
- **Dials:** ENERGY 1 / RHYTHM 2 / MOTION 1
  - *Energy 1 (Calm):* Tidak ada efek glow berlebih, tidak ada gradien mencolok, tidak ada orbs.
  - *Rhythm 2 (Balanced):* Tata letak terstruktur dengan variasi komposisi antara panel kerja dan lembar pratinjau dokumen A4.
  - *Motion 1 (Restrained):* Transisi hanya pada interaksi hover, focus, dan pergantian tab; menghormati `prefers-reduced-motion`.

## Palet Warna (PRD B11)
- **Dasar (Ground):** `#F8FAFC` (Slate 50) dan `#FFFFFF` (Surface).
- **Tinta (Ink):** `#0F172A` (Slate 900) untuk judul, `#334155` (Slate 700) untuk teks utama, `#475569` (Slate 600) untuk teks pendukung (semua lulus kontras WCAG AA 4.5:1).
- **Struktur Primer:** Deep Navy `#1E2A5E` / Indigo pekat `#312E81`.
- **Aksi Utama (Accent):** Oranye Hangat `#EA580C` / `#C2410C` untuk tombol konversi dan persetujuan.
- **Status Fungsional (Pastel Tervalidasi):**
  - Aman / Jelas: `#065F46` di atas `#ECFDF5` (Emerald)
  - Perlu Konfirmasi / Ambigu: `#92400E` di atas `#FFFBEB` (Amber)
  - Risiko / Out of Scope: `#991B1B` di atas `#FEF2F2` (Rose)

## Alasan Keputusan Desain (R-31 One-Line Reasons)
1. **Warna Navy & Oranye:** Navy memberi kesan formal kontrak kerja, oranye mengarahkan perhatian pada persetujuan proposal.
2. **Tata Letak 2 Kolom:** Menghubungkan sumber data mentah di kiri langsung dengan output proposal tervalidasi di kanan.
3. **Tipografi Sans-Serif Standar:** Mengutamakan keterbacaan angka rupiah dan rincian pekerjaan teknis di berbagai ukuran layar.
4. **Spasi Terukur:** Mengelompokkan komponen terkait secara rapat dan memberi jeda jelas antar-tahapan verifikasi.
5. **Kartu Tanpa Bayangan Mengambang:** Mengurangi kelelahan visual dan memusatkan bayangan hanya pada lembar kertas Proposal A4.
6. **Ikon Kontekstual:** Ikon hanya digunakan untuk memperjelas makna aksi (cetak, salin, status) bukan sebagai hiasan.

