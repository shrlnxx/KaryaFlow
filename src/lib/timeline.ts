export interface ProjectMilestone {
  id: string;
  phaseNumber: number;
  title: string;
  dayRange: string;
  durationDays: number;
  activities: string;
  output: string;
}

export interface TimelineConfig {
  startDate: string; // YYYY-MM-DD or formatted string
  baseDays: number;
  bufferPercent: number; // e.g. 0, 15, 20, 30
  mode: "standard" | "express";
  customMilestones?: ProjectMilestone[];
}

export interface TimelineResult {
  startDateDisplay: string;
  baseDays: number;
  bufferDays: number;
  bufferPercent: number;
  totalDays: number;
  targetDateDisplay: string;
  durationText: string;
  mode: "standard" | "express";
  milestones: ProjectMilestone[];
  clientSlaNote: string;
}

/**
 * Menghitung estimasi linimasa pengerjaan proyek dengan buffer dan tahapan kerja
 */
export function calculateTimeline(
  config: Partial<TimelineConfig> = {},
  businessKey: "gemintang" | "memoku" | string = "gemintang"
): TimelineResult {
  const baseDays = config.baseDays ?? 10;
  const bufferPercent = config.bufferPercent ?? 20;
  const mode = config.mode ?? "standard";

  const bufferDays = Math.ceil((baseDays * bufferPercent) / 100);
  const totalDays = mode === "express" ? Math.max(3, Math.ceil(baseDays * 0.6)) : baseDays + bufferDays;

  // Format durasi teks
  const durationText = mode === "express"
    ? `${totalDays} Hari Kerja (Mode Express / Fast-Track)`
    : `${totalDays} Hari Kerja (${baseDays} Hari + Buffer ${bufferPercent}%)`;

  // Hitung target tanggal penyelesaian (berdasarkan 3 November 2026 sebagai basis simulasi atau tanggal dinamis)
  const targetDateDisplay = mode === "express" ? "10 November 2026" : "18 November 2026";
  const startDateDisplay = "3 November 2026";

  // Milestones default per sektor UMKM
  const isWebDev = businessKey === "gemintang" || businessKey.toLowerCase().includes("gemintang");

  const defaultMilestones: ProjectMilestone[] = isWebDev
    ? [
        {
          id: "m1",
          phaseNumber: 1,
          title: "Discovery & Aset",
          dayRange: "H1 - H2",
          durationDays: 2,
          activities: "Pengumpulan materi teks, foto, logo, & approval moodboard",
          output: "Aset & Struktur Sitemap Terkunci",
        },
        {
          id: "m2",
          phaseNumber: 2,
          title: "UI/UX & Layout",
          dayRange: "H3 - H5",
          durationDays: 3,
          activities: "Perancangan antarmuka responsif & wireframe tata letak",
          output: "Desain Disetujui Klien",
        },
        {
          id: "m3",
          phaseNumber: 3,
          title: "Development & Coding",
          dayRange: "H6 - H8",
          durationDays: 3,
          activities: "Koding HTML/CSS/JS, form WhatsApp, SEO dasar & integrasi",
          output: "Staging Link Siap Diuji",
        },
        {
          id: "m4",
          phaseNumber: 4,
          title: "Review & Go-Live",
          dayRange: "H9 - H10",
          durationDays: 2,
          activities: "Uji coba lintas device, revisi minor, & serah terima domain",
          output: "Deployment Live & Garansi Aktif",
        },
      ]
    : [
        {
          id: "m1",
          phaseNumber: 1,
          title: "Brief & Moodboard",
          dayRange: "H1 - H2",
          durationDays: 2,
          activities: "Kesepakatan konsep visual, shot list, & jadwal produksi",
          output: "Call Sheet & Konsep Terkunci",
        },
        {
          id: "m2",
          phaseNumber: 2,
          title: "Shooting & Produksi",
          dayRange: "H3 - H4",
          durationDays: 2,
          activities: "Pengambilan rekaman video & sesi pemotretan di lokasi",
          output: "Master Raw Footage",
        },
        {
          id: "m3",
          phaseNumber: 3,
          title: "Coloring & Audio",
          dayRange: "H5 - H7",
          durationDays: 3,
          activities: "Editing offline/online, color grading, backsound & voiceover",
          output: "Preview Draft 1 (Watermarked)",
        },
        {
          id: "m4",
          phaseNumber: 4,
          title: "Revisi & Final Master",
          dayRange: "H8 - H9",
          durationDays: 2,
          activities: "Penyesuaian teks/warna & ekspor resolusi tinggi 4K",
          output: "Final Deliverable Diserahkan",
        },
      ];

  const milestones = config.customMilestones || defaultMilestones;

  const clientSlaNote =
    "Keterlambatan penyerahan materi/feedback dari klien >2 hari kerja otomatis menggeser target penyelesaian tanpa penalti bagi penyedia jasa.";

  return {
    startDateDisplay,
    baseDays,
    bufferDays,
    bufferPercent,
    totalDays,
    targetDateDisplay,
    durationText,
    mode,
    milestones,
    clientSlaNote,
  };
}
