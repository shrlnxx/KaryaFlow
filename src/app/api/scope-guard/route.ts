import { NextRequest, NextResponse } from "next/server";
import catalogData from "../../../data/catalog.json";
import { ScopeGuardOutputSchema, ScopeVerdict } from "../../../lib/schemas";
import { formatRupiah } from "../../../lib/calculator";
import { UMKMKey } from "../../../data/mock-data";

// ==============================================================================
// 1. UNIVERSAL CALLER KE GEMINI API (AQ... & AIza...)
// ==============================================================================
async function callGeminiUniversal(apiKey: string, systemPrompt: string, userPrompt: string) {
  const modelsToTry = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const bodyPayload = {
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[ScopeGuard Gemini API Model ${model}] Error ${response.status}:`, errorText);
        lastError = new Error(`Model ${model} Error (${response.status}): ${errorText}`);
        continue;
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) {
        lastError = new Error(`Respon kosong dari model ${model}`);
        continue;
      }

      return { textOutput, modelUsed: model };
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error("Semua model Gemini gagal merespons.");
}

// ==============================================================================
// 2. LOGIKA FALLBACK LOKAL DETERMINISTIK
// ==============================================================================
function getLocalScopeVerdict(brand: UMKMKey, requestText: string) {
  const lower = requestText.toLowerCase();

  if (brand === "gemintang") {
    if (
      lower.includes("cms") ||
      lower.includes("admin") ||
      lower.includes("payment") ||
      lower.includes("midtrans") ||
      lower.includes("qris") ||
      lower.includes("halaman baru") ||
      lower.includes("tambah halaman")
    ) {
      const matchedAddon = lower.includes("cms") || lower.includes("admin") ? "WEB-ADD-CMS" : "WEB-ADD-PAGE";
      const cat = catalogData.items.find((i) => i.sku === matchedAddon);
      return {
        verdict: "out_of_scope" as ScopeVerdict,
        matchedSku: matchedAddon,
        suggestedAddonSku: matchedAddon,
        reason: `Permintaan tersebut berada di luar ruang lingkup Landing Page standar. Terdeteksi SKU add-on resmi ${matchedAddon} seharga ${cat ? formatRupiah(cat.price) : "sesuai katalog"} dengan tambahan estimasi 2-3 hari kerja.`,
        replyDraft: `Halo Kak! Untuk penambahan fitur tersebut berada di luar paket proposal kita kemarin ya. Kami siapkan add-on resmi ${cat?.name || matchedAddon} sebesar ${cat ? formatRupiah(cat.price) : "tertera"} agar alur proyek tetap rapi. Boleh kami kirimkan addendum penawarannya?`,
        estimatedExtraDays: 3,
        extraCost: cat ? cat.price : 1000000,
        extraCostDisplay: cat ? `+ ${formatRupiah(cat.price)}` : "+ Rp 1.000.000",
      };
    }

    if (
      lower.includes("filter") ||
      lower.includes("animasi") ||
      lower.includes("bisa ga") ||
      lower.includes("gimana kalau")
    ) {
      return {
        verdict: "perlu_klarifikasi" as ScopeVerdict,
        matchedSku: "UNMAPPED",
        reason: "Permintaan belum memiliki spesifikasi teknis yang terukur. Perlu dipastikan apakah sekadar interaksi sederhana di browser (masuk kuota) atau butuh arsitektur database terpisah.",
        replyDraft: "Halo Kak! Terkait penambahan ini, apakah cukup penyesuaian visual sederhana di halaman (siap kami bantu masuk kuota), atau membutuhkan sistem pencarian database khusus? Kami izin konfirmasi dulu agar tidak menimbulkan biaya tambahan ya kak.",
        estimatedExtraDays: 1,
        extraCost: 0,
        extraCostDisplay: "Rp 0 s/d Rp 500.000 (Menunggu Klarifikasi)",
      };
    }

    return {
      verdict: "covered" as ScopeVerdict,
      matchedSku: "WEB-LP-01",
      reason: "Permintaan revisi teks, warna, atau penukaran aset gambar merupakan revisi minor yang tercakup dalam kuota micro-change aktif dan masa garansi bug 14 hari.",
      replyDraft: "Halo Kak! Perubahan minor ini langsung kami kerjakan ya, ini sudah termasuk ke dalam kuota micro-change proposal kita tanpa biaya tambahan. Terima kasih!",
      estimatedExtraDays: 0,
      extraCost: 0,
      extraCostDisplay: "Rp 0 (Termasuk dalam Kuota)",
    };
  } else {
    // MemokuVisual
    if (
      lower.includes("raw") ||
      lower.includes("mentah") ||
      lower.includes("lembur") ||
      lower.includes("overtime") ||
      lower.includes("tambah jam")
    ) {
      const isRaw = lower.includes("raw") || lower.includes("mentah");
      const matchedAddon = isRaw ? "ADD-RAW-01" : "ADD-HOUR-01";
      const cat = catalogData.items.find((i) => i.sku === matchedAddon);
      return {
        verdict: "out_of_scope" as ScopeVerdict,
        matchedSku: matchedAddon,
        suggestedAddonSku: matchedAddon,
        reason: `Permintaan penyerahan seluruh master file mentah RAW atau penambahan jam shooting berada di daftar pengecualian tegas (Exclusions). Tersedia add-on ${matchedAddon}.`,
        replyDraft: `Halo Kak! Untuk penyerahan file mentah RAW / penambahan jam shooting berada di luar paket proposal kita ya. Kami siapkan add-on resmi ${cat?.name || matchedAddon} sebesar ${cat ? formatRupiah(cat.price) : "tertera"}. Boleh kami siapkan dokumen tambahannya?`,
        estimatedExtraDays: 1,
        extraCost: cat ? cat.price : 500000,
        extraCostDisplay: cat ? `+ ${formatRupiah(cat.price)}` : "+ Rp 500.000",
      };
    }

    if (lower.includes("story") || lower.includes("format") || lower.includes("potong")) {
      return {
        verdict: "perlu_klarifikasi" as ScopeVerdict,
        matchedSku: "UNMAPPED",
        reason: "Klien meminta potongan tambahan. Jika hanya berupa potongan klip tengah berorientasi vertikal dapat dicakup gratis, namun jika butuh alur cerita dan opening khusus masuk add-on editing.",
        replyDraft: "Halo Kak! Terkait video Story ini, apakah cukup potongan klip tengah dari hasil video utama (gratis siap kami potongkan), atau butuh alur cerita dan opening khusus? Kami cek dulu ya kak agar tidak menambah biaya.",
        estimatedExtraDays: 1,
        extraCost: 0,
        extraCostDisplay: "Rp 0 s/d Rp 350.000 (Menunggu Klarifikasi)",
      };
    }

    return {
      verdict: "covered" as ScopeVerdict,
      matchedSku: "VID-HIGH-01",
      reason: "Permintaan pemotongan jeda klip atau penyesuaian grading saturasi warna produk tercakup dalam kuota putaran revisi minor pasca shooting.",
      replyDraft: "Halo Kak! Pemotongan klip jeda dan penyesuaian warna produk ini langsung kami proses ya kak, sudah tercakup dalam kuota revisi kita tanpa biaya tambahan.",
      estimatedExtraDays: 0,
      extraCost: 0,
      extraCostDisplay: "Rp 0 (Termasuk dalam Kuota)",
    };
  }
}

// ==============================================================================
// 3. API ROUTE HANDLER (POST /api/scope-guard)
// ==============================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const brand = (body.brand === "memoku" ? "memoku" : "gemintang") as UMKMKey;
    const clientRequest = String(body.clientRequest || "").trim();

    if (!clientRequest) {
      return NextResponse.json(
        { success: false, error: "clientRequest wajib diisi" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Jika API key belum ada / offline, langsung pakai local fallback deterministik
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY" || apiKey.length < 10) {
      const fallback = getLocalScopeVerdict(brand, clientRequest);
      return NextResponse.json({
        success: true,
        isFallback: true,
        fallbackReason: "Kunci API offline. Menggunakan evaluasi aturan deterministik PRD B6.",
        result: fallback,
      });
    }

    const brandCatalog = catalogData.items.filter((i) => i.business_key === brand);
    const allowedSkus = catalogData.items.map((i) => i.sku);

    const systemInstruction = `Kamu adalah KaryaFlow Scope Guard untuk ${
      brand === "gemintang" ? "Gemintang Production (Web)" : "MemokuVisual (Foto/Video)"
    }.
Tugasmu: Menilai permintaan tambahan dari klien di tengah pengerjaan proyek terhadap ruang lingkup proposal yang sudah disepakati.

KATALOG SKU RESMI:
${JSON.stringify(brandCatalog, null, 2)}

ATURAN VERDICT (PRD B6):
1. "covered": Jika permintaan adalah revisi minor (teks, ganti foto, warna, bug) yang tercakup dalam garansi dan kuota micro-change.
2. "out_of_scope": Jika meminta modul/fitur baru (CMS, payment, halaman baru, RAW file, overtime/lembur) yang berada di luar kesepakatan awal.
3. "perlu_klarifikasi": Jika permintaan ambigu atau spesifikasi teknisnya belum jelas (misal: "bisa bikin interaktif?", "bisa bikinin versi story?").

ATURAN OUTPUT:
- matchedSku: Wajib salah satu dari ${JSON.stringify(allowedSkus)} atau "UNMAPPED".
- suggestedAddonSku: SKU add-on resmi jika out_of_scope.
- replyDraft: Draf balasan WhatsApp yang hangat, ramah, sopan, tidak kaku, dan kolaboratif.
- DILARANG menulis angka harga di dalam JSON (akan dihitung oleh backend).
- Format output HARUS JSON murni:
{
  "verdict": "covered" | "out_of_scope" | "perlu_klarifikasi",
  "matchedSku": "WEB-LP-01",
  "confidence": 0.95,
  "reason": "Penjelasan kontrak 1-2 kalimat.",
  "suggestedAddonSku": "WEB-ADD-CMS",
  "replyDraft": "Halo Kak! ...",
  "estimatedExtraDays": 2
}`;

    const userPrompt = `Permintaan Klien: "${clientRequest}"\nEvaluasi apakah permintaan ini covered, out_of_scope, atau perlu_klarifikasi.`;

    const { textOutput: rawText, modelUsed } = await callGeminiUniversal(apiKey, systemInstruction, userPrompt);
    const cleanJson = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const rawParsed = JSON.parse(cleanJson);

    // Normalisasi sebelum validasi
    let normalizedVerdict: ScopeVerdict = "perlu_klarifikasi";
    if (rawParsed.verdict === "covered" || rawParsed.verdict === "tercakup") {
      normalizedVerdict = "covered";
    } else if (rawParsed.verdict === "out_of_scope" || rawParsed.verdict === "di_luar_scope") {
      normalizedVerdict = "out_of_scope";
    }

    const matchedSku = allowedSkus.includes(rawParsed.matchedSku) ? rawParsed.matchedSku : "UNMAPPED";
    const suggestedAddonSku = allowedSkus.includes(rawParsed.suggestedAddonSku) ? rawParsed.suggestedAddonSku : undefined;

    const validation = ScopeGuardOutputSchema.safeParse({
      verdict: normalizedVerdict,
      matchedSku,
      confidence: typeof rawParsed.confidence === "number" ? rawParsed.confidence : 0.9,
      reason: String(rawParsed.reason || "Evaluasi terhadap klausul proposal aktif."),
      suggestedAddonSku,
      replyDraft: String(rawParsed.replyDraft || "Halo Kak, terima kasih atas permintaannya..."),
      estimatedExtraDays: typeof rawParsed.estimatedExtraDays === "number" ? rawParsed.estimatedExtraDays : 0,
    });

    if (!validation.success) {
      console.warn("[ScopeGuard API] Validasi Zod gagal, dialihkan ke fallback:", validation.error.format());
      const fallback = getLocalScopeVerdict(brand, clientRequest);
      return NextResponse.json({
        success: true,
        isFallback: true,
        fallbackReason: "Output AI dinormalisasi menggunakan aturan deterministik PRD B6.",
        result: fallback,
      });
    }

    const validData = validation.data;
    let extraCost = 0;
    let extraCostDisplay = "Rp 0 (Termasuk dalam Kuota)";

    if (validData.verdict === "out_of_scope") {
      const addon = catalogData.items.find((i) => i.sku === validData.suggestedAddonSku);
      if (addon) {
        extraCost = addon.price;
        extraCostDisplay = `+ ${formatRupiah(addon.price)}`;
      } else {
        extraCost = 1000000;
        extraCostDisplay = "+ Rp 1.000.000";
      }
    } else if (validData.verdict === "perlu_klarifikasi") {
      extraCost = 0;
      extraCostDisplay = "Rp 0 s/d Rp 500.000 (Menunggu Klarifikasi)";
    }

    return NextResponse.json({
      success: true,
      isFallback: false,
      modelUsed: `${modelUsed} (Google AI Studio Live)`,
      result: {
        ...validData,
        extraCost,
        extraCostDisplay,
      },
    });
  } catch (err: any) {
    console.error("[ScopeGuard API] Error:", err?.message || err);
    const body = await req.json().catch(() => ({}));
    const brand = (body.brand === "memoku" ? "memoku" : "gemintang") as UMKMKey;
    const fallback = getLocalScopeVerdict(brand, body.clientRequest || "");

    return NextResponse.json({
      success: true,
      isFallback: true,
      fallbackReason: `Kendala API Gemini (${(err?.message || "").slice(0, 80)}). Menggunakan evaluasi aman deterministik.`,
      result: fallback,
    });
  }
}

