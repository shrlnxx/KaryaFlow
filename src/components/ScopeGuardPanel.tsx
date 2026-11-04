"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  Coins,
  Clock,
  ArrowRight,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { UMKMKey } from "../data/mock-data";

export type ScopeVerdictType = "COVERED" | "OUT_OF_SCOPE" | "NEED_CLARIFICATION";

interface ScopeScenarioDetail {
  id: string;
  verdict: ScopeVerdictType;
  label: string;
  clientRequest: string;
  badgeLabel: string;
  bannerTitle: string;
  reason: string;
  extraCostNumber: number;
  extraCostDisplay: string;
  matchedSku?: string;
  extraWorkdays: number;
  replyDraft: string;
}

interface ScopeGuardPanelProps {
  activeBrand: UMKMKey;
  brandName: string;
}

const BRAND_SCENARIOS: Record<UMKMKey, Record<"covered" | "out_of_scope" | "ambiguous", ScopeScenarioDetail>> = {
  gemintang: {
    covered: {
      id: "g-cov",
      verdict: "COVERED",
      label: "Uji Kasus Covered",
      clientRequest: "Mas tolong ganti foto banner utama dan perbaiki teks alamat di footer ya.",
      badgeLabel: "COVERED (TERMASUK)",
      bannerTitle: "TERMASUK DALAM RUANG LINGKUP (COVERED)",
      reason: "Permintaan penggantian foto banner slider dan koreksi teks footer merupakan revisi minor yang tercakup dalam kuota 3x micro-change aktif dan masa garansi bug 14 hari.",
      extraCostNumber: 0,
      extraCostDisplay: "Rp 0 (Termasuk dalam Kuota)",
      matchedSku: "WEB-LP-01",
      extraWorkdays: 0,
      replyDraft: "Halo Kak! Perubahan foto banner utama dan teks alamat di footer ini langsung kami kerjakan ya, ini sudah termasuk ke dalam kuota micro-change proposal kita tanpa biaya tambahan.",
    },
    out_of_scope: {
      id: "g-out",
      verdict: "OUT_OF_SCOPE",
      label: "Uji Kasus Out of Scope",
      clientRequest: "Mas tolong sekalian buatkan modul CMS Admin Panel biar kami bisa edit konten artikel sendiri tanpa coding.",
      badgeLabel: "OUT OF SCOPE (DI LUAR KONTRAK)",
      bannerTitle: "DI LUAR RUANG LINGKUP (OUT OF SCOPE / SCOPE CREEP)",
      reason: "Permintaan modul CMS Admin Panel berada di luar paket Landing Page yang disepakati. Terdeteksi SKU resmi katalog WEB-ADD-CMS seharga Rp 1.000.000 dengan estimasi penambahan 3 hari kerja.",
      extraCostNumber: 1000000,
      extraCostDisplay: "+ Rp 1.000.000",
      matchedSku: "WEB-ADD-CMS",
      extraWorkdays: 3,
      replyDraft: "Halo Kak! Untuk modul CMS Admin Panel berada di luar paket Landing Page kita kemarin ya kak. Kami siapkan add-on resmi SKU WEB-ADD-CMS sebesar Rp 1.000.000 dengan estimasi penambahan waktu 3 hari kerja. Boleh kami kirimkan addendum penawarannya?",
    },
    ambiguous: {
      id: "g-amb",
      verdict: "NEED_CLARIFICATION",
      label: "Uji Kasus Ambigu",
      clientRequest: "Mas bisa dibikinin filter katalog produk di halamannya biar kelihatan lebih interaktif?",
      badgeLabel: "NEED CLARIFICATION (AMBIGU)",
      bannerTitle: "PERLU KLARIFIKASI SPESIFIKASI (NEED CLARIFICATION)",
      reason: "Permintaan filter katalog belum memiliki spesifikasi teknis jelas. Jika berupa pengelompokan tab frontend sederhana dapat dicakup gratis, namun jika membutuhkan pencarian query database masuk ke add-on modul dinamis.",
      extraCostNumber: 0,
      extraCostDisplay: "Rp 0 s/d Rp 500.000 (Menunggu Klarifikasi)",
      matchedSku: "UNMAPPED",
      extraWorkdays: 1,
      replyDraft: "Halo Kak! Terkait filter katalog produk, apakah cukup pengelompokan tombol tab statis di halaman (gratis masuk kuota), atau butuh pencarian database dinamis? Kami izin konfirmasi dulu agar tidak ada biaya jika ternyata cukup sederhana kak.",
    },
  },
  memoku: {
    covered: {
      id: "m-cov",
      verdict: "COVERED",
      label: "Uji Kasus Covered",
      clientRequest: "Mas tolong potong jeda klip detik ke-10 dan sedikit naikkan saturasi warna produknya ya.",
      badgeLabel: "COVERED (TERMASUK)",
      bannerTitle: "TERMASUK DALAM RUANG LINGKUP (COVERED)",
      reason: "Permintaan perbaikan timing klip detik ke-10 dan penyesuaian grading warna produk termasuk dalam kuota 2x putaran revisi minor cut/color pasca shooting.",
      extraCostNumber: 0,
      extraCostDisplay: "Rp 0 (Termasuk dalam Kuota)",
      matchedSku: "VID-HIGH-01",
      extraWorkdays: 0,
      replyDraft: "Halo Kak! Pemotongan klip jeda detik ke-10 dan penyesuaian warna produk langsung kami proses ya kak, ini sudah termasuk ke dalam kuota revisi minor kita.",
    },
    out_of_scope: {
      id: "m-out",
      verdict: "OUT_OF_SCOPE",
      label: "Uji Kasus Out of Scope",
      clientRequest: "Mas sekalian kami minta kirim seluruh master file mentah RAW foto & video ya, dan shooting minta tambah 2 jam.",
      badgeLabel: "OUT OF SCOPE (DI LUAR KONTRAK)",
      bannerTitle: "DI LUAR RUANG LINGKUP (OUT OF SCOPE / SCOPE CREEP)",
      reason: "Permintaan serah terima file mentah RAW dan penambahan jam liputan (overtime) berada di daftar tegas 'Scope Exclusions'. Dihitung deterministik dari SKU ADD-RAW-01 (Rp 500.000) + 2x ADD-HOUR-01 (Rp 600.000).",
      extraCostNumber: 1100000,
      extraCostDisplay: "+ Rp 1.100.000",
      matchedSku: "ADD-RAW-01 + ADD-HOUR-01",
      extraWorkdays: 1,
      replyDraft: "Halo Kak! Untuk penyerahan file mentah RAW dan tambahan jam shooting berada di luar paket proposal kita ya kak. Kami siapkan add-on resmi lisensi RAW (Rp 500.000) dan overtime 2 jam (Rp 600.000) dengan total Rp 1.100.000. Boleh kami proses addendum resminya?",
    },
    ambiguous: {
      id: "m-amb",
      verdict: "NEED_CLARIFICATION",
      label: "Uji Kasus Ambigu",
      clientRequest: "Mas video 1 menitnya bisa dibikinin versi Story 15 detik juga nggak?",
      badgeLabel: "NEED CLARIFICATION (AMBIGU)",
      bannerTitle: "PERLU KLARIFIKASI SPESIFIKASI (NEED CLARIFICATION)",
      reason: "Klien meminta potongan Story 15 detik. Jika cukup potongan klip tengah berorientasi vertikal dapat diberikan gratis, namun jika membutuhkan perakitan alur cerita dan opening terpisah perlu add-on editing tambahan.",
      extraCostNumber: 0,
      extraCostDisplay: "Rp 0 s/d Rp 350.000 (Menunggu Klarifikasi)",
      matchedSku: "UNMAPPED",
      extraWorkdays: 1,
      replyDraft: "Halo Kak! Terkait video Story 15 detik, apakah cukup potongan klip tengah dari video 1 menit kita (gratis siap kami bantu potongkan), atau butuh alur cerita dan opening khusus? Kami cek dulu ya kak agar tidak menambah biaya jika cukup potongan klip.",
    },
  },
};

export function ScopeGuardPanel({ activeBrand, brandName }: ScopeGuardPanelProps) {
  const brandScenarios = BRAND_SCENARIOS[activeBrand];
  const [selectedPreset, setSelectedPreset] = useState<"covered" | "out_of_scope" | "ambiguous">("covered");
  const [customRequest, setCustomRequest] = useState<string>(brandScenarios.covered.clientRequest);
  const [activeResult, setActiveResult] = useState<ScopeScenarioDetail>(brandScenarios.covered);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [modelLabel, setModelLabel] = useState<string>("Gemini AI Live");

  // Switch preset simulation
  const handleSelectPreset = (key: "covered" | "out_of_scope" | "ambiguous") => {
    setSelectedPreset(key);
    const scenario = brandScenarios[key];
    setCustomRequest(scenario.clientRequest);
    setActiveResult(scenario);
  };

  // Evaluate current input with live Gemini API /api/scope-guard
  const handleEvaluateCustom = async () => {
    if (!customRequest.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await fetch("/api/scope-guard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: activeBrand,
          clientRequest: customRequest,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        const r = data.result;
        let v: ScopeVerdictType = "NEED_CLARIFICATION";
        let badgeLabel = "NEED CLARIFICATION (AMBIGU)";
        let bannerTitle = "PERLU KLARIFIKASI SPESIFIKASI (NEED CLARIFICATION)";

        if (r.verdict === "covered") {
          v = "COVERED";
          badgeLabel = "COVERED (TERMASUK)";
          bannerTitle = "TERMASUK DALAM RUANG LINGKUP (COVERED)";
          setSelectedPreset("covered");
        } else if (r.verdict === "out_of_scope") {
          v = "OUT_OF_SCOPE";
          badgeLabel = "OUT OF SCOPE (DI LUAR KONTRAK)";
          bannerTitle = "DI LUAR RUANG LINGKUP (OUT OF SCOPE / SCOPE CREEP)";
          setSelectedPreset("out_of_scope");
        } else {
          v = "NEED_CLARIFICATION";
          badgeLabel = "NEED CLARIFICATION (AMBIGU)";
          bannerTitle = "PERLU KLARIFIKASI SPESIFIKASI (NEED CLARIFICATION)";
          setSelectedPreset("ambiguous");
        }

        setActiveResult({
          id: `eval-${Date.now()}`,
          verdict: v,
          label: `Evaluasi AI: ${badgeLabel}`,
          clientRequest: customRequest,
          badgeLabel,
          bannerTitle,
          reason: r.reason,
          extraCostNumber: r.extraCost || 0,
          extraCostDisplay: r.extraCostDisplay || "Rp 0",
          matchedSku: r.matchedSku || r.suggestedAddonSku,
          extraWorkdays: r.estimatedExtraDays || 0,
          replyDraft: r.replyDraft,
        });

        if (data.modelUsed) {
          setModelLabel(data.modelUsed);
        }
      }
    } catch (err) {
      console.warn("Scope guard evaluation error, fallback local:", err);
      // Fallback lokal
      const text = customRequest.toLowerCase();
      if (text.includes("cms") || text.includes("admin") || text.includes("raw") || text.includes("tambah") || text.includes("lembur") || text.includes("overtime")) {
        setActiveResult(brandScenarios.out_of_scope);
        setSelectedPreset("out_of_scope");
      } else if (text.includes("filter") || text.includes("story") || text.includes("bisa") || text.includes("gimana")) {
        setActiveResult(brandScenarios.ambiguous);
        setSelectedPreset("ambiguous");
      } else {
        setActiveResult(brandScenarios.covered);
        setSelectedPreset("covered");
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  // Copy WhatsApp draft to clipboard with fallback
  const handleCopyReply = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(activeResult.replyDraft);
      } else {
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = activeResult.replyDraft;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    } catch (err) {
      console.error("Gagal menyalin draf ke clipboard:", err);
    }
  };

  // Styles based on verdict
  let bannerBg = "";
  let bannerBorder = "";
  let badgeColor = "";
  let IconComponent = ShieldCheck;

  if (activeResult.verdict === "COVERED") {
    bannerBg = "bg-emerald-50 text-emerald-950";
    bannerBorder = "border-emerald-300";
    badgeColor = "bg-emerald-100 text-emerald-900 border-emerald-300";
    IconComponent = ShieldCheck;
  } else if (activeResult.verdict === "OUT_OF_SCOPE") {
    bannerBg = "bg-rose-50 text-rose-950";
    bannerBorder = "border-rose-300";
    badgeColor = "bg-rose-100 text-rose-900 border-rose-300";
    IconComponent = ShieldAlert;
  } else {
    bannerBg = "bg-amber-50 text-amber-950";
    bannerBorder = "border-amber-300";
    badgeColor = "bg-amber-100 text-amber-900 border-amber-300";
    IconComponent = AlertTriangle;
  }

  return (
    <div className="space-y-4 min-w-0 w-full">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-2.5">
        <div>
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-zinc-900" />
            <span>Scope Guard & Pelindung Margin ({brandName})</span>
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Evaluasi permintaan tambahan di tengah jalan untuk mencegah revisi tanpa akhir dan kebocoran margin usaha.
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded self-start sm:self-auto font-semibold">
          {modelLabel}
        </span>
      </div>

      {/* 3 TOMBOL SIMULASI UJI CEPAT JURI */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-zinc-600 block uppercase tracking-wider">
          Pilih Skenario Uji Cepat (Simulasi Juri):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSelectPreset("covered")}
            className={`h-9 px-3 rounded text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedPreset === "covered"
                ? "bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs"
                : "bg-white text-zinc-700 border-zinc-200 hover:bg-emerald-50/60"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>[Uji Kasus Covered]</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectPreset("out_of_scope")}
            className={`h-9 px-3 rounded text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedPreset === "out_of_scope"
                ? "bg-rose-600 text-white border-rose-600 font-semibold shadow-xs"
                : "bg-white text-zinc-700 border-zinc-200 hover:bg-rose-50/60"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>[Uji Kasus Out of Scope]</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectPreset("ambiguous")}
            className={`h-9 px-3 rounded text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedPreset === "ambiguous"
                ? "bg-amber-600 text-white border-amber-600 font-semibold shadow-xs"
                : "bg-white text-zinc-700 border-zinc-200 hover:bg-amber-50/60"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>[Uji Kasus Ambigu]</span>
          </button>
        </div>
      </div>

      {/* INPUT INTERAKTIF PERMINTAAN KLIEN */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-800">
            Pesan / Permintaan Klien di WhatsApp:
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            Dapat diedit bebas untuk pengujian AI
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <textarea
            rows={2}
            value={customRequest}
            onChange={(e) => setCustomRequest(e.target.value)}
            className="w-full text-xs p-2.5 rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white leading-relaxed"
            placeholder="Masukkan kalimat permintaan revisi atau fitur tambahan dari klien..."
          />
          <button
            type="button"
            disabled={isEvaluating || !customRequest.trim()}
            onClick={handleEvaluateCustom}
            className="h-auto sm:w-28 px-3 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 rounded transition-colors shrink-0 flex sm:flex-col items-center justify-center gap-1 cursor-pointer"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menilai...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Evaluasi AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* BANNER VISUAL BESAR KEPUTUSAN SCOPE GUARD */}
      <div
        role="status"
        aria-live="polite"
        className={`p-4 sm:p-5 rounded-lg border-2 ${bannerBorder} ${bannerBg} space-y-3 transition-all animate-in fade-in duration-150`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current/15 pb-3">
          <div className="flex items-center gap-2.5">
            <IconComponent className="w-6 h-6 shrink-0" />
            <div>
              <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${badgeColor}`}>
                {activeResult.badgeLabel}
              </span>
              <h3 className="text-sm font-bold tracking-tight mt-0.5">
                {activeResult.bannerTitle}
              </h3>
            </div>
          </div>
          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] uppercase text-zinc-600 block">Kompensasi Biaya:</span>
            <span className="text-base sm:text-lg font-bold tabular-nums">
              {activeResult.extraCostDisplay}
            </span>
          </div>
        </div>

        {/* Rincian Evaluasi Kontrak */}
        <div className="text-xs space-y-1">
          <span className="font-semibold uppercase tracking-wider text-[10px] opacity-80 block">
            Dasar Pertimbangan Kontrak:
          </span>
          <p className="leading-relaxed opacity-95">
            {activeResult.reason}
          </p>
        </div>
      </div>

      {/* KARTU RINCIAN BIAYA TAMBAHAN & ESTIMASI KERJA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-zinc-200 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-semibold">
            <Coins className="w-3.5 h-3.5 text-zinc-600" />
            <span>Biaya Add-on Resmi</span>
          </div>
          <div className="font-mono text-sm font-bold text-zinc-900 tabular-nums">
            {activeResult.extraCostDisplay}
          </div>
          <div className="text-[10px] text-zinc-500">
            Ditarik deterministik dari katalog
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-semibold">
            <Clock className="w-3.5 h-3.5 text-zinc-600" />
            <span>Penyesuaian Waktu</span>
          </div>
          <div className="font-mono text-sm font-bold text-zinc-900">
            {activeResult.extraWorkdays > 0 ? `+ ${activeResult.extraWorkdays} Hari Kerja` : "0 Hari (Langsung Diproses)"}
          </div>
          <div className="text-[10px] text-zinc-500">
            SLA jadwal pengerjaan proyek
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
            <span>Pemetaan SKU Resmi</span>
          </div>
          <div className="font-mono text-xs font-bold text-indigo-700 truncate">
            {activeResult.matchedSku || "UNMAPPED"}
          </div>
          <div className="text-[10px] text-zinc-500">
            Katalog resmi terstandarisasi
          </div>
        </div>
      </div>

      {/* KOTAK DRAF BALASAN WHATSAPP SOPAN & SANTUN */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Draf Balasan WhatsApp Santun ke Klien (Siap Kirim)</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono font-medium">
            Edit Manual Aktif
          </span>
        </div>

        <div className="space-y-1">
          <label htmlFor="scope-guard-reply-draft" className="text-[11px] font-semibold text-emerald-900 block">
            Sesuaikan / Edit Draf Balasan:
          </label>
          <textarea
            id="scope-guard-reply-draft"
            rows={4}
            value={activeResult.replyDraft}
            onChange={(e) => {
              const newDraft = e.target.value;
              setActiveResult((prev) => ({ ...prev, replyDraft: newDraft }));
            }}
            placeholder="Edit draf balasan WhatsApp di sini..."
            className="w-full p-3 bg-white rounded-md border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-sans text-zinc-900 leading-relaxed shadow-xs resize-y min-h-[90px] transition-all"
          />
        </div>

        <button
          type="button"
          onClick={handleCopyReply}
          className={`w-full flex items-center justify-center gap-2 h-9 text-xs font-semibold rounded transition-colors shadow-xs cursor-pointer ${
            isCopied
              ? "bg-emerald-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Draf Balasan Tersalin ke Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
