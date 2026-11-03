import { z } from "zod";
import catalogData from "../data/catalog.json";

// ==========================================
// 1. SKU ENUM OTOMATIS BERDASARKAN CATALOG.JSON
// ==========================================

// Mengambil seluruh SKU resmi dari catalog.json secara otomatis
const catalogSkus = catalogData.items.map((item) => item.sku) as [string, ...string[]];

// Enum SKU Zod: Seluruh SKU terdaftar + "UNMAPPED" untuk item kustom/belum terpetakan
export const SkuEnum = z.enum([...catalogSkus, "UNMAPPED"] as [string, ...string[]]);
export type Sku = z.infer<typeof SkuEnum>;

// Daftar array SKU resmi tanpa UNMAPPED (untuk iterasi / lookup)
export const OFFICIAL_SKUS = catalogData.items.map((item) => item.sku);

// ==========================================
// 2. SKEMA ITEM KATALOG RESMI
// ==========================================

export const CatalogItemSchema = z.object({
  sku: SkuEnum,
  business: z.string(),
  business_key: z.enum(["gemintang", "memoku"]),
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  attributes: z.record(z.string(), z.any()),
  excludes: z.array(z.string()),
  revision_policy: z.string(),
});

export type CatalogItem = z.infer<typeof CatalogItemSchema>;

// ==========================================
// 3. SKEMA BRIEF ANALYZER OUTPUT
// ==========================================

export const RiskLevelSchema = z.enum(["merah", "kuning", "hijau"]);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const RiskCategorySchema = z.enum([
  "ruang_lingkup",
  "anggaran",
  "timeline",
  "revisi",
  "fitur",
  "legalitas",
  "komunikasi",
  "lainnya",
]);
export type RiskCategory = z.infer<typeof RiskCategorySchema>;

export const BriefRiskItemSchema = z.object({
  quote: z.string().min(1, "Kutipan wajib diisi persis dari chat"),
  speaker: z.enum(["klien", "saya", "tidak_diketahui"]).default("klien"),
  level: RiskLevelSchema,
  category: RiskCategorySchema.default("ruang_lingkup"),
  reason: z.string().min(1, "Alasan klasifikasi risiko wajib diisi"),
  suggestedAction: z.string().optional(),
});
export type BriefRiskItem = z.infer<typeof BriefRiskItemSchema>;

export const ClarificationQuestionSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1, "Pertanyaan klarifikasi wajib diisi"),
  context: z.string().min(1, "Alasan/konteks pertanyaan wajib dijelaskan"),
  priority: z.enum(["tinggi", "sedang", "rendah"]).default("tinggi"),
  checked: z.boolean().default(true),
});
export type ClarificationQuestion = z.infer<typeof ClarificationQuestionSchema>;

export const ProposedItemSchema = z.object({
  sku: SkuEnum,
  name: z.string().min(1, "Nama layanan wajib diisi"),
  quantity: z.number().int().min(1).default(1),
  deliverable: z.string().min(1, "Rincian deliverable wajib diisi"),
  sourceQuote: z.string().default(""),
  notes: z.string().default(""),
});
export type ProposedItem = z.infer<typeof ProposedItemSchema>;

export const BriefAnalyzerOutputSchema = z.object({
  riskAnalysis: z.array(BriefRiskItemSchema),
  clarificationQuestions: z.array(ClarificationQuestionSchema),
  proposedItems: z.array(ProposedItemSchema),
  summary: z.object({
    totalRisks: z.number().int().nonnegative(),
    totalAmbiguities: z.number().int().nonnegative(),
    totalClear: z.number().int().nonnegative(),
    generalNote: z.string().default(""),
  }),
});
export type BriefAnalyzerOutput = z.infer<typeof BriefAnalyzerOutputSchema>;

// ==========================================
// 4. SKEMA SCOPE GUARD
// ==========================================

export const ScopeVerdictSchema = z.enum([
  "covered",
  "out_of_scope",
  "perlu_klarifikasi",
]);
export type ScopeVerdict = z.infer<typeof ScopeVerdictSchema>;

export const ScopeGuardInputSchema = z.object({
  approvedProposalTitle: z.string(),
  approvedSkus: z.array(SkuEnum),
  exclusions: z.array(z.string()),
  revisionPolicy: z.string(),
  clientRequest: z.string().min(1, "Permintaan klien wajib diisi"),
});
export type ScopeGuardInput = z.infer<typeof ScopeGuardInputSchema>;

export const ScopeGuardOutputSchema = z.object({
  verdict: ScopeVerdictSchema,
  matchedSku: SkuEnum,
  confidence: z.number().min(0).max(1).default(0.9),
  reason: z.string().min(1, "Alasan evaluasi kontrak wajib diisi"),
  suggestedAddonSku: SkuEnum.optional(),
  replyDraft: z.string().min(1, "Draf balasan WhatsApp wajib diisi"),
  estimatedExtraDays: z.number().int().nonnegative().optional(),
});
export type ScopeGuardOutput = z.infer<typeof ScopeGuardOutputSchema>;
