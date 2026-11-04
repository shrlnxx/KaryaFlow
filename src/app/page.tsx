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
  Search,
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
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isError?: boolean;
  } | null>(null);
  const [aiErrorAlert, setAiErrorAlert] = useState<string | null>(null);
  const [showAddCatalog, setShowAddCatalog] = useState<boolean>(false);
  const [catalogSearch, setCatalogSearch] = useState<string>("");
  const [catalogCategory, setCatalogCategory] = useState<string>("all");

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

  const filteredCatalog = useMemo(() => {
    return activeBrandCatalog.filter((item) => {
      const q = catalogSearch.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.revision_policy.toLowerCase().includes(q) ||
        JSON.stringify(item.attributes).toLowerCase().includes(q);

      const itemCat = (item as any).category || "feature";
      const matchesCategory =
        catalogCategory === "all" || itemCat === catalogCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeBrandCatalog, catalogSearch, catalogCategory]);

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

  // Business Impact Calculation for Risk Radar
  const BIAYA_PER_REVISI = 250000;
  const jumlah_rawan = briefStats.merah;
  const jumlah_ambigu = briefStats.kuning;
  const potensiKerugian = (jumlah_rawan + jumlah_ambigu) * BIAYA_PER_REVISI;

  // Auto-hitung totalKontrak client-side (tanpa DB)
  const totalKontrak = useMemo(() => {
    return items.reduce((sum, line) => {
      const cat = catalogData.items.find((c) => c.sku === line.sku);
      const unitPrice = cat ? cat.price : 0;
      return sum + unitPrice * (line.quantity ?? 1);
    }, 0);
  }, [items]);

  const dp50 = Math.round(totalKontrak * 0.5);
  const pelunasan = totalKontrak - dp50;

  // Toggle checkbox katalog
  const handleToggleCheckbox = (cat: typeof catalogData.items[0]) => {
    const existingIndex = items.findIndex((i) => i.sku === cat.sku);
    if (existingIndex >= 0) {
      setItems((prev) => prev.filter((i) => i.sku !== cat.sku));
      triggerToast(`${cat.name} dihapus dari pilihan`);
    } else {
      const newItem: WorkspaceLineItem = {
        id: `${cat.sku}-${Date.now()}`,
        sku: cat.sku,
        name: cat.name,
        quantity: 1,
        deliverable: Object.entries(cat.attributes)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", "),
        notes: cat.revision_policy,
      };
      setItems((prev) => [...prev, newItem]);
      triggerToast(`${cat.name} ditambahkan`);
    }
  };

  const handleSelectAllSkus = () => {
    const existingSkus = new Set(items.map((i) => i.sku));
    const toAdd: WorkspaceLineItem[] = [];
    activeBrandCatalog.forEach((cat) => {
      if (!existingSkus.has(cat.sku)) {
        toAdd.push({
          id: `${cat.sku}-${Date.now()}`,
          sku: cat.sku,
          name: cat.name,
          quantity: 1,
          deliverable: Object.entries(cat.attributes)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", "),
          notes: cat.revision_policy,
        });
      }
    });
    setItems((prev) => [...prev, ...toAdd]);
    triggerToast(`Seluruh (${activeBrandCatalog.length}) layanan dicentang`);
  };

  const handleClearAllSkus = () => {
    setItems([]);
    triggerToast("Pilihan layanan dikosongkan");
  };

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

  const triggerToast = (msg: string, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), isError ? 3400 : 2500);
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
    // 1. Validasi input: cegah fetch dan munculkan toast error jika teks < 10 karakter
    if (activeInputMode === "upload") {
      if (!uploadedImage) {
        triggerToast("Pilih atau upload screenshot chat WhatsApp terlebih dahulu.", true);
        return;
      }
    } else {
      const trimmedText = inputBriefText.trim();
      if (trimmedText.length < 10) {
        triggerToast("Teks brief minimal 10 karakter untuk dianalisis AI.", true);
        return;
      }
    }

    setIsAnalyzing(true);
    setAiErrorAlert(null); // Bersihkan error alert sebelumnya
    triggerToast(
      activeInputMode === "upload"
        ? "Gemini AI sedang membaca & menganalisis screenshot WA..."
        : "Memanggil Gemini AI membedah brief..."
    );

    // Timeout protection: abort jika melebihi 25 detik
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          brand: activeBrand,
          chatText: activeInputMode === "text" ? inputBriefText : undefined,
          imageBase64: activeInputMode === "upload" ? uploadedImage?.base64 : undefined,
          imageMimeType: activeInputMode === "upload" ? uploadedImage?.mimeType : undefined,
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!data || typeof data !== "object") {
        throw new Error("Format respons API tidak valid");
      }

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
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn("AI analyze error / timeout:", err);

      // Pastikan isLoading false & cegah UI crash (white screen)
      setIsAnalyzing(false);

      // Pertahankan data yang ada agar tidak blank/white screen
      const fallback = MOCK_SCENARIOS[activeBrand];
      if (!customBriefChips) {
        setCustomBriefChips(fallback.briefChips);
      }
      if (items.length === 0) {
        setItems(fallback.initialItems);
      }
      setAiStatus({ live: false, label: "Sistem AI Sibuk" });

      // Render komponen alert "Sistem AI sibuk, coba lagi nanti."
      setAiErrorAlert("Sistem AI sibuk, coba lagi nanti.");
      triggerToast("Sistem AI sibuk, coba lagi nanti.", true);
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
          className={`fixed bottom-5 right-5 z-50 text-xs px-3.5 py-2.5 rounded-lg shadow-popover font-medium animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2 border ${
            toastMessage.isError
              ? "bg-rose-950 text-rose-100 border-rose-800"
              : "bg-[#171717] text-white border-[#262626]"
          }`}
        >
          {toastMessage.isError ? (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
          )}
          <span>{toastMessage.text}</span>
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
                subtitle={`Konteks Evaluasi: Gemintang Production • ${currentBriefChips.length} frasa teranalisis AI`}
                badge={
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold bg-[#1D2A4D]/10 text-[#1D2A4D] px-2 py-0.5 rounded border border-[#1D2A4D]/20">
                      Gemintang Production
                    </span>
                    <span className="text-[11px] font-semibold text-[#737373]">
                      {briefStats.merah > 0 ? `${briefStats.merah} Rawan` : "Aman"}
                    </span>
                  </div>
                }
              />
              <div className="space-y-2.5 my-2">
                <div className="w-full h-2 rounded bg-[#F1F3F5] overflow-hidden flex">
                  <div style={{ width: `${briefStats.merahPct}%` }} className="bg-[#EF4444]" />
                  <div style={{ width: `${briefStats.kuningPct}%` }} className="bg-[#F59E0B]" />
                  <div style={{ width: `${briefStats.hijauPct}%` }} className="bg-[#10B981]" />
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#EF4444] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                    {briefStats.merah} Rawan
                  </span>
                  <span className="text-[#F59E0B] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    {briefStats.kuning} Ambigu
                  </span>
                  <span className="text-[#10B981] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {briefStats.hijau} Terukur
                  </span>
                </div>

                {/* Business Impact Calculation Alert Box (Emerald/Green Tailwind) */}
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-950 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Business Impact &bull; Gemintang Production
                      </span>
                      <span className="text-xs font-semibold text-emerald-900 block leading-tight mt-0.5">
                        Nilai Margin/Waktu yang Diselamatkan:
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-base sm:text-lg font-black text-emerald-950 font-mono tabular-nums">
                          Rp {potensiKerugian.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          ({jumlah_rawan} Rawan + {jumlah_ambigu} Ambigu &times; Rp 250rb)
                        </span>
                      </div>
                    </div>
                  </div>
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

              {/* Komponen Alert jika Sistem AI Sibuk / Timeout / Error */}
              {aiErrorAlert && (
                <div
                  role="alert"
                  className="mb-3.5 p-3.5 bg-rose-50 border border-rose-300 rounded-lg text-rose-950 flex items-start gap-2.5 animate-in fade-in duration-150"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-rose-950">
                        {aiErrorAlert}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAiErrorAlert(null)}
                        className="text-[10px] text-rose-700 hover:text-rose-950 font-semibold cursor-pointer underline"
                      >
                        Tutup
                      </button>
                    </div>
                    <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                      Layanan AI sedang mengalami antrean tinggi atau waktu pemrosesan melebihi batas. Sesi data Anda tetap aman dan Anda dapat mencoba kembali sesaat lagi.
                    </p>
                  </div>
                </div>
              )}

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
                    (activeInputMode === "upload" && !uploadedImage)
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
              title={`Katalog SKU & Checkbox Layanan (${brandData.name})`}
              subtitle="Pilih dan centang layanan proyek. Kalkulasi total kontrak, DP 50%, dan pelunasan dihitung 100% otomatis di sisi client (tanpa database)."
              badge={
                <span className="text-[11px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded font-semibold">
                  Auto-Hitung Client-Side
                </span>
              }
            />

            {/* Reaktif Financial Banner: Total Kontrak, DP 50%, Pelunasan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl text-emerald-950 shadow-xs my-4">
              {/* Total Nilai Kontrak */}
              <div className="p-3.5 bg-white rounded-lg border border-emerald-200 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Total Nilai Kontrak
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-950 font-mono tabular-nums block mt-1">
                    {formatRupiah(totalKontrak)}
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
                  <span>Layanan Terpilih:</span>
                  <span className="font-bold font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {items.length} SKU Aktif
                  </span>
                </div>
              </div>

              {/* DP 50% */}
              <div className="p-3.5 bg-white rounded-lg border border-emerald-200 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D2A4D] block">
                    Uang Muka Terhitung
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#1D2A4D] font-mono tabular-nums block mt-1">
                    DP 50%: {formatRupiah(dp50)}
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-emerald-100 text-[11px] text-zinc-500">
                  Wajib dibayar sebelum kickoff pengerjaan
                </div>
              </div>

              {/* Pelunasan */}
              <div className="p-3.5 bg-white rounded-lg border border-emerald-200 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700 block">
                    Sisa Pembayaran Proyek
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-zinc-900 font-mono tabular-nums block mt-1">
                    Pelunasan: {formatRupiah(pelunasan)}
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-emerald-100 text-[11px] text-zinc-500">
                  Dibayar setelah staging & serah terima
                </div>
              </div>
            </div>

            {/* Filter, Search & Quick Selection Controls */}
            <div className="space-y-3 mb-4">
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: "all", label: `Semua (${activeBrandCatalog.length})` },
                    { id: "core", label: "Paket Pokok" },
                    { id: "feature", label: "Fitur Mikro" },
                    { id: "addon", label: "Add-on & Maintenance" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCatalogCategory(tab.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        catalogCategory === tab.id
                          ? "bg-[#171717] text-white shadow-xs"
                          : "bg-white border border-[#E5E7EB] text-[#737373] hover:text-[#171717] hover:border-[#171717]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllSkus}
                    className="text-[11px] font-semibold text-[#171717] bg-[#F1F3F5] hover:bg-[#E5E7EB] px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    Pilih Semua
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllSkus}
                    className="text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    Kosongkan
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Ketik kata kunci layanan (mis. cms, notif email, dashboard, payment, seo)..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#1D2A4D] focus:border-[#1D2A4D] transition-colors"
                />
              </div>
            </div>

            {/* Checkbox List Layanan (Katalog SKU) */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredCatalog.map((cat) => {
                const existing = items.find((i) => i.sku === cat.sku);
                const isChecked = Boolean(existing);
                const qty = existing?.quantity ?? 1;
                const lineTotal = cat.price * qty;

                return (
                  <div
                    key={cat.sku}
                    onClick={() => handleToggleCheckbox(cat)}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? "border-emerald-500 bg-emerald-50/25 ring-1 ring-emerald-500/30 shadow-xs"
                        : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox control */}
                      <div className="mt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <label className="flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCheckbox(cat)}
                            className="w-4 h-4 rounded text-emerald-600 border-zinc-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                          />
                        </label>
                      </div>

                      {/* Info & Details */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F1F3F5] text-[#171717]">
                              {cat.sku}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-[#171717]">
                              {cat.name}
                            </span>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#1D2A4D]/10 text-[#1D2A4D]">
                              {(cat as any).category === "core"
                                ? "Paket Pokok"
                                : (cat as any).category === "feature"
                                ? "Fitur Mikro"
                                : "Add-on"}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-mono font-bold text-xs sm:text-sm text-[#2563EB]">
                              {formatRupiah(cat.price)}
                            </span>
                            <span className="text-[10px] text-[#737373] block">/ unit</span>
                          </div>
                        </div>

                        <p className="text-xs text-[#737373] leading-relaxed">
                          {cat.revision_policy}
                        </p>

                        {/* Interactive Quantity & Subtotal Bar when checked */}
                        {isChecked && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-between pt-2.5 mt-2 border-t border-emerald-200/70 flex-wrap gap-2 animate-in fade-in duration-100"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-emerald-950">
                                Kuantitas:
                              </span>
                              <div className="inline-flex items-center border border-emerald-300 rounded-md bg-white">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(existing!.id, -1)}
                                  disabled={qty <= 1}
                                  className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-black disabled:opacity-30 cursor-pointer"
                                  title="Kurangi kuantitas"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center font-mono font-bold text-xs text-emerald-950">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(existing!.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-black cursor-pointer"
                                  title="Tambah kuantitas"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] text-emerald-800 uppercase block font-semibold">
                                Subtotal Baris Terhitung:
                              </span>
                              <span className="font-mono font-black text-sm text-emerald-950">
                                {formatRupiah(lineTotal)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredCatalog.length === 0 && (
                <div className="py-12 text-center text-xs text-[#737373] bg-[#F8F9FB] rounded-lg border border-[#E5E7EB]">
                  Tidak ada layanan katalog yang cocok dengan filter &ldquo;{catalogSearch}&rdquo;.
                </div>
              )}
            </div>

            {/* Bottom Navigation to Proposal */}
            <div className="mt-5 pt-4 border-t border-[#F1F3F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-[#737373]">
                Hasil pilihan layanan & kalkulasi kontrak di atas langsung disinkronkan ke Proposal A4.
              </span>
              <button
                type="button"
                onClick={() => setActiveView("proposal")}
                className="w-full sm:w-auto h-9 px-4 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Lihat di Lembar Proposal A4</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </BentoCard>

          {/* Supplementary Table of Final Selected Lines */}
          {items.length > 0 && (
            <BentoCard>
              <BentoHeader
                title="Rincian Item Kontrak Terpilih"
                subtitle="Ringkasan spesifikasi deliverable dari seluruh layanan yang dicentang."
              />
              <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg w-full max-w-full min-w-0 my-3">
                <table className="w-full text-left text-xs min-w-[560px]">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8F9FB] text-[#737373] font-mono text-[11px] uppercase">
                      <th className="py-3 px-4">Layanan & Deliverable</th>
                      <th className="py-3 px-3 text-center w-24">Qty</th>
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
                          <td className="py-3 px-3 text-center font-mono font-bold text-xs text-[#171717]">
                            {lineItem.quantity}x
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-[#525252]">
                            {lineItem.unitPriceDisplay}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#171717]">
                            {lineItem.lineTotalDisplay}
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
                        {formatRupiah(totalKontrak)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </BentoCard>
          )}
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
