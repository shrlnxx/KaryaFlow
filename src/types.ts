export type ServiceMode = "website" | "fotografi";

export type RiskLevel = "merah" | "kuning" | "hijau";

export interface CatalogItem {
  id: string; // mis. 'web_halaman_statis'
  name: string;
  description: string;
  unit: string; // 'halaman' | 'fitur' | 'sesi' | 'jam' | 'foto' | 'bulan' | 'paket'
  unitPrice: number | null; // IDR; null = belum diisi
  hoursPerUnit: number | null; // null = belum diisi
  keywords: string[];
}

export interface ChatMessage {
  index: number;
  sender: "klien" | "saya" | "tidak_diketahui";
  text: string;
}

export interface XRayMark {
  quote: string;
  messageIndex: number;
  level: RiskLevel;
  reason: string;
  verified: boolean;
}

export interface Requirement {
  text: string;
  sourceQuote: string;
}

export interface ClarificationQuestion {
  question: string;
  why: string;
  priority: "tinggi" | "sedang" | "rendah";
  checked?: boolean;
}

export interface ProposedItem {
  catalogItemId: string | null;
  label: string;
  quantity: number | null;
  unit: string;
  deliverable: string;
  sourceQuote: string;
  notes: string;
  unitPrice?: number | null;
  hoursPerUnit?: number | null;
  status: "ok" | "perlu_dikonfirmasi";
}

export interface AnalysisResult {
  summary: string;
  marks: XRayMark[];
  requirements: Requirement[];
  questions: ClarificationQuestion[];
  items: ProposedItem[];
  exclusions: string[];
  assumptions: string[];
}

export interface EstimateLine {
  itemRef: string;
  label: string;
  quantity: number;
  unitPrice: number | null;
  hours: number | null;
  subtotal: number | null;
  status: "ok" | "perlu_dikonfirmasi";
}

export interface Estimate {
  lines: EstimateLine[];
  total: number;
  totalHours: number;
  durationWorkdays: number;
  bufferPct: number;
  hoursPerDay: number;
  unconfirmedCount: number;
}

export interface ApprovedAnalysis {
  analysis: AnalysisResult;
  estimate: Estimate;
  approvedAt: string;
}

export type ScopeVerdict = "tercakup" | "di_luar_scope" | "perlu_klarifikasi";

export interface ScopeGuardResult {
  verdict: ScopeVerdict;
  reason: string;
  matchedItemIds: string[];
  replyDraft: string;
  suggestedExtraItems: {
    catalogItemId: string | null;
    label: string;
    quantity: number | null;
    estimatedCost?: number | null;
  }[];
}

