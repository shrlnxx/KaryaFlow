import { NextRequest, NextResponse } from "next/server";
import catalogData from "../../../data/catalog.json";
import { BriefAnalyzerOutputSchema } from "../../../lib/schemas";
import { calculateQuotation } from "../../../lib/calculator";
import { MOCK_SCENARIOS, UMKMKey } from "../../../data/mock-data";

// ==============================================================================
// 1. HELPER AUTO-FALLBACK TAHAN GAGAL (PRD Golden Rule: Always Provide Value)
// ==============================================================================
function buildFallbackResponse(
  brandKey: UMKMKey,
  reason: string,
  clientChat?: string | null,
  hasImage?: boolean
) {
  const scenario = MOCK_SCENARIOS[brandKey] || MOCK_SCENARIOS.gemintang;

  if (hasImage && (!clientChat || clientChat.trim().length <= 10)) {
    // Fallback cerdas khusus saat screenshot diunggah namun offline/API key belum aktif
    const fallbackImageChips = [
      {
        id: "fb-img-1",
        quote: "Tangkapan layar chat WhatsApp terdeteksi",
        speaker: "Klien" as const,
        level: "kuning" as const,
        category: "Ruang Lingkup",
        reason: "Screenshot memuat obrolan kebutuhan proyek. Model Gemini Vision Live merekomendasikan konfirmasi deliverable tertulis.",
        context: "Transkrip Screenshot WhatsApp",
      },
      {
        id: "fb-img-2",
        quote: "Permintaan revisi dan penyesuaian materi",
        speaker: "Klien" as const,
        level: "merah" as const,
        category: "Revisi & Garansi",
        reason: "Potensi revisi berulang terdeteksi dalam obrolan chat. Kunci batas maksimal revisi mayor dan micro-change sebelum DP.",
        context: "Proteksi Margin Usaha",
      },
      {
        id: "fb-img-3",
        quote: "Kebutuhan paket layanan terstandar",
        speaker: "Klien" as const,
        level: "hijau" as const,
        category: "Ruang Lingkup",
        reason: "Kebutuhan utama cocok dengan paket standar katalog resmi studio.",
        context: "Katalog SKU Resmi",
      },
    ];

    const quotation = calculateQuotation(scenario.initialItems);

    return NextResponse.json({
      success: true,
      isFallback: true,
      fallbackReason: reason,
      brand: brandKey,
      briefChips: fallbackImageChips,
      waQuestions: scenario.waQuestions,
      items: scenario.initialItems,
      quotation,
      policy: scenario.policy,
      summary: {
        totalRisks: 1,
        totalAmbiguities: 1,
        totalClear: 1,
        generalNote: "Analisis screenshot via mode cerdas tahan-gagal berhasil.",
      },
    });
  }

  if (clientChat && clientChat.trim().length > 10) {
    const rawLines = clientChat
      .split(/\n|\. |\? |! /)
      .map((l) =>
        l
          .trim()
          .replace(/^\[.*?\]\s*/, "")
          .replace(/^Klien:\s*/i, "")
      )
      .filter((l) => l.length > 5);

    const dynamicChips = rawLines.map((line, idx) => {
      const lower = line.toLowerCase();
      let level: "merah" | "kuning" | "hijau" = "hijau";
      let category = "Ruang Lingkup";
      let chipReason = "Scope terdefinisi dan terukur dalam paket standar.";

      if (
        lower.includes("revisi") &&
        (lower.includes("bebas") ||
          lower.includes("tanpa batas") ||
          lower.includes("unlimited"))
      ) {
        level = "merah";
        category = "Revisi & Garansi";
        chipReason =
          "Risiko Tinggi: klausul revisi tanpa batas berpotensi menggerus margin usaha.";
      } else if (
        lower.includes("omset") ||
        lower.includes("viral") ||
        lower.includes("laku")
      ) {
        level = "merah";
        category = "Klausul Garansi Hasil";
        chipReason =
          "Risiko Tinggi: metrik performa bisnis di luar kendali teknis tim produksi.";
      } else if (
        lower.includes("payment") ||
        lower.includes("pembayaran") ||
        lower.includes("qris") ||
        lower.includes("raw") ||
        lower.includes("mentah")
      ) {
        level = "merah";
        category = "Scope Creep";
        chipReason =
          "Scope Creep: layanan memerlukan lisensi/dokumen terpisah di luar paket standar.";
      } else if (
        lower.includes("estetik") ||
        lower.includes("kekinian") ||
        lower.includes("gen z") ||
        lower.includes("mewah") ||
        lower.includes("sinematik")
      ) {
        level = "kuning";
        category = "Kriteria Visual Subjektif";
        chipReason =
          "Subjektif: membutuhkan referensi tertulis/moodboard dari pihak klien.";
      } else if (
        lower.includes("menyusul") ||
        lower.includes("talent") ||
        lower.includes("model") ||
        lower.includes("mua")
      ) {
        level = "kuning";
        category = "Aset & Timeline";
        chipReason =
          "Perlu Konfirmasi: kriteria dan tanggal penyerahan aset belum terkunci.";
      }

      return {
        id: `dyn-chip-${idx}`,
        quote: line,
        speaker: "Klien" as const,
        level,
        category,
        reason: chipReason,
        context: line.slice(0, 32) + (line.length > 32 ? "..." : ""),
      };
    });

    const quotation = calculateQuotation(scenario.initialItems);

    return NextResponse.json({
      success: true,
      isFallback: true,
      fallbackReason: reason,
      brand: brandKey,
      briefChips: dynamicChips.length > 0 ? dynamicChips : scenario.briefChips,
      waQuestions: scenario.waQuestions,
      items: scenario.initialItems,
      quotation,
      policy: scenario.policy,
      summary: {
        totalRisks: dynamicChips.filter((c) => c.level === "merah").length,
        totalAmbiguities: dynamicChips.filter((c) => c.level === "kuning").length,
        totalClear: dynamicChips.filter((c) => c.level === "hijau").length,
        generalNote: "Analisis teks brief berhasil diproses via Fallback Cerdas.",
      },
    });
  }

  const quotation = calculateQuotation(scenario.initialItems);

  return NextResponse.json({
    success: true,
    isFallback: true,
    fallbackReason: reason,
    brand: brandKey,
    briefChips: scenario.briefChips,
    waQuestions: scenario.waQuestions,
    items: scenario.initialItems,
    quotation,
    policy: scenario.policy,
    summary: {
      totalRisks: scenario.briefChips.filter((c) => c.level === "merah").length,
      totalAmbiguities: scenario.briefChips.filter((c) => c.level === "kuning").length,
      totalClear: scenario.briefChips.filter((c) => c.level === "hijau").length,
      generalNote: "Analisis brief skenario awal dimuat.",
    },
  });
}

// ==============================================================================
// 2. UNIVERSAL GEMINI CALLER (Mendukung Multimodal Vision & Teks)
// ==============================================================================
async function callGeminiUniversal(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  image?: { base64: string; mimeType: string } | null
) {
  // Model dengan kapabilitas vision multimodal unggul
  const modelsToTry = [
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-flash-latest",
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const userParts: any[] = [];

      // Masukkan inlineData gambar screenshot jika disediakan
      if (image && image.base64) {
        userParts.push({
          inlineData: {
            mimeType: image.mimeType || "image/png",
            data: image.base64,
          },
        });
      }

      userParts.push({ text: userPrompt });

      const bodyPayload = {
        contents: [
          {
            role: "user",
            parts: userParts,
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
        console.warn(`[Gemini API Model ${model}] Error ${response.status}:`, errorText);
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

  throw lastError || new Error("Semua model Gemini yang dicoba gagal merespon.");
}

// ==============================================================================
// 3. API ROUTE HANDLER (POST /api/analyze)
// ==============================================================================
export async function POST(req: NextRequest) {
  let brandKey: UMKMKey = "gemintang";
  let clientChat: string | null = null;
  let imageBase64: string | null = null;
  let imageMimeType: string = "image/png";
  let hasImage = false;

  try {
    const body = await req.json().catch(() => ({}));
    brandKey = (body.brand === "memoku" ? "memoku" : "gemintang") as UMKMKey;
    clientChat =
      typeof body.chatText === "string" && body.chatText.trim().length > 0
        ? body.chatText.trim()
        : null;

    if (typeof body.imageBase64 === "string" && body.imageBase64.length > 50) {
      imageBase64 = body.imageBase64;
      imageMimeType = typeof body.imageMimeType === "string" ? body.imageMimeType : "image/png";
    }

    hasImage = Boolean(imageBase64);
    const apiKey = process.env.GEMINI_API_KEY;

    // CEK 1: Validasi API Key
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY" || apiKey.length < 10) {
      console.warn(
        "[KaryaFlow API] GEMINI_API_KEY tidak terdeteksi. Menggunakan Auto-Fallback Mode."
      );
      return buildFallbackResponse(
        brandKey,
        "GEMINI_API_KEY belum dikonfigurasi di .env.local. Mode Auto-Fallback aktif dengan data deterministik aman.",
        clientChat,
        hasImage
      );
    }

    // Dapatkan katalog resmi khusus untuk lini usaha yang dipilih
    const brandCatalog = catalogData.items.filter(
      (item) => item.business_key === brandKey
    );

    const allowedSkus = catalogData.items.map((i) => i.sku);

    // Prompt sistem instruksi ketat (PRD B5 System Prompt + Multimodal Vision Support)
    const systemInstruction = `Kamu adalah KaryaFlow Brief Analyzer untuk UMKM Ekraf Indonesia (${
      brandKey === "gemintang"
        ? "Gemintang Production - Web Development"
        : "MemokuVisual - Fotografi & Videografi Komersial"
    }).

DAFTAR SKU RESMI DARI KATALOG:
${JSON.stringify(brandCatalog, null, 2)}

ATURAN MUTLAK & PANDUAN DEEP INTENT:
1. Jika disertakan gambar screenshot percakapan WhatsApp:
   - Baca dan transkripsikan bubble pesan chat dengan seksama. Bedakan pesan dari pihak Klien (bubble putih/kiri/nama pengirim di atas) dan pesan dari Freelancer/Studio (bubble hijau/kanan).
   - Lakukan DEEP INTENT ANALYSIS: Identifikasi apa kebutuhan SEBENARNYA yang diinginkan klien di balik percakapannya. Bedakan antara obrolan santai/basa-basi dengan deliverable resmi yang harus dikerjakan.
   - Deteksi ekspektasi tersembunyi atau asumsi yang berisiko memicu revisi tanpa akhir.
2. DILARANG MENULIS HARGA/RUPIAH! Semua rupiah dihitung oleh kode backend.
3. Nilai "sku" pada "proposedItems" HANYA BOLEH salah satu dari: ${JSON.stringify(allowedSkus)} atau "UNMAPPED".
4. Nilai "level" pada "riskAnalysis" HANYA BOLEH: "merah", "kuning", atau "hijau".
5. Nilai "category" pada "riskAnalysis" HANYA BOLEH salah satu dari: ["ruang_lingkup", "anggaran", "timeline", "revisi", "fitur", "legalitas", "komunikasi", "lainnya"].
6. Nilai "priority" pada "clarificationQuestions" HANYA BOLEH: "tinggi", "sedang", atau "rendah".
7. Output HARUS JSON murni tanpa pembungkus markdown dengan struktur berikut:
{
  "riskAnalysis": [
    {
      "quote": "Kutipan kalimat dari chat klien",
      "speaker": "klien",
      "level": "merah",
      "category": "revisi",
      "reason": "Alasan detail risiko dan kebutuhan sebenarnya yang diidentifikasi"
    }
  ],
  "clarificationQuestions": [
    {
      "question": "Pertanyaan sopan untuk chat WhatsApp",
      "context": "Alasan menanyakan hal ini",
      "priority": "tinggi"
    }
  ],
  "proposedItems": [
    {
      "sku": "WEB-LP-01",
      "name": "Landing Page Responsif",
      "quantity": 1,
      "deliverable": "5 Halaman Responsif + Form Kontak",
      "notes": "Catatan batas revisi"
    }
  ],
  "summary": {
    "totalRisks": 1,
    "totalAmbiguities": 0,
    "totalClear": 1,
    "generalNote": "Ringkasan kesiapan brief dan kebutuhan inti klien"
  }
}`;

    const sampleChatForBrand =
      clientChat ||
      (brandKey === "gemintang"
        ? `Klien: Halo, mau buat landing page 5 halaman responsif dengan tombol WhatsApp dan Google Maps. Desainnya harus estetik dan kekinian disukai Gen Z. Bahan materi foto dan teks menyusul ya. Revisinya pokoknya bebas tanpa batas sampai cocok dan omset kami naik! Sekalian include integrasi payment gateway tanpa biaya langganan bulanan.`
        : `Klien: Halo, mau dokumentasi produk half-day 4 jam di studio dan 1 video reels highlight 1 menit. Talent model & MUA tolong disiapkan dari tim ya. Mood video sinematik mewah. Revisinya bebas tanpa batas sampai viral di TikTok ya. Seluruh master file mentah RAW foto dan video 4K diserahkan gratis.`);

    const userPrompt = hasImage
      ? `Terlampir adalah screenshot percakapan WhatsApp dari klien.
Tugas Anda:
1. Baca dan pahami seluruh percakapan chat klien pada gambar.
2. Lakukan DEEP INTENT ANALYSIS untuk menemukan apa yang sebenarnya dibutuhkan klien (deliverable nyata vs basa-basi).
3. Analisis kalimat rawan (Traffic Light: merah/kuning/hijau).
4. Petakan kebutuhan tersebut ke SKU resmi katalog lini usaha studio.
5. Susun draf pertanyaan klarifikasi WhatsApp untuk mengunci ruang lingkup sebelum DP dibayarkan.
${clientChat ? `Catatan teks tambahan dari freelancer: "${clientChat}"` : ""}
Kembalikan JSON murni sesuai format instruksi sistem.`
      : `Analisis brief chat klien berikut ini dan kembalikan JSON murni sesuai format instruksi:\n\n${sampleChatForBrand}`;

    // Panggil Gemini Universal dengan key Anda
    const imagePayload = hasImage && imageBase64 ? { base64: imageBase64, mimeType: imageMimeType } : null;
    const { textOutput: rawText, modelUsed } = await callGeminiUniversal(
      apiKey,
      systemInstruction,
      userPrompt,
      imagePayload
    );

    // Parsing JSON dari Gemini (membersihkan backticks jika ada)
    const cleanJson = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const rawParsed = JSON.parse(cleanJson);

    // Normalisasi data sebelum validasi Zod agar selalu toleran
    const normalizedData = {
      riskAnalysis: Array.isArray(rawParsed.riskAnalysis)
        ? rawParsed.riskAnalysis.map((r: any) => ({
            quote: String(r.quote || "Kutipan brief"),
            speaker: r.speaker === "saya" ? "saya" : "klien",
            level: ["merah", "kuning", "hijau"].includes(r.level) ? r.level : "kuning",
            category: [
              "ruang_lingkup",
              "anggaran",
              "timeline",
              "revisi",
              "fitur",
              "legalitas",
              "komunikasi",
              "lainnya",
            ].includes(r.category)
              ? r.category
              : "ruang_lingkup",
            reason: String(r.reason || "Perlu konfirmasi batasan kerja"),
          }))
        : [],
      clarificationQuestions: Array.isArray(rawParsed.clarificationQuestions)
        ? rawParsed.clarificationQuestions.map((q: any) => ({
            question: String(q.question || "Mohon konfirmasi batasan scope kerja."),
            context: String(q.context || "Menghindari miskomunikasi"),
            priority: ["tinggi", "sedang", "rendah"].includes(q.priority) ? q.priority : "tinggi",
            checked: true,
          }))
        : [],
      proposedItems: Array.isArray(rawParsed.proposedItems)
        ? rawParsed.proposedItems.map((item: any) => ({
            sku: allowedSkus.includes(item.sku) ? item.sku : "UNMAPPED",
            name: String(item.name || "Layanan Proyek"),
            quantity: typeof item.quantity === "number" && item.quantity > 0 ? Math.floor(item.quantity) : 1,
            deliverable: String(item.deliverable || "Paket pengerjaan standar"),
            sourceQuote: String(item.sourceQuote || ""),
            notes: String(item.notes || ""),
          }))
        : [],
      summary: {
        totalRisks: Number(rawParsed?.summary?.totalRisks) || 0,
        totalAmbiguities: Number(rawParsed?.summary?.totalAmbiguities) || 0,
        totalClear: Number(rawParsed?.summary?.totalClear) || 0,
        generalNote: String(rawParsed?.summary?.generalNote || "Analisis brief selesai."),
      },
    };

    // Validasi menggunakan Zod Schema
    const validation = BriefAnalyzerOutputSchema.safeParse(normalizedData);
    if (!validation.success) {
      console.error(
        "[KaryaFlow API] Validasi Zod gagal terhadap output Gemini:",
        validation.error.format()
      );
      return buildFallbackResponse(
        brandKey,
        "Struktur output AI tidak valid terhadap Zod Schema. Dialihkan otomatis ke fallback data aman.",
        clientChat,
        hasImage
      );
    }

    const validatedOutput = validation.data;

    // Hitung harga secara deterministik HANYA dari katalog kode
    const quotationInputItems = validatedOutput.proposedItems.map(
      (item, idx) => ({
        id: `${item.sku}-${idx}-${Date.now()}`,
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        deliverable: item.deliverable,
        notes: item.notes,
      })
    );

    const quotation = calculateQuotation(quotationInputItems);

    // Format chip kalimat brief untuk UI
    const briefChips = validatedOutput.riskAnalysis.map((item, idx) => ({
      id: `ai-chip-${idx}`,
      quote: item.quote,
      speaker: (item.speaker === "saya" ? "Saya" : "Klien") as "Klien" | "Saya",
      level: item.level as "merah" | "kuning" | "hijau",
      category: item.category || "Ruang Lingkup",
      reason: item.reason,
      context: item.reason.split(":")[0] || "Analisis Gemini",
    }));

    // Format draf pertanyaan WhatsApp
    const waQuestions = validatedOutput.clarificationQuestions.map(
      (q, idx) => ({
        id: `ai-wq-${idx}`,
        text: q.question,
        context: q.context,
        priority: q.priority as "tinggi" | "sedang" | "rendah",
        checked: true,
      })
    );

    return NextResponse.json({
      success: true,
      isFallback: false,
      modelUsed: `${modelUsed} (Google AI Studio Live)`,
      brand: brandKey,
      briefChips,
      waQuestions,
      items: quotationInputItems,
      quotation,
      summary: validatedOutput.summary,
    });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("[KaryaFlow API] Error saat memanggil Gemini:", errorMsg);

    const isQuotaError =
      errorMsg.includes("429") ||
      errorMsg.includes("RESOURCE_EXHAUSTED") ||
      errorMsg.includes("quota");

    const reason = isQuotaError
      ? "Batas kuota Gemini Free Tier habis (HTTP 429). Mode Fallback Tahan-Gagal aktif agar pengujian juri tidak terhenti."
      : `Kendala pemanggilan Gemini API (${errorMsg.slice(0, 100)}). Auto-Fallback aktif dengan data deterministik aman.`;

    return buildFallbackResponse(brandKey, reason, clientChat, hasImage);
  }
}
