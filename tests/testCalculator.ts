import { calculateQuotation, formatRupiah } from "../src/lib/calculator";
import { BriefAnalyzerOutputSchema, ScopeGuardOutputSchema, SkuEnum } from "../src/lib/schemas";

console.log("=== TEST 1: SkuEnum values ===");
console.log("Options in SkuEnum:", SkuEnum.options);

console.log("\n=== TEST 2: Calculate confirmed quotation ===");
const resultConfirmed = calculateQuotation([
  { sku: "WEB-LP-01", quantity: 1 },
  { sku: "WEB-ADD-PAGE", quantity: 2 },
]);
console.log("Subtotal:", resultConfirmed.subtotal, resultConfirmed.subtotalDisplay);
console.log("DP 50%:", resultConfirmed.dpAmount, resultConfirmed.dpAmountDisplay);
console.log("Final 50%:", resultConfirmed.finalAmount, resultConfirmed.finalAmountDisplay);
console.log("Has unconfirmed:", resultConfirmed.hasUnconfirmedItems);

console.log("\n=== TEST 3: Calculate quotation with UNMAPPED item ===");
const resultMixed = calculateQuotation([
  { sku: "WEB-CP-02", quantity: 1 },
  { sku: "UNMAPPED", name: "Fitur Payment Gateway Otomatis", quantity: 1 },
]);
console.log("Subtotal:", resultMixed.subtotal, resultMixed.subtotalDisplay);
console.log("DP 50%:", resultMixed.dpAmount, resultMixed.dpAmountDisplay);
console.log("Final 50%:", resultMixed.finalAmount, resultMixed.finalAmountDisplay);
console.log("Has unconfirmed:", resultMixed.hasUnconfirmedItems);
console.log("Unconfirmed count:", resultMixed.unconfirmedCount);
console.log("Unmapped item unit price:", resultMixed.items[1].unitPriceDisplay);
console.log("Unmapped item line total:", resultMixed.items[1].lineTotalDisplay);

console.log("\n=== TEST 4: Zod Schema Validation ===");
const validBrief = BriefAnalyzerOutputSchema.safeParse({
  riskAnalysis: [
    {
      quote: "Revisi bebas tanpa batas",
      speaker: "klien",
      level: "merah",
      category: "revisi",
      reason: "Menggerus margin pengerjaan",
    },
  ],
  clarificationQuestions: [
    {
      question: "Apakah ada batas 2x revisi?",
      context: "Klarifikasi batas revisi kerja",
      priority: "tinggi",
      checked: true,
    },
  ],
  proposedItems: [
    {
      sku: "WEB-LP-01",
      name: "Landing Page Responsif",
      quantity: 1,
      deliverable: "5 Halaman",
      sourceQuote: "Butuh landing page 5 halaman",
      notes: "Sesuai paket standar",
    },
  ],
  summary: {
    totalRisks: 1,
    totalAmbiguities: 0,
    totalClear: 1,
    generalNote: "Brief siap diajukan",
  },
});
console.log("BriefAnalyzer validation success:", validBrief.success);

const validScopeGuard = ScopeGuardOutputSchema.safeParse({
  verdict: "out_of_scope",
  matchedSku: "WEB-ADD-CMS",
  confidence: 0.95,
  reason: "Fitur CMS berada di luar paket landing page",
  suggestedAddonSku: "WEB-ADD-CMS",
  replyDraft: "Halo kak, untuk CMS ada add-on terpisah ya.",
  estimatedExtraDays: 3,
});
console.log("ScopeGuard validation success:", validScopeGuard.success);
