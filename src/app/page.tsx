"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Plus,
  Minus,
  Trash2,
  FileText,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Receipt,
  FileSearch,
  CheckSquare,
  Square,
  ArrowRight,
  Clock,
  Layers,
  UploadCloud,
} from "lucide-react";
import { ImageDropzone, UploadedImageData } from "../components/ui/ImageDropzone";
import {
  MOCK_SCENARIOS,
  UMKMKey,
  BriefChipItem,
  WaQuestionItem,
} from "../data/mock-data";
import {
  calculateQuotation,
  formatRupiah,
  QuotationInputItem,
} from "../lib/calculator";
import catalogData from "../data/catalog.json";
import { A4Proposal } from "../components/A4Proposal";
import { ScopeGuardPanel } from "../components/ScopeGuardPanel";
import { AppShell } from "../components/layout/AppShell";
import { NavViewId } from "../components/layout/Sidebar";
import { BentoCard, BentoHeader } from "../components/ui/BentoCard";

interface WorkspaceLineItem extends QuotationInputItem {
  id: string;
  deliverable?: string;
}

export default function KaryaFlowDashboard() {
  // 1. BRAND & NAVIGATION STATE
  const [activeBrand, setActiveBrand] = useState<UMKMKey>("gemintang");
  const [activeView, setActiveView] = useState<NavViewId>("overview");

  const brandData = MOCK_SCENARIOS[activeBrand];

  // 2. DATA STATES (PERSISTENT & REACTIVE)
  const [activeInputMode, setActiveInputMode] = useState<"upload" | "text">("upload");
  const [uploadedImage, setUploadedImage] = useState<UploadedImageData | null>(null);
  const [inputBriefText, setInputBriefText] = useState<string>(brandData.sampleChat);
  const [customBriefChips, setCustomBriefChips] = useState<BriefChipItem[] | null>(null);
  const [expandedChipId, setExpandedChipId] = useState<string | null>(
    brandData.briefChips[0]?.id || null
  );
  const [waQuestions, setWaQuestions] = useState<WaQuestionItem[]>(
    brandData.waQuestions
  );
  const [items, setItems] = useState<WorkspaceLineItem[]>(
    brandData.initialItems
  );

  // Status & interactive feedback
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isWaCopied, setIsWaCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddCatalog, setShowAddCatalog] = useState<boolean>(false);

  const [aiStatus, setAiStatus] = useState<{
    live: boolean;
    label: string;
  }>({
    live: true,
    label: "Gemini 3.5 Flash Live",
  });

  const currentBriefChips = customBriefChips || brandData.briefChips;

  // 3. DETERMINISTIC QUOTATION CALCULATION
  const quotation = useMemo(() => {
    return calculateQuotation(items);
  }, [items]);

  const activeBrandCatalog = useMemo(() => {
    return catalogData.items.filter((item) => item.business_key === activeBrand);
  }, [activeBrand]);

  const briefStats = useMemo(() => {
    const merah = currentBriefChips.filter((c) => c.level === "merah").length;
    const kuning = currentBriefChips.filter((c) => c.level === "kuning").length;
    const hijau = currentBriefChips.filter((c) => c.level === "hijau").length;
    const total = currentBriefChips.length || 1;
    return {
      merah,
      kuning,
      hijau,
      total,
      merahPct: (merah / total) * 100,
      kuningPct: (kuning / total) * 100,
      hijauPct: (hijau / total) * 100,
    };
  }, [currentBriefChips]);

  // Brand Switching Handler
  const handleSwitchBrand = (brandKey: UMKMKey) => {
    setActiveBrand(brandKey);
    const nextBrand = MOCK_SCENARIOS[brandKey];
    setInputBriefText(nextBrand.sampleChat);
    setCustomBriefChips(null);
    setExpandedChipId(nextBrand.briefChips[0]?.id || null);
    setWaQuestions(nextBrand.waQuestions);
    setItems(nextBrand.initialItems);
    setShowAddCatalog(false);
    triggerToast(`Beralih ke studio: ${nextBrand.name}`);
  };

  const handleResetSample = () => {
    const current = MOCK_SCENARIOS[activeBrand];
    setInputBriefText(current.sampleChat);
    setCustomBriefChips(null);
    setExpandedChipId(current.briefChips[0]?.id || null);
    setWaQuestions(current.waQuestions);
    setItems(current.initialItems);
    triggerToast("Data simulasi diatur ulang ke kondisi awal");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentQty = item.quantity ?? 1;
          return { ...item, quantity: Math.max(1, currentQty + delta) };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    triggerToast("Layanan dihapus dari penawaran");
  };

  const handleAddSku = (catalogItem: typeof catalogData.items[0]) => {
    const existingIndex = items.findIndex((i) => i.sku === catalogItem.sku);
    if (existingIndex >= 0) {
      setItems((prev) =>
        prev.map((i, idx) =>
          idx === existingIndex
            ? { ...i, quantity: (i.quantity ?? 1) + 1 }
            : i
        )
      );
      triggerToast(`Kuantitas ${catalogItem.sku} ditambah`);
    } else {
      const newItem: WorkspaceLineItem = {
        id: `${catalogItem.sku}-${Date.now()}`,
        sku: catalogItem.sku,
        name: catalogItem.name,
        quantity: 1,
        deliverable: Object.entries(catalogItem.attributes)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", "),
        notes: catalogItem.revision_policy,
      };
      setItems((prev) => [...prev, newItem]);
      triggerToast(`${catalogItem.sku} ditambahkan`);
    }
  };

  const toggleWaQuestion = (id: string) => {
    setWaQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, checked: !q.checked } : q))
    );
  };

  const handleCopyWa = () => {
    const checkedList = waQuestions
      .filter((q) => q.checked)
      .map((q, idx) => `${idx + 1}. ${q.text}`)
      .join("\n");

    const message = `Halo Kak, terima kasih atas brief proyeknya. 🙏\nAgar penawaran kami akurat dan tidak meleset dari kebutuhan, kami izin mengonfirmasi beberapa poin berikut:\n\n${checkedList}\n\nTerima kasih Kak!`;

    navigator.clipboard?.writeText(message);
    setIsWaCopied(true);
    setTimeout(() => setIsWaCopied(false), 2200);
  };

  const handleRunAiAnalysis = async () => {
    if (activeInputMode === "upload" && !uploadedImage) {
      triggerToast("Pilih atau tempel screenshot chat WhatsApp terlebih dahulu.");
      return;
    }
    if (activeInputMode === "text" && !inputBriefText.trim()) {
      triggerToast("Ketik atau tempel teks obrolan WhatsApp terlebih dahulu.");
      return;
    }

    setIsAnalyzing(true);
    triggerToast(
      activeInputMode === "upload"
        ? "Gemini AI sedang membaca & menganalisis screenshot WA..."
        : "Memanggil Gemini AI membedah brief..."
    );

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: activeBrand,
          chatText: activeInputMode === "text" ? inputBriefText : undefined,
          imageBase64: activeInputMode === "upload" ? uploadedImage?.base64 : undefined,
          imageMimeType: activeInputMode === "upload" ? uploadedImage?.mimeType : undefined,
        }),
      });

      const data = await res.json();

      if (data.briefChips && Array.isArray(data.briefChips)) {
        setCustomBriefChips(data.briefChips);
        setExpandedChipId(data.briefChips[0]?.id || null);
      }
      if (data.waQuestions && Array.isArray(data.waQuestions)) {
        setWaQuestions(data.waQuestions);
      }
      if (data.items && Array.isArray(data.items)) {
        setItems(data.items);
      }

      if (data.isFallback) {
        setAiStatus({ live: false, label: "Mode Deterministic Fallback" });
        triggerToast("Analisis selesai via Fallback Cerdas");
      } else {
        setAiStatus({ live: true, label: data.modelUsed || "Gemini Multimodal Live" });
        triggerToast("Analisis Gemini AI Berhasil!");
      }
    } catch (err) {
      console.warn("AI analyze error:", err);
      setAiStatus({ live: false, label: "Offline Safe Mode" });
      triggerToast("Koneksi dialihkan ke Fallback");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeQuestionsCount = waQuestions.filter((q) => q.checked).length;

  return (
    <AppShell
      activeView={activeView}
      onSelectView={setActiveView}
      activeBrand={activeBrand}
      onSelectBrand={handleSwitchBrand}
      studioName={brandData.name}
      studioSector={brandData.sector}
      onResetSample={handleResetSample}
      aiStatus={aiStatus}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 bg-[#171717] text-white text-xs px-3.5 py-2.5 rounded-lg shadow-popover font-medium animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2 border border-[#262626]"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 1: BENTO WORKSPACE OVERVIEW                         */}
      {/* ======================================================== */}
      {activeView === "overview" && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150 min-w-0 w-full">
          {/* Executive Bento Strip */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3.5 sm:gap-4">
            {/* Bento Card 1: Value Ledger (Desktop: Span 5, Tablet: Span 2) */}
            <BentoCard className="md:col-span-2 xl:col-span-5 flex flex-col justify-between">
              <BentoHeader
                title="Nilai Kontrak Terkonfirmasi"
                subtitle="Dihitung 100% deterministik kode"
                badge={
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded font-medium border border-[#A7F3D0]">
                    Verified
                  </span>
                }
              />
              <div className="my-2 min-w-0">
                <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717] tabular-nums truncate">
                  {quotation.subtotalDisplay}
                </div>
                {quotation.hasUnconfirmedItems && (
                  <div className="mt-1.5 text-xs text-[#B45309] flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                    <span className="truncate">{quotation.unconfirmedCount} layanan butuh konfirmasi manual via WA</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F1F3F5] text-xs font-mono">
                <div>
                  <span className="text-[#737373] block text-[11px]">DP 50% di Awal</span>
                  <span className="font-semibold text-[#171717] text-sm tabular-nums">{quotation.dpAmountDisplay}</span>
                </div>
                <div>
                  <span className="text-[#737373] block text-[11px]">Pelunasan Akhir</span>
                  <span className="font-semibold text-[#171717] text-sm tabular-nums">{quotation.finalAmountDisplay}</span>
                </div>
              </div>
            </BentoCard>

            {/* Bento Card 2: Risk Velocity Radar (Desktop: Span 4, Tablet: Span 1) */}
            <BentoCard className="md:col-span-1 xl:col-span-4 flex flex-col justify-between">
              <BentoHeader
                title="Radar Risiko Brief"
                subtitle={`${currentBriefChips.length} frasa teranalisis AI`}
                badge={
                  <span className="text-[11px] font-mono font-medium text-[#737373]">
                    {briefStats.merah > 0 ? `${briefStats.merah} Rawan` : "Aman"}
                  </span>
                }
              />
              <div className="space-y-2.5 my-2">
                <div className="w-full h-2 rounded bg-[#F1F3F5] overflow-hidden flex">
                  <div style={{ width: `${briefStats.merahPct}%` }} className="bg-[#EF4444]" />
                  <div style={{ width: `${briefStats.kuningPct}%` }} className="bg-[#F59E0B]" />
                  <div style={{ width: `${briefStats.hijauPct}%` }} className="bg-[#10B981]" />
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#EF4444] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                    {briefStats.merah} Rawan
                  </span>
                  <span className="text-[#F59E0B] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    {briefStats.kuning} Ambigu
                  </span>
                  <span className="text-[#10B981] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {briefStats.hijau} Terukur
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#737373] leading-relaxed pt-2 border-t border-[#F1F3F5]">
                {briefStats.merah > 0
                  ? `Ditemukan ${briefStats.merah} klausul berpotensi memicu kerja tanpa bayaran.`
                  : "Ruang lingkup kerja sudah terukur rapi dalam paket resmi."}
              </p>
            </BentoCard>

            {/* Bento Card 3: Scope Guard Protocol (Desktop: Span 3, Tablet: Span 1) */}
            <BentoCard className="md:col-span-1 xl:col-span-3 flex flex-col justify-between">
              <BentoHeader
                title="Protokol Revisi"
                subtitle="SOP standar studio"
                badge={
                  <span className="text-[10px] font-mono bg-[#F1F3F5] text-[#171717] px-1.5 py-0.5 rounded font-medium">
                    SOP Aktif
                  </span>
                }
              />
              <div className="space-y-2 my-2 text-xs">
                <div className="flex items-baseline justify-between py-1 border-b border-[#F1F3F5]">
                  <span className="text-[#737373]">Revisi Mayor:</span>
                  <span className="font-semibold text-[#171717]">Maks {brandData.policy.revisiMayor}x</span>
                </div>
                <div className="flex items-baseline justify-between py-1">
                  <span className="text-[#737373]">Micro-Change:</span>
                  <span className="font-semibold text-[#171717]">{brandData.policy.microChange}x &bull; {brandData.policy.garansiHari} Hari</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#F1F3F5] text-xs text-[#737373]">
                PIC: <strong className="text-[#171717]">{brandData.persona}</strong>
              </div>
            </BentoCard>
          </section>

          {/* Quick Hub Navigation Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <BentoCard
              className="hover:border-[#171717] cursor-pointer group"
              noPadding
            >
              <div className="p-4 sm:p-5" onClick={() => setActiveView("brief")}>
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3">
                  <FileSearch className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-[#171717] group-hover:text-[#2563EB] transition-colors flex items-center justify-between">
                  <span>Bedah Brief & WA</span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-[#737373] mt-1">
                  Input chat klien, analisis risiko, dan draf pesan klarifikasi.
                </p>
              </div>
            </BentoCard>

            <BentoCard
              className="hover:border-[#171717] cursor-pointer group"
              noPadding
            >
              <div className="p-4 sm:p-5" onClick={() => setActiveView("contract")}>
                <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#10B981] flex items-center justify-center mb-3">
                  <Receipt className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-[#171717] group-hover:text-[#10B981] transition-colors flex items-center justify-between">
                  <span>Katalog & Nilai SKU</span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-[#737373] mt-1">
                  Atur item penawaran dan hitung total kontrak deterministik.
                </p>
              </div>
            </BentoCard>

            <BentoCard
              className="hover:border-[#171717] cursor-pointer group"
              noPadding
            >
              <div className="p-4 sm:p-5" onClick={() => setActiveView("proposal")}>
                <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] text-[#171717] flex items-center justify-center mb-3 border border-[#E5E7EB]">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-[#171717] transition-colors flex items-center justify-between">
                  <span>Proposal A4 PDF</span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-[#737373] mt-1">
                  Lembaran proposal formal 10 komponen siap cetak.
                </p>
              </div>
            </BentoCard>

            <BentoCard
              className="hover:border-[#171717] cursor-pointer group"
              noPadding
            >
              <div className="p-4 sm:p-5" onClick={() => setActiveView("guard")}>
                <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mb-3">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-[#171717] group-hover:text-[#EF4444] transition-colors flex items-center justify-between">
                  <span>Scope Guard</span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-[#737373] mt-1">
                  Evaluasi permintaan tambahan di tengah jalan secara santun.
                </p>
              </div>
            </BentoCard>
          </section>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: BRIEF & CLARIFICATION WORKSPACE                  */}
      {/* ======================================================== */}
      {activeView === "brief" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start animate-in fade-in duration-150 min-w-0 w-full">
          {/* Kolom Kiri: Input Chat WhatsApp & Draf WA (Span 6) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 min-w-0 w-full">
            <BentoCard>
              <BentoHeader
                title="Bedah Chat WhatsApp & Ekstraksi Brief"
                subtitle="Gemini AI membaca screenshot chat atau teks obrolan untuk menganalisis kebutuhan sebenarnya"
              />

              {/* Dual-Mode Tab Switcher */}
              <div className="flex items-center gap-1 p-1 bg-[#F1F3F5] rounded-lg mb-3.5">
                <button
                  type="button"
                  onClick={() => setActiveInputMode("upload")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs transition-all cursor-pointer ${
                    activeInputMode === "upload"
                      ? "bg-white text-[#171717] font-semibold shadow-xs"
                      : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Upload Screenshot WA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveInputMode("text")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs transition-all cursor-pointer ${
                    activeInputMode === "text"
                      ? "bg-white text-[#171717] font-semibold shadow-xs"
                      : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#525252]" />
                  <span>Ketik / Tempel Teks Manual</span>
                </button>
              </div>

              {/* Input Area Based on Mode */}
              {activeInputMode === "upload" ? (
                <div className="space-y-2">
                  <ImageDropzone
                    image={uploadedImage}
                    onImageChange={setUploadedImage}
                    disabled={isAnalyzing}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={5}
                    value={inputBriefText}
                    onChange={(e) => setInputBriefText(e.target.value)}
                    placeholder="Tempel transkrip chat WhatsApp di sini..."
                    className="w-full text-xs font-mono p-3 rounded-lg border border-[#E5E7EB] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] bg-[#F8F9FB] leading-relaxed placeholder:text-[#9CA3AF] min-w-0"
                    disabled={isAnalyzing}
                  />
                </div>
              )}

              <div className="mt-3.5 flex items-center justify-stretch sm:justify-end">
                <button
                  type="button"
                  disabled={
                    isAnalyzing ||
                    (activeInputMode === "upload" ? !uploadedImage : !inputBriefText.trim())
                  }
                  onClick={handleRunAiAnalysis}
                  className="w-full sm:w-auto h-9 px-4 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  <Sparkles
                    className={`w-3.5 h-3.5 text-white ${
                      isAnalyzing ? "animate-spin" : ""
                    }`}
                  />
                  <span>
                    {isAnalyzing
                      ? activeInputMode === "upload"
                        ? "Gemini Membedah Screenshot..."
                        : "AI Membedah Brief Teks..."
                      : activeInputMode === "upload"
                      ? "Bedah Screenshot dengan Gemini AI"
                      : "Bedah Brief dengan Gemini AI"}
                  </span>
                </button>
              </div>
            </BentoCard>

            {/* Draf Klarifikasi WA */}
            <BentoCard>
              <BentoHeader
                title="Draf Pertanyaan Klarifikasi WhatsApp"
                subtitle="Kunci ekspektasi tertulis sebelum klien membayar DP"
                badge={
                  <span className="text-[11px] font-mono text-[#10B981] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded">
                    {activeQuestionsCount} Poin Terpilih
                  </span>
                }
              />
              <div className="space-y-2 mb-4">
                {waQuestions.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => toggleWaQuestion(q.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer flex items-start gap-3 transition-colors ${
                      q.checked
                        ? "bg-[#F8F9FB] border-[#D1D5DB]"
                        : "bg-white border-[#E5E7EB] opacity-60"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-[#171717]">
                      {q.checked ? (
                        <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#9CA3AF]" />
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-medium text-[#171717] leading-tight">{q.text}</p>
                      <span className="text-[11px] text-[#737373] block">{q.context}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCopyWa}
                disabled={activeQuestionsCount === 0}
                className="w-full h-9 px-4 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isWaCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Draf Klarifikasi Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Pesan ke WhatsApp</span>
                  </>
                )}
              </button>
            </BentoCard>
          </div>

          {/* Kolom Kanan: Hasil Bedah Frasa (Span 6) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 min-w-0 w-full">
            <BentoCard>
              <BentoHeader
                title={`Hasil Bedah Frasa Klien (${currentBriefChips.length} Poin)`}
                subtitle="Klik baris klausul untuk membaca alasan hukum dan risiko teknis"
              />
              <div className="space-y-2">
                {currentBriefChips.map((chip) => {
                  const isExpanded = chip.id === expandedChipId;
                  let signalDot = "bg-[#10B981]";
                  let borderTone = "border-[#E5E7EB]";

                  if (chip.level === "merah") {
                    signalDot = "bg-[#EF4444]";
                    borderTone = isExpanded ? "border-[#EF4444]" : "border-[#FECDD3]";
                  } else if (chip.level === "kuning") {
                    signalDot = "bg-[#F59E0B]";
                    borderTone = isExpanded ? "border-[#F59E0B]" : "border-[#FDE68A]";
                  }

                  return (
                    <div
                      key={chip.id}
                      className={`rounded-lg border bg-white transition-all text-xs cursor-pointer ${borderTone}`}
                      onClick={() => setExpandedChipId(isExpanded ? null : chip.id)}
                    >
                      <div className="p-3 flex items-start gap-3">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${signalDot}`} />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#737373] gap-2">
                            <span className="truncate">{chip.category}</span>
                            <span className="shrink-0">{chip.speaker}</span>
                          </div>
                          <p className="font-semibold text-[#171717] leading-snug">
                            "{chip.quote}"
                          </p>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-3 pb-3 pt-2 border-t border-[#F1F3F5] bg-[#F8F9FB] text-xs space-y-1.5 animate-in fade-in duration-150">
                          <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider block">
                            Mengapa ini krusial?
                          </span>
                          <p className="text-[#374151] leading-relaxed">
                            {chip.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-[#F1F3F5] flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveView("contract")}
                  className="w-full sm:w-auto h-8 px-3.5 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Lanjut ke Katalog & Nilai SKU</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </BentoCard>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: CONTRACT & DETERMINISTIC SKU LEDGER              */}
      {/* ======================================================== */}
      {activeView === "contract" && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150 min-w-0 w-full">
          <BentoCard>
            <BentoHeader
              title={`Daftar Layanan & SKU Resmi (${brandData.name})`}
              subtitle="Sesuaikan kuantitas; angka rupiah dihitung 100% deterministik oleh kode."
              action={
                <button
                  type="button"
                  onClick={() => setShowAddCatalog(!showAddCatalog)}
                  className="h-8 px-3 rounded-lg border border-[#E5E7EB] hover:border-[#171717] bg-white text-xs font-semibold text-[#171717] flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah SKU Katalog</span>
                </button>
              }
            />

            {/* Add SKU Tray */}
            {showAddCatalog && (
              <div className="p-3.5 sm:p-4 mb-4 bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs font-semibold text-[#171717] flex-wrap gap-2">
                  <span>Pilih dari Katalog Resmi {brandData.name} ({activeBrandCatalog.length} SKU)</span>
                  <button
                    type="button"
                    onClick={() => setShowAddCatalog(false)}
                    className="text-xs text-[#737373] hover:text-[#171717]"
                  >
                    Tutup
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {activeBrandCatalog.map((cat) => (
                    <div
                      key={cat.sku}
                      className="p-2.5 bg-white border border-[#E5E7EB] rounded-md flex items-center justify-between gap-2 text-xs min-w-0"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[10px] text-[#737373] block">{cat.sku}</span>
                        <span className="font-semibold text-[#171717] truncate block">{cat.name}</span>
                        <span className="font-mono font-bold text-[#2563EB] text-[11px]">{formatRupiah(cat.price)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddSku(cat)}
                        className="h-7 px-2.5 text-[11px] bg-[#171717] hover:bg-[#262626] text-white rounded font-medium cursor-pointer shrink-0"
                      >
                        + Tambah
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Table with responsive horizontal scroll */}
            <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg w-full max-w-full min-w-0">
              <table className="w-full text-left text-xs min-w-[560px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8F9FB] text-[#737373] font-mono text-[11px] uppercase">
                    <th className="py-3 px-4">Layanan & Spesifikasi</th>
                    <th className="py-3 px-3 text-center w-28">Kuantitas</th>
                    <th className="py-3 px-4 text-right">Tarif Satuan</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                    <th className="py-3 px-3 text-center w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5] bg-white">
                  {quotation.items.map((lineItem, idx) => {
                    const original = items[idx];
                    const itemId = original?.id || `item-${idx}`;

                    return (
                      <tr key={itemId} className="hover:bg-[#F8F9FB] transition-colors">
                        <td className="py-3 px-4 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                lineItem.isUnconfirmed
                                  ? "bg-[#FEF3C7] text-[#92400E]"
                                  : "bg-[#F1F3F5] text-[#525252]"
                              }`}
                            >
                              {lineItem.sku}
                            </span>
                            <span className="font-semibold text-[#171717]">{lineItem.name}</span>
                          </div>
                          {original?.deliverable && (
                            <p className="text-[11px] text-[#737373] leading-tight">
                              {original.deliverable}
                            </p>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center border border-[#D1D5DB] rounded-md bg-white">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(itemId, -1)}
                              disabled={lineItem.quantity <= 1}
                              className="w-6 h-6 flex items-center justify-center text-[#737373] hover:text-[#171717] disabled:opacity-30 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-mono font-bold text-xs text-[#171717]">
                              {lineItem.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(itemId, 1)}
                              className="w-6 h-6 flex items-center justify-center text-[#737373] hover:text-[#171717] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right font-mono text-[#525252]">
                          {lineItem.unitPriceDisplay}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {lineItem.isUnconfirmed ? (
                            <span className="text-[10px] font-mono text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded font-semibold">
                              Perlu konfirmasi
                            </span>
                          ) : (
                            <span className="font-mono font-bold text-[#171717]">
                              {lineItem.lineTotalDisplay}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(itemId)}
                            className="text-[#9CA3AF] hover:text-[#EF4444] cursor-pointer transition-colors"
                            title="Hapus baris"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#171717] bg-[#F8F9FB] font-bold text-xs">
                    <td colSpan={3} className="py-3.5 px-4 text-right text-[#525252]">
                      Total Nilai Kontrak (Terkonfirmasi):
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-base text-[#2563EB]">
                      {quotation.subtotalDisplay}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-[#F1F3F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-[#737373]">
                Total di atas otomatis tertuang ke lembaran Proposal A4
              </span>
              <button
                type="button"
                onClick={() => setActiveView("proposal")}
                className="w-full sm:w-auto h-9 px-4 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Buka Lembar Proposal A4</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </BentoCard>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 4: PROPOSAL A4 VIEW                                 */}
      {/* ======================================================== */}
      {activeView === "proposal" && (
        <div className="animate-in fade-in duration-150 min-w-0 w-full overflow-x-hidden">
          <A4Proposal
            brandName={brandData.name}
            brandSector={brandData.sector}
            brandPersona={brandData.persona}
            clientName={brandData.proposal.client}
            documentNumber={
              activeBrand === "gemintang"
                ? "PROP/GEM/2026/11/001"
                : "PROP/MEM/2026/11/002"
            }
            validityDays={14}
            durationText={brandData.proposal.duration}
            quotation={quotation}
            exclusions={brandData.proposal.exclusions}
            revisiPolicy={brandData.policy}
            activeBrand={activeBrand}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 5: SCOPE GUARD VIEW                                 */}
      {/* ======================================================== */}
      {activeView === "guard" && (
        <div className="animate-in fade-in duration-150 min-w-0 w-full">
          <ScopeGuardPanel
            activeBrand={activeBrand}
            brandName={brandData.name}
          />
        </div>
      )}
    </AppShell>
  );
}
