import { Sku } from "../lib/schemas";
import { QuotationInputItem } from "../lib/calculator";

export type UMKMKey = "gemintang" | "memoku";

export interface BriefChipItem {
  id: string;
  quote: string;
  speaker: "Klien" | "Saya";
  level: "merah" | "kuning" | "hijau";
  category: string;
  reason: string;
  context: string;
}

export interface WaQuestionItem {
  id: string;
  text: string;
  context: string;
  priority: "tinggi" | "sedang" | "rendah";
  checked: boolean;
}

export interface ScenarioProposal {
  title: string;
  client: string;
  duration: string;
  validity: string;
  exclusions: string[];
}

export interface ScopeGuardScenario {
  label: string;
  title: string;
  statusBadge: string;
  reason: string;
  extraCost: string;
  replyDraft: string;
}

export interface UMKMMockScenario {
  key: UMKMKey;
  name: string;
  sector: string;
  persona: string;
  sampleChat: string;
  policy: {
    revisiMayor: number;
    microChange: number;
    garansiHari: number;
  };
  briefChips: BriefChipItem[];
  waQuestions: WaQuestionItem[];
  initialItems: (QuotationInputItem & {
    id: string;
    deliverable: string;
  })[];
  proposal: ScenarioProposal;
  scopeScenarios: Record<
    "covered" | "out_of_scope" | "ambiguous",
    ScopeGuardScenario
  >;
}

export const MOCK_SCENARIOS: Record<UMKMKey, UMKMMockScenario> = {
  gemintang: {
    key: "gemintang",
    name: "Gemintang Production",
    sector: "Studio Pengembangan Web",
    persona: "Syahrul Hidayat (Gemintang Production / MemokuVisual)",
    sampleChat: `Klien: Halo Mas Dimas, mau buat website landing page 5 halaman responsif dengan formulir kontak terintegrasi tombol WhatsApp & Google Maps.
Klien: Desainnya harus estetik, kekinian, disukai Gen Z ya. Bahan teks dan foto produk menyusul saat pengerjaan.
Klien: Revisinya pokoknya bebas tanpa batas sampai cocok dan omset kami naik! Sekalian include integrasi payment gateway tanpa biaya langganan bulanan.`,
    policy: {
      revisiMayor: 2,
      microChange: 3,
      garansiHari: 14,
    },
    briefChips: [
      {
        id: "g-chip-1",
        quote: "Landing page 5 halaman responsif dengan formulir kontak terintegrasi",
        speaker: "Klien",
        level: "hijau",
        category: "Ruang Lingkup",
        reason: "Scope jelas terukur: 5 halaman web statis dengan komponen form kontak standar.",
        context: "Kebutuhan utama struktur website",
      },
      {
        id: "g-chip-2",
        quote: "Tombol direct WhatsApp chat & link Google Maps di bagian kontak",
        speaker: "Klien",
        level: "hijau",
        category: "Fitur",
        reason: "Spesifikasi fitur formulir dan navigasi terdefinisi jelas dalam paket standar.",
        context: "Fitur konektivitas kontak langsung",
      },
      {
        id: "g-chip-3",
        quote: "Desain harus estetik, kekinian, dan disukai audiens Gen Z",
        speaker: "Klien",
        level: "kuning",
        category: "Kriteria Visual",
        reason: "Subjektif: membutuhkan referensi acuan visual/moodboard tertulis dari klien.",
        context: "Ekspektasi visual tanpa acuan baku",
      },
      {
        id: "g-chip-4",
        quote: "Bahan materi teks & foto produk menyusul saat pengerjaan",
        speaker: "Klien",
        level: "kuning",
        category: "Timeline & Aset",
        reason: "Risiko penundaan pengerjaan: butuh tenggat waktu pasti penyerahan materi dari klien.",
        context: "Penyediaan aset materi proyek",
      },
      {
        id: "g-chip-5",
        quote: "Revisi bebas tanpa batas sampai cocok dan omset kami naik",
        speaker: "Klien",
        level: "merah",
        category: "Revisi & Garansi",
        reason: "Risiko Tinggi: metrik omset di luar kendali teknis dan revisi tanpa batas menggerus margin usaha.",
        context: "Klausul garansi hasil sepihak",
      },
      {
        id: "g-chip-6",
        quote: "Integrasi payment gateway tanpa biaya langganan bulanan",
        speaker: "Klien",
        level: "merah",
        category: "Scope Creep",
        reason: "Scope Creep: gateway pembayaran memerlukan legalitas merchant dan biaya transaksi per transaksi.",
        context: "Modul transaksi online kustom",
      },
    ],
    waQuestions: [
      {
        id: "gwq-1",
        text: "Apakah sudah ada referensi 2-3 tautan website acuan desain visual yang disepakati tim Kakak?",
        context: "Menghindari revisi subjektif akibat tafsir 'estetik & kekinian'",
        priority: "tinggi",
        checked: true,
      },
      {
        id: "gwq-2",
        text: "Kapan tanggal maksimal bahan materi teks dan foto produk diserahkan agar timeline pengerjaan tidak mundur?",
        context: "Mengunci SLA jadwal pengerjaan proyek",
        priority: "tinggi",
        checked: true,
      },
      {
        id: "gwq-3",
        text: "Kami batasi maksimal 2 putaran revisi minor sebelum serah terima serta garansi bug 14 hari, apakah sudah disetujui?",
        context: "Memproteksi kuota kerja agar tidak terjadi revisi tanpa akhir",
        priority: "tinggi",
        checked: true,
      },
    ],
    initialItems: [
      {
        id: "g-item-1",
        sku: "WEB-LP-01",
        name: "Landing Page Responsif",
        quantity: 1,
        deliverable: "5 Halaman Responsif + Form Kontak + Integrasi WA",
        notes: "Maksimal 2 putaran revisi minor dalam 7 hari kerja. Garansi bug 14 hari.",
      },
      {
        id: "g-item-2",
        sku: "WEB-ADD-PAGE",
        name: "Tambahan Halaman Statis",
        quantity: 2,
        deliverable: "2 Halaman Tambahan (Statis & Responsif)",
        notes: "1x penyesuaian per halaman.",
      },
      {
        id: "g-item-3",
        sku: "UNMAPPED",
        name: "Integrasi Payment Gateway Otomatis (QRIS / Midtrans)",
        quantity: 1,
        deliverable: "Koneksi API Midtrans / QRIS (Belum ada dokumen legalitas merchant)",
        notes: "Belum ada SKU di katalog resmi; perlu disepakati manual via WhatsApp.",
      },
    ],
    proposal: {
      title: "Pengembangan Website Profil & Katalog Layanan Usaha",
      client: "PT Sentosa Ekraf Jaya",
      duration: "10 Hari Kerja (+ Buffer 20%)",
      validity: "14 Hari Kalender",
      exclusions: [
        "Integrasi Payment Gateway otomatis tanpa lisensi merchant resmi",
        "Penulisan copywriting & penyediaan aset foto produk dari nol",
        "Biaya langganan domain dan server hosting tahunan",
      ],
    },
    scopeScenarios: {
      covered: {
        label: "Kasus Covered",
        title: "TERMASUK DALAM RUANG LINGKUP",
        statusBadge: "bg-emerald-100 text-emerald-900 border-emerald-300",
        reason: "Penggantian foto banner slider dan koreksi teks kontak termasuk dalam kuota 3x micro-change aktif.",
        extraCost: "Rp 0 (Termasuk dalam kuota)",
        replyDraft: "Halo Kak! Perubahan foto banner dan teks kontak ini langsung kami proses ya, sudah termasuk kuota revisi minor kita.",
      },
      out_of_scope: {
        label: "Kasus Out of Scope",
        title: "DI LUAR RUANG LINGKUP (SCOPE CREEP)",
        statusBadge: "bg-rose-100 text-rose-900 border-rose-300",
        reason: "Permintaan modul CMS Admin Panel dan akun membership berada di luar paket Landing Page yang disepakati.",
        extraCost: "+ Rp 1.000.000 (Add-on SKU WEB-ADD-CMS)",
        replyDraft: "Halo Kak! Untuk fitur CMS Admin Panel berada di luar paket Landing Page kita. Kami siapkan add-on resmi sebesar Rp 1.000.000 dengan estimasi penambahan 3 hari kerja. Boleh kami kirimkan addendum penawarannya?",
      },
      ambiguous: {
        label: "Kasus Ambigu",
        title: "PERLU KLARIFIKASI SPESIFIKASI",
        statusBadge: "bg-amber-100 text-amber-900 border-amber-300",
        reason: "Permintaan filter kategori produk. Jika penataan frontend statis dapat dicakup, namun jika butuh database pencarian dinamis masuk add-on.",
        extraCost: "Rp 0 s/d Rp 500.000 (Menunggu Konfirmasi)",
        replyDraft: "Halo Kak! Terkait filter kategori, apakah cukup pengelompokan tab sederhana di halaman (gratis), atau ada filter pencarian database? Kami cek dulu ya kak agar tidak menambah biaya jika ternyata sederhana.",
      },
    },
  },
  memoku: {
    key: "memoku",
    name: "MemokuVisual",
    sector: "Jasa Foto & Video Komersial",
    persona: "Syahrul Hidayat (Gemintang Production / MemokuVisual)",
    sampleChat: `Klien: Halo tim Memoku, mau dokumentasi peluncuran produk perawatan kulit half-day 4 jam di studio dan 1 video reels highlight 1 menit untuk media sosial.
Klien: Talent model & MUA disiapkan dari tim ya. Mood video sinematik mewah ala brand internasional ternama.
Klien: Revisi editing tidak terbatas sampai dipastikan viral di TikTok! Seluruh master file mentah RAW foto & video diserahkan gratis.`,
    policy: {
      revisiMayor: 2,
      microChange: 3,
      garansiHari: 7,
    },
    briefChips: [
      {
        id: "m-chip-1",
        quote: "Dokumentasi peluncuran produk perawatan kulit half-day 4 jam kerja",
        speaker: "Klien",
        level: "hijau",
        category: "Ruang Lingkup",
        reason: "Scope jelas terukur: 1 sesi liputan studio 4 jam kerja dengan target 80 foto edit.",
        context: "Alokasi durasi dan deliverable utama",
      },
      {
        id: "m-chip-2",
        quote: "Satu video highlight/aftermovie durasi 1 menit untuk media sosial",
        speaker: "Klien",
        level: "hijau",
        category: "Deliverable Video",
        reason: "Spesifikasi video pendek komersial 1 menit terdefinisi jelas dalam katalog.",
        context: "Output konten video media sosial",
      },
      {
        id: "m-chip-3",
        quote: "Talent model & penata rias disiapkan dari tim MemokuVisual",
        speaker: "Klien",
        level: "kuning",
        category: "Aset Pihak Ketiga",
        reason: "Perlu konfirmasi: kriteria talent, honor talent model, dan jadwal rias belum disepakati.",
        context: "Kebutuhan talent luar studio",
      },
      {
        id: "m-chip-4",
        quote: "Mood video sinematik mewah ala brand kecantikan internasional ternama",
        speaker: "Klien",
        level: "kuning",
        category: "Ekspektasi Visual",
        reason: "Subjektif: butuh referensi video acuan/storyboard sebelum hari shooting.",
        context: "Gaya sinematografi tanpa storyboard tertulis",
      },
      {
        id: "m-chip-5",
        quote: "Revisi editing video tidak terbatas sampai dipastikan viral di TikTok",
        speaker: "Klien",
        level: "merah",
        category: "Klausul Performa",
        reason: "Risiko Tinggi: metrik algoritma viralitas media sosial di luar tanggung jawab tim produksi.",
        context: "Jaminan hasil di luar kendali teknis",
      },
      {
        id: "m-chip-6",
        quote: "Seluruh master file mentah RAW foto & video diserahkan gratis",
        speaker: "Klien",
        level: "merah",
        category: "Scope Creep",
        reason: "Scope Creep: master file mentah RAW memiliki nilai hak cipta master dan lisensi terpisah.",
        context: "Permintaan master file tanpa biaya lisensi",
      },
    ],
    waQuestions: [
      {
        id: "mwq-1",
        text: "Apakah tim klien yang menyediakan talent model dan MUA, atau butuh casting dari kami dengan biaya terpisah?",
        context: "Memisahkan honor talent pihak ketiga dari biaya jasa tim kamera",
        priority: "tinggi",
        checked: true,
      },
      {
        id: "mwq-2",
        text: "Apakah ada link 1-2 video acuan yang disepakati bersama untuk tempo editing dan mood warna?",
        context: "Mencegah rombak total alur editing pasca produksi",
        priority: "tinggi",
        checked: true,
      },
      {
        id: "mwq-3",
        text: "Deliverable video final berupa MP4 4K color-graded; penyerahan seluruh file mentah RAW memerlukan lisensi terpisah ya Kak?",
        context: "Menegaskan batas hak cipta master file sesuai klausul katalog",
        priority: "tinggi",
        checked: true,
      },
    ],
    initialItems: [
      {
        id: "m-item-1",
        sku: "FOTO-EVT-01",
        name: "Dokumentasi Event Half-Day 4 Jam",
        quantity: 1,
        deliverable: "4 Jam Liputan, 80 Foto Color-Graded, Maks 1x Revisi Warna",
        notes: "Maksimal 1x revisi minor warna dalam 7 hari.",
      },
      {
        id: "m-item-2",
        sku: "VID-HIGH-01",
        name: "Video Aftermovie / Highlight 1 Menit",
        quantity: 1,
        deliverable: "1 Video 60 Detik, Audio Berlisensi, Maks 2x Revisi Cut/Color",
        notes: "Maksimal 2x revisi minor cut/color.",
      },
      {
        id: "m-item-3",
        sku: "UNMAPPED",
        name: "Talent Model & Penata Rias (MUA)",
        quantity: 1,
        deliverable: "1 Talent Model + 1 Penata Rias Profesional (Menunggu Kriteria Klien)",
        notes: "Belum ada SKU di katalog resmi; perlu disepakati manual via WhatsApp.",
      },
    ],
    proposal: {
      title: "Produksi Video Reels & Dokumentasi Foto Produk Komersial",
      client: "GlowNatural Beauty (Contoh Simulasi)",
      duration: "5 Hari Kerja Pasca Shooting",
      validity: "7 Hari Kalender",
      exclusions: [
        "Pengambilan gambar udara (Drone)",
        "Cetak album fisik & bingkai",
        "Penyerahan master file mentah RAW tanpa lisensi terpisah",
        "Jaminan viralitas atau metrik performa media sosial",
      ],
    },
    scopeScenarios: {
      covered: {
        label: "Kasus Covered",
        title: "TERMASUK DALAM RUANG LINGKUP",
        statusBadge: "bg-emerald-100 text-emerald-900 border-emerald-300",
        reason: "Permintaan penyesuaian font judul teks dan pemotongan durasi jeda klip detik ke-10 masuk dalam kuota revisi minor.",
        extraCost: "Rp 0 (Termasuk dalam kuota)",
        replyDraft: "Halo Kak! Penyesuaian font judul teks dan timing klip detik ke-10 langsung kami proses ya kak, ini masuk kuota revisi minor kita.",
      },
      out_of_scope: {
        label: "Kasus Out of Scope",
        title: "DI LUAR RUANG LINGKUP (SCOPE CREEP)",
        statusBadge: "bg-rose-100 text-rose-900 border-rose-300",
        reason: "Klien meminta penyerahan seluruh file mentah RAW 4K tanpa lisensi dan tambahan 2 jam lembur shooting di lokasi.",
        extraCost: "+ Rp 800.000 (Add-on ADD-RAW-01 + ADD-HOUR-01)",
        replyDraft: "Halo Kak! Untuk penyerahan file mentah RAW dan lembur shooting belum termasuk di paket kemarin ya kak. Kami siapkan add-on resmi serah terima RAW (Rp 500.000) dan overtime 1 jam (Rp 300.000). Boleh kami kirimkan invoicenya?",
      },
      ambiguous: {
        label: "Kasus Ambigu",
        title: "PERLU KLARIFIKASI SPESIFIKASI",
        statusBadge: "bg-amber-100 text-amber-900 border-amber-300",
        reason: "Klien meminta video dipotong menjadi versi Story 15 detik. Jika hanya potongan klip tengah gratis, jika butuh alur cerita dan opening terpisah perlu add-on mini.",
        extraCost: "Rp 0 s/d Rp 350.000 (Menunggu Format)",
        replyDraft: "Halo Kak! Untuk potongan versi Story 15 detik, apakah cukup potongan klip tengah dari video 1 menit kita (gratis), atau butuh alur cerita baru? Jika cukup potongan klip siap langsung kami berikan gratis kak!",
      },
    },
  },
};

