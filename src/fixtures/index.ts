import { AnalysisResult, ScopeGuardResult, ServiceMode } from "@/types";

export interface FixtureScenario {
  id: string;
  title: string;
  serviceMode: ServiceMode;
  clientName: string;
  businessName: string;
  sampleChat: string;
  analysis: AnalysisResult;
  scopeGuardExample: {
    requestText: string;
    result: ScopeGuardResult;
  };
}

export const FIXTURE_GEMINTANG_WEB: FixtureScenario = {
  id: "fixture_web_gemintang",
  title: "Gemintang Production — Website Profil & Form",
  serviceMode: "website",
  clientName: "PT Sentosa Ekraf Jaya",
  businessName: "Gemintang Production",
  sampleChat: `[30/10/26 09.15] Klien: Halo Mas Dimas, mau tanya bikin website landing page 5 halaman responsif berapa ya?
[30/10/26 09.18] Dimas: Halo Kak! Siap, untuk landing page 5 halaman responsif include form kontak sekitar 2.5jt.
[30/10/26 09.22] Klien: Mau ada tombol integrasi direct WhatsApp chat & link Google Maps ya di kontaknya.
[30/10/26 09.24] Dimas: Bisa kak, sudah include form kontak terintegrasi.
[30/10/26 10.05] Klien: Desainnya harus estetik, kekinian, dan disukai audiens Gen Z ya mas.
[30/10/26 10.15] Klien: Bahan copywriting & foto produk nanti menyusul saat pengerjaan webnya ya mas.
[30/10/26 14.30] Klien: Sama revisinya pokoknya bebas tanpa batas ya sampai kami cocok dan omset kami naik!
[30/10/26 14.40] Dimas: Aman kak, bisa kok kak.
[30/10/26 16.00] Klien: Oya sekalian include integrasi payment gateway ya tanpa biaya langganan bulanan.`,
  analysis: {
    summary:
      "Permintaan pembuatan landing page profil usaha 5 halaman responsif dengan tombol WA dan Google Maps. Terdeteksi klausul revisi tanpa batas dan integrasi payment gateway yang berisiko scope creep.",
    marks: [
      {
        quote: "Landing page 5 halaman responsif",
        messageIndex: 1,
        level: "hijau",
        reason: "Scope jelas terukur: 5 halaman web statis.",
        verified: true,
      },
      {
        quote: "Tombol integrasi direct WhatsApp chat & link Google Maps",
        messageIndex: 3,
        level: "hijau",
        reason: "Spesifikasi fitur formulir dan navigasi terdefinisi jelas.",
        verified: true,
      },
      {
        quote: "Desainnya harus estetik, kekinian, dan disukai audiens Gen Z",
        messageIndex: 5,
        level: "kuning",
        reason: "Kriteria estetika subjektif: butuh referensi acuan visual tertulis dari klien.",
        verified: true,
      },
      {
        quote: "Bahan copywriting & foto produk nanti menyusul saat pengerjaan",
        messageIndex: 6,
        level: "kuning",
        reason: "Potensi hambatan timeline: butuh tanggal pasti penyerahan materi dari klien.",
        verified: true,
      },
      {
        quote: "Revisinya pokoknya bebas tanpa batas ya sampai kami cocok dan omset kami naik",
        messageIndex: 7,
        level: "merah",
        reason: "Risiko Tinggi: klaim revisi tanpa batas dan janji hasil omset di luar kendali teknis.",
        verified: true,
      },
      {
        quote: "Sekalian include integrasi payment gateway ya tanpa biaya langganan bulanan",
        messageIndex: 9,
        level: "merah",
        reason: "Scope Creep: payment gateway membutuhkan akun legal merchant dan biaya MDR per transaksi.",
        verified: true,
      },
    ],
    requirements: [
      {
        text: "Website landing page 5 halaman responsif",
        sourceQuote: "landing page 5 halaman responsif",
      },
      {
        text: "Integrasi tombol WhatsApp dan lokasi Google Maps",
        sourceQuote: "tombol integrasi direct WhatsApp chat & link Google Maps",
      },
    ],
    questions: [
      {
        question: "Apakah sudah ada dokumen brand guideline atau 2-3 contoh website referensi acuan visual?",
        why: "Mencegah perbedaan persepsi desain estetik dan kekinian.",
        priority: "tinggi",
        checked: true,
      },
      {
        question: "Kapan tanggal maksimal seluruh bahan teks copywriting dan foto produk diserahkan?",
        why: "Menjaga timeline pengerjaan agar tidak tertunda.",
        priority: "tinggi",
        checked: true,
      },
      {
        question: "Kami membatasi 2x putaran revisi mayor dan 3x revisi minor sebelum serah terima, apakah sudah sesuai?",
        why: "Mengunci batasan revisi kerja.",
        priority: "tinggi",
        checked: true,
      },
    ],
    items: [
      {
        catalogItemId: "web_halaman_statis",
        label: "Halaman Web Responsif (Statis)",
        quantity: 5,
        unit: "halaman",
        deliverable: "5 Halaman (Beranda, Tentang Kami, Layanan, Portofolio, Kontak)",
        sourceQuote: "landing page 5 halaman responsif",
        notes: "Optimasi mobile dan desktop standar",
        status: "ok",
      },
      {
        catalogItemId: "web_fitur_formulir",
        label: "Formulir Kontak & Integrasi WA",
        quantity: 1,
        unit: "fitur",
        deliverable: "Tombol direct WhatsApp & embed Google Maps",
        sourceQuote: "tombol integrasi direct WhatsApp chat & link Google Maps",
        notes: "Form kontak terverifikasi",
        status: "ok",
      },
      {
        catalogItemId: "web_paket_revisi",
        label: "Paket Proteksi Revisi & Garansi",
        quantity: 1,
        unit: "paket",
        deliverable: "2x Putaran Revisi Mayor + 3x Minor + Garansi 14 Hari",
        sourceQuote: "revisinya pokoknya bebas tanpa batas",
        notes: "Menggantikan permintaan revisi bebas",
        status: "ok",
      },
      {
        catalogItemId: "web_integrasi_pembayaran",
        label: "Integrasi Payment Gateway",
        quantity: 1,
        unit: "fitur",
        deliverable: "Koneksi gateway pembayaran QRIS",
        sourceQuote: "integrasi payment gateway ya tanpa biaya langganan bulanan",
        notes: "Membutuhkan verifikasi dokumen legal dari klien",
        status: "perlu_dikonfirmasi",
      },
    ],
    exclusions: [
      "Penyediaan dan penulisan copywriting konten dari nol",
      "Biaya langganan domain dan hosting tahunan",
      "Revisi tanpa batas setelah serah terima proyek",
      "Penjaminan kenaikan omset bisnis",
    ],
    assumptions: [
      "Klien menyerahkan aset foto dan teks maksimal 3 hari kerja setelah pembayaran DP",
      "Format desain disetujui bertahap (wireframe -> visual)",
    ],
  },
  scopeGuardExample: {
    requestText: "Mas Dimas, tolong sekalian buatin sistem dashboard login multi-vendor ya di websitenya.",
    result: {
      verdict: "di_luar_scope",
      reason: "Permintaan modul dashboard multi-vendor berada di luar ruang lingkup proposal website profil statis yang telah disepakati.",
      matchedItemIds: ["web_halaman_statis", "web_fitur_formulir"],
      replyDraft:
        "Halo Kak! Untuk sistem dashboard login multi-vendor belum tercakup di proposal awal kita ya kak. Jika ingin ditambahkan, kami siapkan penawaran add-on modul login & user portal resmi. Boleh kami buatkan rinciannya?",
      suggestedExtraItems: [
        {
          catalogItemId: "web_fitur_login",
          label: "Autentikasi Akun & Dashboard Pengguna",
          quantity: 1,
        },
      ],
    },
  },
};

export const FIXTURE_MEMOKU_FOTO: FixtureScenario = {
  id: "fixture_foto_memoku",
  title: "MemokuVisual — Video Reels & Foto Skincare",
  serviceMode: "fotografi",
  clientName: "GlowNatural Beauty",
  businessName: "MemokuVisual",
  sampleChat: `[01/11/26 11.00] Klien: Siang Mas Rian, kami butuh video reels 30 detik untuk peluncuran produk skincare lokal baru.
[01/11/26 11.05] Rian: Siang Kak! Siap, untuk reels produk komersial standar kami include 1 sesi studio ya.
[01/11/26 11.10] Klien: Iya shooting 1 hari maksimal 6 jam di studio Jakarta Selatan ya mas.
[01/11/26 11.15] Klien: Model talent dan penata rias MUA tolong disiapkan dari tim Memoku ya.
[01/11/26 11.30] Klien: Mood videonya harus sinematik mewah seperti iklan brand internasional.
[01/11/26 13.00] Klien: Revisinya pokoknya nggak terbatas ya sampai videonya dipastikan viral di TikTok!
[01/11/26 13.20] Klien: Seluruh file mentah RAW 4K seluruh footage nanti wajib diserahkan juga tanpa biaya tambahan.`,
  analysis: {
    summary:
      "Permintaan produksi video reels produk 30 detik di studio selama 6 jam. Teridentifikasi klausul revisi sampai viral dan permintaan penyerahan file mentah RAW 4K tanpa biaya.",
    marks: [
      {
        quote: "Video reels 30 detik untuk peluncuran produk skincare lokal",
        messageIndex: 1,
        level: "hijau",
        reason: "Deliverable jelas: 1 video reels komersial 30 detik.",
        verified: true,
      },
      {
        quote: "Shooting 1 hari maksimal 6 jam di studio Jakarta Selatan",
        messageIndex: 3,
        level: "hijau",
        reason: "Alokasi waktu dan lokasi terdefinisi spesifik.",
        verified: true,
      },
      {
        quote: "Model talent dan penata rias MUA tolong disiapkan dari tim Memoku",
        messageIndex: 4,
        level: "kuning",
        reason: "Item pihak ketiga: butuh konfirmasi kriteria talent dan biaya honor terpisah.",
        verified: true,
      },
      {
        quote: "Mood videonya harus sinematik mewah seperti iklan brand internasional",
        messageIndex: 5,
        level: "kuning",
        reason: "Kriteria gaya subjektif: butuh referensi video acuan visual disepakati.",
        verified: true,
      },
      {
        quote: "Revisinya pokoknya nggak terbatas ya sampai videonya dipastikan viral di TikTok",
        messageIndex: 6,
        level: "merah",
        reason: "Risiko Tinggi: viralitas konten merupakan metrik algoritma di luar tanggung jawab tim produksi.",
        verified: true,
      },
      {
        quote: "Seluruh file mentah RAW 4K seluruh footage nanti wajib diserahkan juga tanpa biaya tambahan",
        messageIndex: 7,
        level: "merah",
        reason: "Scope Creep: file mentah RAW memiliki hak cipta master dan lisensi terpisah.",
        verified: true,
      },
    ],
    requirements: [
      {
        text: "1 Video reels 30 detik dengan color grading",
        sourceQuote: "video reels 30 detik",
      },
      {
        text: "Sesi studio maksimal 6 jam di Jakarta Selatan",
        sourceQuote: "shooting 1 hari maksimal 6 jam di studio",
      },
    ],
    questions: [
      {
        question: "Apakah talent model dan MUA disediakan klien atau memerlukan casting khusus dari kami dengan biaya terpisah?",
        why: "Menghindari selisih biaya pihak ketiga yang belum dianggarkan.",
        priority: "tinggi",
        checked: true,
      },
      {
        question: "Apakah ada link 1-2 contoh video Reels yang disepakati sebagai acuan gaya transisi & grading warna?",
        why: "Memastikan ekspektasi visual sinematik terarah sebelum proses shooting.",
        priority: "tinggi",
        checked: true,
      },
      {
        question: "Output final berupa video MP4 4K; penyerahan file mentah RAW membutuhkan lisensi master footage terpisah, apakah berkenan?",
        why: "Menjaga hak cipta dan nilai aset mentah studio.",
        priority: "tinggi",
        checked: true,
      },
    ],
    items: [
      {
        catalogItemId: "foto_sesi_per_jam",
        label: "Sesi Studio Video (6 Jam)",
        quantity: 1,
        unit: "sesi",
        deliverable: "1 Sesi Studio di Jakarta Selatan dengan lighting & kamera pro",
        sourceQuote: "shooting 1 hari maksimal 6 jam di studio",
        notes: "Maksimal 6 jam kerja",
        status: "ok",
      },
      {
        catalogItemId: "foto_edit_per_foto",
        label: "Penyuntingan Video Reels 30 Detik",
        quantity: 1,
        unit: "video",
        deliverable: "Color grading, sound effect, musik komersial berlisensi",
        sourceQuote: "video reels 30 detik",
        notes: "Format portrait 9:16",
        status: "ok",
      },
      {
        catalogItemId: "foto_paket_revisi_edit",
        label: "Paket Revisi Editing Standar",
        quantity: 1,
        unit: "paket",
        deliverable: "2x Putaran Revisi Cut/Timing + 3x Minor Audio",
        sourceQuote: "revisinya pokoknya nggak terbatas",
        notes: "Menggantikan klausul revisi tidak terbatas",
        status: "ok",
      },
      {
        catalogItemId: "foto_asisten_tambahan",
        label: "Talent Model & MUA Eksternal",
        quantity: 1,
        unit: "orang",
        deliverable: "1 Talent Model + 1 MUA Standby",
        sourceQuote: "model talent dan penata rias MUA tolong disiapkan",
        notes: "Menunggu pemilihan talent oleh klien",
        status: "perlu_dikonfirmasi",
      },
    ],
    exclusions: [
      "Penyerahan seluruh file mentah master RAW 4K tanpa biaya lisensi",
      "Penjaminan jumlah penonton (views) dan viralitas di media sosial",
      "Pengulangan sesi shooting akibat ketidakhadiran talent klien",
    ],
    assumptions: [
      "Produk fisik skincare sudah tiba di studio H-1 sebelum hari shooting",
      "Storyboard dan moodboard disetujui sebelum shooting dimulai",
    ],
  },
  scopeGuardExample: {
    requestText: "Mas Rian, tolong sekalian shooting outdoor di pantai Bogor pada hari berbeda tanpa biaya tambahan ya.",
    result: {
      verdict: "di_luar_scope",
      reason: "Penambahan hari shooting di luar studio dan luar kota tidak termasuk dalam paket sesi studio Jakarta Selatan yang telah disetujui.",
      matchedItemIds: ["foto_sesi_per_jam"],
      replyDraft:
        "Halo Kak! Untuk tambahan hari shooting outdoor di luar kota belum termasuk dalam paket studio kita kemarin ya kak. Kami memiliki paket add-on sesi outdoor seharga Rp 1.500.000 sudah termasuk kru dan transport. Boleh kami kirimkan jadwal opsinya?",
      suggestedExtraItems: [
        {
          catalogItemId: "foto_lokasi_luar_kota",
          label: "Sesi Tambahan Outdoor Luar Kota",
          quantity: 1,
        },
      ],
    },
  },
};

export const ALL_FIXTURES: FixtureScenario[] = [
  FIXTURE_GEMINTANG_WEB,
  FIXTURE_MEMOKU_FOTO,
];

