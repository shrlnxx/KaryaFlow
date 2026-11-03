import { Estimate, EstimateLine, ProposedItem, CatalogItem } from "@/types";
import { APP_CONFIG } from "@/config";

export interface CalculationOptions {
  bufferPct?: number;
  hoursPerDay?: number;
}

/**
 * Menghitung estimasi biaya dan durasi kerja secara deterministik.
 * AI DILARANG menghitung harga atau durasi (Aturan B3 & B8).
 */
export function calculateEstimate(
  items: ProposedItem[],
  catalog: CatalogItem[],
  options?: CalculationOptions
): Estimate {
  const bufferPct = options?.bufferPct ?? APP_CONFIG.defaultCalculation.bufferPct;
  const hoursPerDay = options?.hoursPerDay ?? APP_CONFIG.defaultCalculation.hoursPerDay;

  const catalogMap = new Map<string, CatalogItem>();
  for (const cat of catalog) {
    catalogMap.set(cat.id, cat);
  }

  let total = 0;
  let totalHours = 0;
  let unconfirmedCount = 0;

  const lines: EstimateLine[] = items.map((item, index) => {
    const catalogItem = item.catalogItemId ? catalogMap.get(item.catalogItemId) : undefined;

    // Ambil harga dan jam dari katalog atau item yang di-override
    const unitPrice = item.unitPrice !== undefined ? item.unitPrice : catalogItem?.unitPrice ?? null;
    const hoursPerUnit = item.hoursPerUnit !== undefined ? item.hoursPerUnit : catalogItem?.hoursPerUnit ?? null;
    const qty = typeof item.quantity === "number" && item.quantity > 0 && item.quantity <= 1000
      ? item.quantity
      : 1;

    const isPriceReady = unitPrice !== null && !isNaN(unitPrice) && unitPrice >= 0;
    const isHoursReady = hoursPerUnit !== null && !isNaN(hoursPerUnit) && hoursPerUnit >= 0;

    let subtotal: number | null = null;
    let hours: number | null = null;
    let status: "ok" | "perlu_dikonfirmasi" = "ok";

    if (isPriceReady) {
      subtotal = Math.round(qty * (unitPrice as number));
      total += subtotal;
    } else {
      status = "perlu_dikonfirmasi";
      unconfirmedCount++;
    }

    if (isHoursReady) {
      hours = Math.round(qty * (hoursPerUnit as number) * 10) / 10;
      totalHours += hours;
    }

    return {
      itemRef: item.catalogItemId || `custom_${index}`,
      label: item.label || catalogItem?.name || "Item Pekerjaan",
      quantity: qty,
      unitPrice,
      hours,
      subtotal,
      status,
    };
  });

  // Rumus durasi PRD B8: ceil( totalHours * (1 + bufferPct/100) / hoursPerDay )
  const effectiveHoursPerDay = hoursPerDay > 0 ? hoursPerDay : 6;
  const bufferedHours = totalHours * (1 + bufferPct / 100);
  const durationWorkdays = totalHours > 0 ? Math.ceil(bufferedHours / effectiveHoursPerDay) : 0;

  return {
    lines,
    total,
    totalHours: Math.round(totalHours * 10) / 10,
    durationWorkdays,
    bufferPct,
    hoursPerDay: effectiveHoursPerDay,
    unconfirmedCount,
  };
}

/**
 * Format angka ke format mata uang Rupiah Indonesia (IDR)
 */
export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Perlu Dikonfirmasi";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

