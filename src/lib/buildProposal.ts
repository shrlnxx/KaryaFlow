import { ApprovedAnalysis } from "@/types";
import { formatRupiah } from "./calculate";

export interface ProposalHeader {
  businessName: string;
  businessContact: string;
  proposalNumber: string;
  date: string;
  validityDays: number;
}

export interface ProposalClientInfo {
  clientName: string;
  companyName: string;
  projectTitle: string;
}

export interface ProposalModel {
  header: ProposalHeader;
  client: ProposalClientInfo;
  executiveSummary: {
    totalFormatted: string;
    dpFormatted: string;
    settlementFormatted: string;
    estimatedDuration: string;
    unconfirmedNotice?: string;
  };
  deliverables: {
    label: string;
    spec: string;
    quantity: string;
    subtotal: string;
  }[];
  scopeProtections: {
    maxMajorRevisions: number;
    maxMicroChanges: number;
    warrantyDays: number;
    additionalRevisionCostText: string;
  };
  exclusions: string[];
  assumptions: string[];
  paymentTerms: string;
  hasUnfilledPlaceholders: boolean;
  unfilledPlaceholders: string[];
}

/**
 * Membangun model dokumen proposal A4 dari data yang sudah disetujui (PRD B11 / T10).
 */
export function buildProposal(
  approved: ApprovedAnalysis,
  clientInfo?: Partial<ProposalClientInfo>,
  headerInfo?: Partial<ProposalHeader>
): ProposalModel {
  const estimate = approved.estimate;
  const analysis = approved.analysis;

  const dpAmount = Math.round(estimate.total * 0.5);
  const settlementAmount = estimate.total - dpAmount;

  const dateStr =
    headerInfo?.date ||
    new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const header: ProposalHeader = {
    businessName: headerInfo?.businessName || "Karya Studio Kreatif",
    businessContact: headerInfo?.businessContact || "halo@karyastudio.id | 0812-3456-7890",
    proposalNumber: headerInfo?.proposalNumber || `PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: dateStr,
    validityDays: headerInfo?.validityDays || 14,
  };

  const client: ProposalClientInfo = {
    clientName: clientInfo?.clientName || "Bapak/Ibu Klien",
    companyName: clientInfo?.companyName || "Perusahaan Mitra Ekraf",
    projectTitle: clientInfo?.projectTitle || "Pengembangan Proyek Kreatif & Digital",
  };

  const deliverables = estimate.lines.map((line) => {
    const rawItem = analysis.items.find((i) => i.label === line.label);
    return {
      label: line.label,
      spec: rawItem?.deliverable || "Spesifikasi deliverable standar",
      quantity: `${line.quantity} ${rawItem?.unit || "unit"}`,
      subtotal: line.subtotal !== null ? formatRupiah(line.subtotal) : "Perlu Dikonfirmasi",
    };
  });

  // Cari placeholder berkurung siku seperti [isi jumlah revisi]
  const fullTextScan = JSON.stringify({
    client,
    deliverables,
    exclusions: analysis.exclusions,
    assumptions: analysis.assumptions,
  });

  const placeholderMatches = fullTextScan.match(/\[([a-zA-Z0-9_\s-]{2,40})\]/g) || [];
  const unfilledPlaceholders = Array.from(new Set(placeholderMatches)).filter(
    (p) => !["[TELEPON]", "[EMAIL]", "[LINK]", "[NOMOR_ID]", "[REKENING]"].includes(p)
  );

  return {
    header,
    client,
    executiveSummary: {
      totalFormatted: formatRupiah(estimate.total),
      dpFormatted: formatRupiah(dpAmount),
      settlementFormatted: formatRupiah(settlementAmount),
      estimatedDuration: `${estimate.durationWorkdays} Hari Kerja (${estimate.totalHours} Jam + Buffer ${estimate.bufferPct}%)`,
      unconfirmedNotice:
        estimate.unconfirmedCount > 0
          ? `Terdapat ${estimate.unconfirmedCount} item yang belum memiliki tarif tetap.`
          : undefined,
    },
    deliverables,
    scopeProtections: {
      maxMajorRevisions: 2,
      maxMicroChanges: 3,
      warrantyDays: 14,
      additionalRevisionCostText: "Dikenakan biaya paket revisi add-on sesuai katalog tarif.",
    },
    exclusions:
      analysis.exclusions.length > 0
        ? analysis.exclusions
        : ["Penambahan fitur di luar daftar spesifikasi di atas", "Penyediaan konten copywriting dan aset materi dari nol"],
    assumptions:
      analysis.assumptions.length > 0
        ? analysis.assumptions
        : ["Klien menyediakan materi teks dan foto dalam kurun waktu 3 hari setelah DP dibayarkan"],
    paymentTerms:
      "Termin Pembayaran: Uang Muka (DP) 50% sebelum pekerjaan dimulai, dan Pelunasan 50% setelah penyerahan hasil sebelum file final/live diserahkan.",
    hasUnfilledPlaceholders: unfilledPlaceholders.length > 0,
    unfilledPlaceholders,
  };
}

