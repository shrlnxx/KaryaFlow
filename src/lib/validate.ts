import {
  AnalysisResult,
  CatalogItem,
  ProposedItem,
  ScopeGuardResult,
  ScopeVerdict,
} from "@/types";

const PRICE_REGEX = /(?:Rp\s?\.?\d[\d.,]*|\b\d+[\s-]*(?:rb|ribu|jt|juta|k|rupiah)\b)/gi;

/**
 * Membersihkan angka nominal harga yang mungkin dikarang oleh AI (PRD B7 Aturan 6).
 */
export function sanitizeAiText(text: string): string {
  if (!text) return "";
  return text.replace(PRICE_REGEX, " [⚠ nominal dihapus] ");
}

/**
 * Validasi dan pembersihan hasil analisis dari AI terhadap aturan bisnis sistem.
 */
export function validateAnalysisResult(
  rawResult: Partial<AnalysisResult>,
  catalog: CatalogItem[]
): AnalysisResult {
  const catalogIds = new Set(catalog.map((c) => c.id));

  // 1. Sanitasi Ringkasan
  const summary = sanitizeAiText(rawResult.summary || "Analisis kebutuhan klien selesai.");

  // 2. Sanitasi Marks
  const marks = (rawResult.marks || []).map((m, idx) => ({
    quote: m.quote || "",
    messageIndex: typeof m.messageIndex === "number" ? m.messageIndex : idx + 1,
    level: (["merah", "kuning", "hijau"].includes(m.level) ? m.level : "kuning") as
      | "merah"
      | "kuning"
      | "hijau",
    reason: sanitizeAiText(m.reason || "Kutipan dari kebutuhan klien"),
    verified: false,
  }));

  // 3. Sanitasi & Pemetaan Katalog Items
  const items: ProposedItem[] = (rawResult.items || []).map((item) => {
    let validCatalogId: string | null = null;
    let unit = "item";
    let status: "ok" | "perlu_dikonfirmasi" = "perlu_dikonfirmasi";

    if (item.catalogItemId && catalogIds.has(item.catalogItemId)) {
      validCatalogId = item.catalogItemId;
      const foundCat = catalog.find((c) => c.id === validCatalogId);
      unit = foundCat?.unit || "item";
      if (foundCat?.unitPrice !== null && foundCat?.unitPrice !== undefined) {
        status = "ok";
      }
    }

    // Validasi kuantitas (B7 Aturan 4: 0 < qty <= 1000)
    let quantity: number | null = null;
    if (typeof item.quantity === "number" && item.quantity > 0 && item.quantity <= 1000) {
      quantity = Math.round(item.quantity * 10) / 10;
    } else {
      status = "perlu_dikonfirmasi";
    }

    return {
      catalogItemId: validCatalogId,
      label: sanitizeAiText(item.label || "Item Pekerjaan"),
      quantity,
      unit,
      deliverable: sanitizeAiText(item.deliverable || "Spesifikasi item pekerjaan"),
      sourceQuote: item.sourceQuote || "",
      notes: sanitizeAiText(item.notes || ""),
      status,
    };
  });

  // 4. Pertanyaan Klarifikasi
  const questions = (rawResult.questions || []).map((q) => ({
    question: sanitizeAiText(q.question || ""),
    why: sanitizeAiText(q.why || ""),
    priority: (["tinggi", "sedang", "rendah"].includes(q.priority)
      ? q.priority
      : "sedang") as "tinggi" | "sedang" | "rendah",
    checked: true,
  }));

  // 5. Exclusions & Assumptions
  const exclusions = (rawResult.exclusions || []).map((e) => sanitizeAiText(e));
  const assumptions = (rawResult.assumptions || []).map((a) => sanitizeAiText(a));
  const requirements = (rawResult.requirements || []).map((r) => ({
    text: sanitizeAiText(r.text || ""),
    sourceQuote: r.sourceQuote || "",
  }));

  return {
    summary,
    marks,
    requirements,
    questions,
    items,
    exclusions,
    assumptions,
  };
}

/**
 * Validasi hasil Scope Guard (PRD B7 Aturan 5 & 6).
 */
export function validateScopeGuardResult(
  rawResult: Partial<ScopeGuardResult>,
  approvedItemIds: string[]
): ScopeGuardResult {
  let verdict: ScopeVerdict =
    rawResult.verdict === "tercakup" ||
    rawResult.verdict === "di_luar_scope" ||
    rawResult.verdict === "perlu_klarifikasi"
      ? rawResult.verdict
      : "perlu_klarifikasi";

  let reason = sanitizeAiText(rawResult.reason || "");
  const replyDraft = sanitizeAiText(rawResult.replyDraft || "");

  const matchedItemIds: string[] = [];
  const validSet = new Set(approvedItemIds);

  for (const id of rawResult.matchedItemIds || []) {
    if (validSet.has(id)) {
      matchedItemIds.push(id);
    }
  }

  // Aturan B7.5: Jika verdict bukan 'perlu_klarifikasi' namun matchedItemIds kosong
  // turunkan verdict menjadi 'perlu_klarifikasi'
  if (verdict !== "perlu_klarifikasi" && matchedItemIds.length === 0) {
    verdict = "perlu_klarifikasi";
    reason += " (⚠ Catatan Sistem: Dasar scope awal tidak terverifikasi secara otomatis).";
  }

  const suggestedExtraItems = (rawResult.suggestedExtraItems || []).map((item) => ({
    catalogItemId: item.catalogItemId || null,
    label: sanitizeAiText(item.label || "Tambahan Layanan"),
    quantity: typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1,
    estimatedCost: null,
  }));

  return {
    verdict,
    reason,
    matchedItemIds,
    replyDraft,
    suggestedExtraItems,
  };
}

