import { CatalogItem } from "../types";

export const WEBSITE_CATALOG: CatalogItem[] = [
  {
    id: "web_halaman_statis",
    name: "Halaman Web Responsif (Statis)",
    description: "Desain visual modern, mobile friendly, optimasi SEO dasar",
    unit: "halaman",
    unitPrice: 500000,
    hoursPerUnit: 6,
    keywords: ["halaman", "landing page", "tentang kami", "layanan", "kontak"],
  },
  {
    id: "web_fitur_formulir",
    name: "Formulir Kontak & Integrasi WA",
    description: "Formulir validasi terhubung WhatsApp & Google Maps",
    unit: "fitur",
    unitPrice: 400000,
    hoursPerUnit: 4,
    keywords: ["form", "whatsapp", "chat", "kontak", "maps"],
  },
  {
    id: "web_fitur_login",
    name: "Autentikasi Akun / Login",
    description: "Fitur register, login, reset password, dan role user",
    unit: "fitur",
    unitPrice: 1200000,
    hoursPerUnit: 14,
    keywords: ["login", "akun", "user", "autentikasi", "portal"],
  },
  {
    id: "web_integrasi_pembayaran",
    name: "Integrasi Payment Gateway",
    description: "Midtrans / Xendit / Tripay checkout QRIS & Virtual Account",
    unit: "fitur",
    unitPrice: null, // Perlu dikonfirmasi
    hoursPerUnit: null,
    keywords: ["payment", "gateway", "pembayaran", "qris", "checkout"],
  },
  {
    id: "web_paket_revisi",
    name: "Paket Revisi Tambahan (Di luar kuota)",
    description: "Revisi desain atau konten di luar 2x putaran mayor",
    unit: "paket",
    unitPrice: 350000,
    hoursPerUnit: 4,
    keywords: ["revisi", "perubahan", "ganti", "tambah revisi"],
  },
];

export const FOTOGRAFI_CATALOG: CatalogItem[] = [
  {
    id: "foto_sesi_per_jam",
    name: "Sesi Foto / Video di Studio",
    description: "Peralatan lighting standar, kamera pro, pengarah gaya",
    unit: "sesi",
    unitPrice: 1500000,
    hoursPerUnit: 6,
    keywords: ["sesi", "studio", "shooting", "take", "jam"],
  },
  {
    id: "foto_edit_per_foto",
    name: "Color Grading & Retouching Video",
    description: "Penyuntingan video reels 30-60 detik dengan audio lisensi",
    unit: "video",
    unitPrice: 750000,
    hoursPerUnit: 5,
    keywords: ["edit", "reels", "video", "grading", "retouch"],
  },
  {
    id: "foto_file_mentah",
    name: "Lisensi Penyerahan File RAW 4K",
    description: "Hak kepemilikan dan penyerahan seluruh file footage mentah",
    unit: "paket",
    unitPrice: 1000000,
    hoursPerUnit: 2,
    keywords: ["raw", "file mentah", "footage", "master"],
  },
  {
    id: "foto_asisten_tambahan",
    name: "Talent Model & MUA Tambahan",
    description: "Model talent profesional dan make up artist on set",
    unit: "orang",
    unitPrice: null, // Perlu dikonfirmasi
    hoursPerUnit: null,
    keywords: ["talent", "model", "mua", "make up", "kostum"],
  },
];
