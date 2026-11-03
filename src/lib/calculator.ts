import catalogData from "../data/catalog.json";
import { Sku, CatalogItem } from "./schemas";

// ==========================================
// TIPE DATA KALKULATOR HARGA DETERMINISTIK
// ==========================================

export interface QuotationInputItem {
  sku: Sku | string;
  name?: string;
  quantity?: number;
  notes?: string;
}

export interface CalculatedLineItem {
  sku: Sku | string;
  name: string;
  quantity: number;
  unitPrice: number | null;
  unitPriceDisplay: string;
  lineTotal: number | null;
  lineTotalDisplay: string;
  isUnconfirmed: boolean;
  notes?: string;
  excludes: string[];
  revisionPolicy: string;
}

export interface QuotationCalculationResult {
  items: CalculatedLineItem[];
  subtotal: number;
  subtotalDisplay: string;
  dpPercentage: number;
  dpAmount: number;
  dpAmountDisplay: string;
  finalPercentage: number;
  finalAmount: number;
  finalAmountDisplay: string;
  hasUnconfirmedItems: boolean;
  unconfirmedCount: number;
  confirmedCount: number;
}

// ==========================================
// PETA CEPAT KATALOG UNTUK LOOKUP DETERMINISTIK
// ==========================================

const CATALOG_ITEMS_MAP = new Map<string, CatalogItem>(
  catalogData.items.map((item) => [item.sku, item as CatalogItem])
);

/**
 * Format angka bulat menjadi format Rupiah Indonesia standar (e.g. "Rp 1.500.000")
 */
export function formatRupiah(value: number): string {
  if (typeof value !== "number" || isNaN(value)) {
    return "Rp 0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Mengambil detail item katalog resmi berdasarkan kode SKU.
 * Mengembalikan undefined jika SKU berupa "UNMAPPED" atau tidak terdaftar.
 */
export function getCatalogItemBySku(sku: string): CatalogItem | undefined {
  return CATALOG_ITEMS_MAP.get(sku);
}

/**
 * Mengambil seluruh daftar item katalog resmi dari catalog.json
 */
export function getAllCatalogItems(): CatalogItem[] {
  return catalogData.items as CatalogItem[];
}

// ==========================================
// FUNGSI UTAMA: KALKULASI HARGA DETERMINISTIK
// ==========================================

/**
 * Fungsi murni untuk menghitung total penawaran harga berdasarkan catalog.json.
 * 
 * ATURAN PRD:
 * 1. Harga satuan HANYA diambil dari catalog.json (AI dilarang keras mengarang harga).
 * 2. Hitung subtotal, DP 50%, dan Pelunasan 50% menggunakan integer murni.
 * 3. Jika item ber-SKU "UNMAPPED", harga bernilai null, diberi teks label "Perlu dikonfirmasi",
 *    dan flag hasUnconfirmedItems ditandai true.
 */
export function calculateQuotation(
  items: QuotationInputItem[]
): QuotationCalculationResult {
  let subtotal = 0;
  let unconfirmedCount = 0;
  let confirmedCount = 0;

  const calculatedItems: CalculatedLineItem[] = items.map((input) => {
    const rawQty = input.quantity ?? 1;
    const qty = Math.max(1, Math.floor(rawQty)); // Memastikan integer minimal 1
    const catalogItem = CATALOG_ITEMS_MAP.get(input.sku);

    // KASUS: Item UNMAPPED atau SKU tidak ada di katalog resmi
    if (!catalogItem || input.sku === "UNMAPPED") {
      unconfirmedCount++;
      return {
        sku: "UNMAPPED",
        name: input.name?.trim() || "Item Kustom (Perlu Penyesuaian)",
        quantity: qty,
        unitPrice: null,
        unitPriceDisplay: "Perlu dikonfirmasi",
        lineTotal: null,
        lineTotalDisplay: "Perlu dikonfirmasi",
        isUnconfirmed: true,
        notes: input.notes || "Belum ada SKU di katalog resmi; harus disepakati manual via WhatsApp.",
        excludes: [],
        revisionPolicy: "Menunggu kesepakatan manual.",
      };
    }

    // KASUS: Item terdaftar resmi di katalog
    confirmedCount++;
    const lineTotal = catalogItem.price * qty;
    subtotal += lineTotal;

    return {
      sku: catalogItem.sku,
      name: input.name?.trim() || catalogItem.name,
      quantity: qty,
      unitPrice: catalogItem.price,
      unitPriceDisplay: formatRupiah(catalogItem.price),
      lineTotal,
      lineTotalDisplay: formatRupiah(lineTotal),
      isUnconfirmed: false,
      notes: input.notes || "",
      excludes: catalogItem.excludes,
      revisionPolicy: catalogItem.revision_policy,
    };
  });

  // Skema Termin: DP 50% & Pelunasan 50% (Integer murni dengan pembulatan presisi)
  const dpAmount = Math.round(subtotal * 0.5);
  const finalAmount = subtotal - dpAmount; // Menjamin dpAmount + finalAmount === subtotal secara deterministik
  const hasUnconfirmedItems = unconfirmedCount > 0;

  return {
    items: calculatedItems,
    subtotal,
    subtotalDisplay: formatRupiah(subtotal),
    dpPercentage: 50,
    dpAmount,
    dpAmountDisplay: formatRupiah(dpAmount),
    finalPercentage: 50,
    finalAmount,
    finalAmountDisplay: formatRupiah(finalAmount),
    hasUnconfirmedItems,
    unconfirmedCount,
    confirmedCount,
  };
}
