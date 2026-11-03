"use client";

import React, { useState, useId } from "react";
import {
  Printer,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck2,
  Building2,
  User,
  MessageCircle,
  Edit3,
  Check,
  Copy,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { QuotationCalculationResult } from "../lib/calculator";

export interface A4ProposalProps {
  brandName: string;
  brandSector: string;
  brandPersona: string;
  clientName: string;
  documentNumber: string;
  validityDays: number;
  durationText: string;
  quotation: QuotationCalculationResult;
  exclusions: string[];
  revisiPolicy: {
    revisiMayor: number;
    microChange: number;
    garansiHari: number;
  };
  activeBrand?: "gemintang" | "memoku" | string;
}

export interface RecipientFormData {
  companyName: string;
  picName: string;
  picRole: string;
  phone: string;
  email: string;
  address: string;
  projectTitle: string;
  documentNumber: string;
  issueDate: string;
  validityDays: number;
  isVerified: boolean;
}

export function A4Proposal({
  brandName,
  brandSector,
  brandPersona,
  clientName,
  documentNumber,
  validityDays,
  durationText,
  quotation,
  exclusions,
  revisiPolicy,
  activeBrand = "gemintang",
}: A4ProposalProps) {
  // Unique accessible IDs for form inputs
  const companyInputId = useId();
  const picInputId = useId();
  const picRoleInputId = useId();
  const phoneInputId = useId();
  const emailInputId = useId();
  const addressInputId = useId();
  const projectTitleInputId = useId();
  const docNumberInputId = useId();
  const issueDateInputId = useId();
  const validityDaysInputId = useId();

  // State Editor Penerima Proposal (Anti-Error Recipient Guard)
  const [showRecipientEditor, setShowRecipientEditor] = useState<boolean>(false);
  const [copiedWa, setCopiedWa] = useState<boolean>(false);

  // Inisialisasi data penerima dengan struktur B2B resmi
  const [recipient, setRecipient] = useState<RecipientFormData>(() => {
    const isGemintang = activeBrand === "gemintang" || brandName.toLowerCase().includes("gemintang");
    return {
      companyName: clientName || (isGemintang ? "PT Sentosa Ekraf Jaya" : "Memoku Retail Partners"),
      picName: isGemintang ? "Bpk. Hendra Gunawan" : "Ibu Ratna Paramitha",
      picRole: isGemintang ? "Direktur Operasional & Digital" : "Managing Director",
      phone: "+62 812-9876-5432",
      email: "hendra@sentosaekraf.id",
      address: "Gedung Sentosa Tower Lt. 8, Jl. H.R. Rasuna Said, Jakarta Selatan",
      projectTitle: isGemintang
        ? "Pengembangan Website Profil Perusahaan & Sistem Layanan Digital"
        : "Produksi Dokumentasi Visual & Creative Brand Package",
      documentNumber: documentNumber || (isGemintang ? "PROP/GEM/2026/11/001" : "PROP/MEM/2026/11/002"),
      issueDate: "3 November 2026",
      validityDays: validityDays || 14,
      isVerified: false,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  const handleVerify = () => {
    setRecipient((prev) => ({ ...prev, isVerified: true }));
  };

  const handleResetToPreset = (type: "gemintang" | "fresh") => {
    if (type === "gemintang") {
      setRecipient({
        companyName: "PT Sentosa Ekraf Jaya",
        picName: "Bpk. Hendra Gunawan",
        picRole: "Direktur Operasional & Digital",
        phone: "+62 812-9876-5432",
        email: "hendra@sentosaekraf.id",
        address: "Gedung Sentosa Tower Lt. 8, Jl. H.R. Rasuna Said, Jakarta Selatan",
        projectTitle: "Pengembangan Website Profil Perusahaan & Sistem Layanan Digital",
        documentNumber: "PROP/GEM/2026/11/001",
        issueDate: "3 November 2026",
        validityDays: 14,
        isVerified: true,
      });
    } else {
      setRecipient({
        companyName: "",
        picName: "",
        picRole: "",
        phone: "",
        email: "",
        address: "",
        projectTitle: "Proyek Solusi Digital & Kreatif",
        documentNumber: `PROP/GEM/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, "0")}/001`,
        issueDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        validityDays: 14,
        isVerified: false,
      });
    }
  };

  // Hitung tanggal kedaluwarsa penawaran
  const expiryDate = React.useMemo(() => {
    return "17 November 2026";
  }, [recipient.validityDays]);

  // Format Pesan Eksekutif WhatsApp siap salin
  const handleCopyWhatsApp = () => {
    const waText = `*SURAT PENAWARAN RESMI — GEMINTANG PRODUCTION*
Kepada Yth. *${recipient.picName || "Bapak/Ibu"}*
${recipient.picRole ? `(${recipient.picRole}) ` : ""}*${recipient.companyName || "Klien Terhormat"}*

Halo ${recipient.picName || "Bapak/Ibu"},
Menindaklanjuti diskusi ruang lingkup proyek *${recipient.projectTitle}*, berikut kami lampirkan ringkasan proposal penawaran resmi dari tim Gemintang Production:

📄 *No. Dokumen:* ${recipient.documentNumber}
📅 *Tanggal Terbit:* ${recipient.issueDate}
⏳ *Masa Berlaku:* ${recipient.validityDays} Hari Kalender (s.d. ${expiryDate})

*IKHTISAR INVESTASI & TERMIN:*
• Total Nilai Investasi: *${quotation.subtotalDisplay}*
• Termin 1 (DP 50% Mulai Kerja): *${quotation.dpAmountDisplay}*
• Termin 2 (Pelunasan Serah Terima): *${quotation.finalAmountDisplay}*
• Estimasi Linimasa: *${durationText}*

*GARANSI & BATASAN KERJA:*
• Garansi Bebas Bug: *${revisiPolicy.garansiHari} Hari Kalender*
• Batas Revisi Mayor: Maksimal ${revisiPolicy.revisiMayor}x putaran
• Batas Micro-change: ${revisiPolicy.microChange}x perubahan minor teks/warna
• Scope Exclusions: ${exclusions.slice(0, 2).join("; ")}

Untuk mengunci tanggal antrean produksi dan menerbitkan invoice DP, silakan balas pesan ini dengan *“SETUJU”*. Dokumen lembar proposal formal (PDF A4) siap kami kirimkan.

Terima kasih atas kepercayaan dan kerjasamanya.

Salam hormat,
*${brandPersona}*
Gemintang Production &bull; IT Solutions & Creative Agency`;

    navigator.clipboard.writeText(waText).then(() => {
      setCopiedWa(true);
      setTimeout(() => setCopiedWa(false), 2500);
    });
  };

  const isGemintangBrand = activeBrand === "gemintang" || brandName.toLowerCase().includes("gemintang");

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* 1. TOP ACTION & RECIPIENT GUARD BAR (NO-PRINT)            */}
      {/* ======================================================== */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-xs no-print space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#1D2A4D]/10 text-[#1D2A4D]">
                <FileCheck2 className="w-4 h-4 text-[#1D2A4D]" />
              </span>
              <h2 className="text-sm font-bold text-[#171717] tracking-tight">
                Generator Proposal Resmi &bull; Gemintang Production
              </h2>
              {recipient.isVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  Data Penerima Terverifikasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  Draf: Butuh Verifikasi Penerima
                </span>
              )}
            </div>
            <p className="text-xs text-[#737373]">
              Format lembaran standar A4 resmi B2B. Dilengkapi logo resmi Gemintang, proteksi ruang lingkup (Scope Guard), dan kolom validasi penerima.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tombol Edit Data Penerima */}
            <button
              type="button"
              onClick={() => setShowRecipientEditor((prev) => !prev)}
              className="flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold text-[#171717] bg-[#F8F9FB] hover:bg-[#F1F3F5] active:bg-[#E5E7EB] rounded-lg border border-[#E5E7EB] transition-colors shadow-xs"
              aria-expanded={showRecipientEditor}
              aria-label="Sesuaikan Data Penerima Proposal"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#1D2A4D]" />
              <span>Data Penerima</span>
              {showRecipientEditor ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#737373]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
              )}
            </button>

            {/* Tombol Salin Ringkasan WA */}
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 rounded-lg border border-emerald-200 transition-colors shadow-xs"
              title="Salin teks penawaran berformat rapi untuk dikirim via WhatsApp"
            >
              {copiedWa ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin ke WhatsApp!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Salin Ringkasan WA</span>
                </>
              )}
            </button>

            {/* Tombol Cetak / PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 h-9 px-4 text-xs font-semibold text-white bg-[#1D2A4D] hover:bg-[#15203b] active:bg-[#0e1628] rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Peringatan & Panduan Anti-Salah Data Penerima */}
        {!recipient.isVerified && (
          <div className="p-3 bg-amber-50/90 rounded-lg border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950">
                  Cegah Salah Kirim: Pastikan Data Penerima Sesuai Legalitas Klien!
                </p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Proposal ini masih mencantumkan nama percontohan (<em>{recipient.companyName}</em> - <em>{recipient.picName}</em>). Klik tombol di samping untuk memverifikasi atau menyesuaikan nama PT, PIC, dan nomor kontak resmi.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowRecipientEditor(true)}
                className="px-2.5 py-1 text-xs font-semibold bg-white text-amber-950 border border-amber-300 rounded hover:bg-amber-100 transition-colors"
              >
                Koreksi Data
              </button>
              <button
                type="button"
                onClick={handleVerify}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Kunci & Validasi</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* COLLAPSIBLE RECIPIENT DATA EDITOR (ANTI-ERROR FORM)      */}
        {/* ======================================================== */}
        {showRecipientEditor && (
          <div className="mt-3 pt-3 border-t border-[#E5E7EB] bg-[#F8F9FB] p-4 rounded-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1D2A4D]" />
                  <span>Panel Validasi & Formulir Data Penerima Proposal</span>
                </h3>
                <p className="text-[11px] text-[#737373]">
                  Data di bawah langsung memperbarui lembar A4 secara real-time. Memastikan dokumen sah secara hukum & tidak salah instansi/kontak.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleResetToPreset("gemintang")}
                  className="text-[11px] text-[#1D2A4D] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Preset B2B Sentosa</span>
                </button>
                <span className="text-[#D1D5DB]">&bull;</span>
                <button
                  type="button"
                  onClick={() => handleResetToPreset("fresh")}
                  className="text-[11px] text-[#737373] hover:underline"
                >
                  Form Kosong Baru
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Nama Perusahaan Klien */}
              <div className="space-y-1">
                <label htmlFor={companyInputId} className="text-[11px] font-semibold text-[#171717] flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#737373]" />
                  <span>Nama Instansi / Perusahaan Klien *</span>
                </label>
                <input
                  id={companyInputId}
                  type="text"
                  value={recipient.companyName}
                  onChange={(e) => setRecipient({ ...recipient, companyName: e.target.value })}
                  placeholder="Contoh: PT Gemilang Digital Nusantara"
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-white border border-[#D1D5DB] focus:outline-none focus:ring-1 focus:ring-[#1D2A4D] text-[#171717]"
                />
              </div>

              {/* Nama PIC Klien */}
              <div className="space-y-1">
                <label htmlFor={picInputId} className="text-[11px] font-semibold text-[#171717] flex items-center gap-1">
                  <User className="w-3 h-3 text-[#737373]" />
                  <span>Nama PIC (Person In Charge) *</span>
                </label>
                <input
                  id={picInputId}
                  type="text"
                  value={recipient.picName}
                  onChange={(e) => setRecipient({ ...recipient, picName: e.target.value })}
                  placeholder="Contoh: Bpk. Budi Pratama, S.T."
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-white border border-[#D1D5DB] focus:outline-none focus:ring-1 focus:ring-[#1D2A4D] text-[#171717]"
                />
              </div>

              {/* Jabatan PIC */}
              <div className="space-y-1">
                <label htmlFor={picRoleInputId} className="text-[11px] font-semibold text-[#171717] flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-[#737373]" />
                  <span>Jabatan / Divisi PIC</span>
                </label>
                <input
                  id={picRoleInputId}
                  type="text"
                  value={recipient.picRole}
                  onChange={(e) => setRecipient({ ...recipient, picRole: e.target.value })}
                  placeholder="Contoh: Head of IT / Operational Manager"
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-white border border-[#D1D5DB] focus:outline-none focus:ring-1 focus:ring-[#1D2A4D] text-[#171717]"
                />
              </div>

              {/* Nomor WhatsApp / Telepon */}
              <div className="space-y-1">
                <label htmlFor={phoneInputId} className="text-[11px] font-semibold text-[#171717] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#737373]" />
                  <span>Nomor WhatsApp / Kontak Aktif *</span>
                </label>
                <input
                  id={phoneInputId}
                  type="text"
                  value={recipient.phone}
                  onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                  placeholder="Contoh: +62 812-3456-7890"
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-white border border-[#D1D5DB] focus:outline-none focus:ring-1 focus:ring-[#1D2A4D] text-[#171717]"
                />
              </div>

              {/* Email Klien */}
              <div className="space-y-1">
                <label htmlFor={emailInputId} className="text-[11px] font-semibold text-[#171717] flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#737373]" />
                  <span>Email Resmi Klien</span>
                </label>
                <input
                  id={emailInputId}
                  type="email"
                  value={recipient.email}
                  onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
                  placeholder="Contoh: procurement@perusahaan.co.id"
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-white border border-[#D1D5DB] focus:outline-none focus:ring-1 focus:ring-[#1D2A4D] text-[#171717]"
                />
              </div>

              {/* Domisili / Alamat Perusahaan */}
              <div className="space-y-1">
                <label htmlFor={addressInputId} className="text-[11px] font-semibold text-[#171717] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#737373]" />
                  <span>Alamat / Kota Domisili</span>
                </label>
                <input
                  id={addressInputId}
                  type="text"
                  value={recipient.address}
                  onChange={(e) => setRecipient({ ...recipient, address: e.target.value })}
                  placeholder="Contoh: Gedung Artha Lt. 4, Jakarta"
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-white border border-[#D1D5DB] focus:outline-none focus:ring-1 focus:ring-[#1D2A4D] text-[#171717]"
                />
              </div>

              {/* Judul Proyek */}
              <div className="space-y-1 sm:col-span-2">
                <label htmlFor={projectTitleInputId} className="text-[11px] font-semibold text-[#171717] flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#737373]" />
                  <span>Perihal / Judul Proyek</span>
                </label>
                <input
                  id={projectTitleInputId}
                  type="text"
                  value={recipient.projectTitle}
                  onChange={(e) => setRecipient({ ...recipient, projectTitle: e.target.value })}
                  placeholder="Contoh: Pembuatan Website E-Commerce & Profil Perusahaan"
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-white border border-[#D1D5DB] focus:outline-none focus:ring-1 focus:ring-[#1D2A4D] text-[#171717]"
                />
              </div>

              {/* Nomor Surat & Masa Berlaku */}
              <div className="space-y-1">
                <label htmlFor={docNumberInputId} className="text-[11px] font-semibold text-[#171717] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#737373]" />
                  <span>Nomor Dokumen Proposal</span>
                </label>
                <input
                  id={docNumberInputId}
                  type="text"
                  value={recipient.documentNumber}
                  onChange={(e) => setRecipient({ ...recipient, documentNumber: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-white border border-[#D1D5DB] font-mono text-[#171717]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-4 text-[11px] text-[#737373]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#737373]" />
                  <span>Tgl Terbit:</span>
                  <input
                    id={issueDateInputId}
                    type="text"
                    value={recipient.issueDate}
                    onChange={(e) => setRecipient({ ...recipient, issueDate: e.target.value })}
                    className="w-28 text-xs px-1.5 py-0.5 rounded bg-white border border-[#D1D5DB] text-[#171717]"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#737373]" />
                  <span>Masa Berlaku:</span>
                  <input
                    id={validityDaysInputId}
                    type="number"
                    min={1}
                    max={60}
                    value={recipient.validityDays}
                    onChange={(e) => setRecipient({ ...recipient, validityDays: parseInt(e.target.value) || 14 })}
                    className="w-14 text-xs px-1.5 py-0.5 rounded bg-white border border-[#D1D5DB] text-center text-[#171717]"
                  />
                  <span>Hari</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1D2A4D] hover:bg-[#15203b] active:bg-[#0e1628] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan & Kunci Validasi Penerima</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. LEMBAR A4 RESMI SIAP CETAK (CLEAN CORPORATE PAPER)     */}
      {/* ======================================================== */}
      <div className="bg-[#E5E7EB]/70 p-2 sm:p-6 rounded-xl border border-[#D1D5DB] overflow-x-auto flex justify-center w-full max-w-full min-w-0">
        <article
          id="a4-proposal-sheet"
          className="bg-white text-[#171717] border border-[#D1D5DB] shadow-lg w-full max-w-[820px] min-h-[1140px] p-6 sm:p-10 md:p-12 space-y-6 text-xs leading-relaxed font-sans min-w-0 print:border-none print:shadow-none print:p-0"
        >
          {/* ======================================================== */}
          {/* KOMPONEN 1: KOP SURAT RESMI GEMINTANG PRODUCTION          */}
          {/* ======================================================== */}
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 border-b-2 border-[#1D2A4D] pb-5">
            <div className="flex items-start gap-4">
              {/* LOGO RESMI GEMINTANG PRODUCTION */}
              {isGemintangBrand ? (
                <div className="shrink-0 bg-white p-1 rounded-lg border border-[#E5E7EB] shadow-xs">
                  <img
                    src="/gemintang-logo.png"
                    alt="Logo Resmi Gemintang Production"
                    className="h-14 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#1D2A4D] text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {brandName.charAt(0)}
                </div>
              )}

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold tracking-tight text-[#1D2A4D] uppercase">
                    {brandName}
                  </h1>
                </div>
                <p className="text-[11px] font-semibold text-[#F26522] tracking-wide">
                  {brandSector}
                </p>
                <p className="text-[10px] text-[#737373] leading-tight">
                  Layanan Solusi Rekayasa Web, Sistem Informasi & Transformasi Digital
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-[#737373]">
                  <span>Email: <strong>halo@gemintang.id</strong></span>
                  <span>&bull;</span>
                  <span>WhatsApp: <strong>+62 812-3456-7890</strong></span>
                  <span>&bull;</span>
                  <span>Yogyakarta, ID</span>
                </div>
              </div>
            </div>

            {/* METADATA DOKUMEN PROPOSAL */}
            <div className="text-left sm:text-right space-y-1 sm:min-w-[210px] shrink-0">
              <div className="inline-block bg-[#1D2A4D] text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                Surat Penawaran Resmi (Proposal)
              </div>
              <div className="font-mono text-xs font-bold text-[#171717] pt-0.5">
                No: {recipient.documentNumber}
              </div>
              <div className="text-[11px] text-[#737373] flex items-center sm:justify-end gap-1.5">
                <Calendar className="w-3 h-3 text-[#737373]" />
                <span>Tanggal: <strong>{recipient.issueDate}</strong></span>
              </div>
              <div className="text-[11px] text-[#B45309] font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                Masa Berlaku: {recipient.validityDays} Hari (s.d. {expiryDate})
              </div>
            </div>
          </header>

          {/* ======================================================== */}
          {/* KOMPONEN 2 & 3: KOTAK IDENTITAS PENERIMA & EXECUTIVE INTENT */}
          {/* ======================================================== */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* KOTAK PENERIMA PROPOSAL B2B */}
            <div className="bg-[#F8F9FB] rounded-lg border border-[#E5E7EB] p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#1D2A4D]" />
                  <span>DITUJUKAN KEPADA (KLIEN / MITRA):</span>
                </span>
                {recipient.isVerified ? (
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    Terverifikasi
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                    Draf
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-[#171717]">
                  {recipient.companyName || "Nama Instansi Belum Diisi"}
                </div>
                <div className="text-xs font-semibold text-[#1D2A4D] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#737373]" />
                  <span>U.p. {recipient.picName || "Nama PIC Belum Diisi"}</span>
                  {recipient.picRole && (
                    <span className="text-[11px] text-[#737373] font-normal">
                      &bull; {recipient.picRole}
                    </span>
                  )}
                </div>

                <div className="pt-1 text-[11px] text-[#737373] space-y-0.5">
                  {recipient.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#737373]" />
                      <span>{recipient.phone}</span>
                    </div>
                  )}
                  {recipient.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#737373]" />
                      <span>{recipient.email}</span>
                    </div>
                  )}
                  {recipient.address && (
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3 h-3 text-[#737373] shrink-0 mt-0.5" />
                      <span className="leading-tight">{recipient.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RINGKASAN INTENT PROYEK */}
            <div className="bg-[#F8F9FB] rounded-lg border border-[#E5E7EB] p-4 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#1D2A4D]" />
                    <span>PERIHAL PROYEK:</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#737373]">
                    PIC Gemintang: {brandPersona.split(" ")[0]}
                  </span>
                </div>

                <div className="mt-2 text-xs font-bold text-[#171717] leading-snug">
                  {recipient.projectTitle}
                </div>
                <p className="text-[11px] text-[#737373] mt-1.5 leading-relaxed">
                  Dokumen ini menetapkan spesifikasi ruang lingkup terukur (deliverable scope), proteksi batas revisi, dan rincian alokasi biaya transparan berbasis kode deterministik.
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[10px] text-[#737373] font-mono">
                <span>Status Dokumen: Penawaran Sah</span>
                <span className="text-[#1D2A4D] font-semibold">Terkunci SLA</span>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* KOMPONEN 4: KOTAK INVESTASI PROYEK & SKEMA TERMIN         */}
          {/* ======================================================== */}
          <section className="bg-[#1D2A4D] text-white rounded-xl p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#F26522]" />
                <span>Ringkasan Nilai Investasi Proyek & Ketentuan Termin</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-600">
                Kalkulasi Pasti &bull; Non-Estimasi
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="space-y-0.5 border-r border-white/10 last:border-none pr-2">
                <span className="text-[10px] text-slate-300 block">Total Nilai Investasi</span>
                <span className="font-mono text-base sm:text-lg font-bold text-white tabular-nums tracking-tight">
                  {quotation.subtotalDisplay}
                </span>
              </div>
              <div className="space-y-0.5 border-r border-white/10 last:border-none pr-2">
                <span className="text-[10px] text-slate-300 block">Termin 1 (DP 50%)</span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#F26522] tabular-nums">
                  {quotation.dpAmountDisplay}
                </span>
              </div>
              <div className="space-y-0.5 border-r border-white/10 last:border-none pr-2">
                <span className="text-[10px] text-slate-300 block">Termin 2 (Pelunasan 50%)</span>
                <span className="font-mono text-base sm:text-lg font-bold text-slate-100 tabular-nums">
                  {quotation.finalAmountDisplay}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-300 block">Estimasi Linimasa Kerja</span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-emerald-300">
                  {durationText}
                </span>
              </div>
            </div>

            {quotation.hasUnconfirmedItems && (
              <div className="text-[11px] text-amber-200 bg-amber-950/60 p-2.5 rounded-lg border border-amber-700/60 text-center font-medium">
                * Terdapat <strong>{quotation.unconfirmedCount} item layanan</strong> berstatus estimasi terbuka yang perlu disepakati spesifikasi teknisnya via konsultasi langsung.
              </div>
            )}
          </section>

          {/* ======================================================== */}
          {/* KOMPONEN 5 & 7: TABEL RINCIAN RUANG LINGKUP & BIAYA SKU   */}
          {/* ======================================================== */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#1D2A4D] uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-[#1D2A4D]" />
                <span>Rincian Layanan & Spesifikasi Deliverable (Per SKU)</span>
              </h2>
              <span className="text-[10px] font-mono text-[#737373]">
                {quotation.items.length} Item Deliverable Terjadwal
              </span>
            </div>

            <div className="border border-[#D1D5DB] rounded-lg overflow-x-auto w-full max-w-full min-w-0">
              <table className="w-full text-left text-xs min-w-[520px]">
                <thead className="bg-[#F8F9FB] border-b border-[#D1D5DB] text-[#737373] text-[10px] font-mono uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold w-24">Kode SKU</th>
                    <th className="py-2.5 px-3 font-semibold">Nama Layanan & Spesifikasi Teknis</th>
                    <th className="py-2.5 px-3 font-semibold text-center w-14">Qty</th>
                    <th className="py-2.5 px-3 font-semibold text-right w-28">Tarif Satuan</th>
                    <th className="py-2.5 px-3 font-semibold text-right w-28">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {quotation.items.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-[#1D2A4D] text-[11px]">
                        {line.sku}
                      </td>
                      <td className="py-2.5 px-3 space-y-0.5">
                        <div className="font-bold text-[#171717]">{line.name}</div>
                        {line.notes && (
                          <div className="text-[11px] text-[#737373] leading-relaxed">
                            {line.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-medium tabular-nums text-[#171717]">
                        {line.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#737373]">
                        {line.unitPriceDisplay}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-[#171717]">
                        {line.lineTotalDisplay}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F8F9FB] border-t-2 border-[#1D2A4D] font-bold text-[#171717]">
                  <tr>
                    <td colSpan={4} className="py-3 px-3 text-right text-xs uppercase tracking-wider text-[#1D2A4D]">
                      Total Nilai Kontrak Investasi:
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm tabular-nums text-[#1D2A4D]">
                      {quotation.subtotalDisplay}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* ======================================================== */}
          {/* KOMPONEN 6: DAFTAR TEGAS "TIDAK TERMASUK (EXCLUSIONS)"     */}
          {/* ======================================================== */}
          <section className="bg-rose-50/80 border border-rose-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-950 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
              <span>Daftar Tegas Tidak Termasuk (Scope Exclusions):</span>
            </div>
            <p className="text-[11px] text-rose-900 leading-normal">
              Untuk mencegah salah paham selama pengerjaan, layanan di bawah ini dinyatakan di luar cakupan kontrak dasar dan membutuhkan <em>add-on work order</em> terpisah:
            </p>
            <ul className="list-disc list-inside text-xs text-rose-950 space-y-1 pl-1">
              {exclusions.map((ex, i) => (
                <li key={i} className="font-medium">
                  {ex}
                </li>
              ))}
            </ul>
          </section>

          {/* ======================================================== */}
          {/* KOMPONEN 8 & 9: SKEMA TERMIN & KEBIJAKAN REVISI / GARANSI */}
          {/* ======================================================== */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skema Termin */}
            <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-4 space-y-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] block">
                Skema Pembayaran & Ketentuan Kerjasama
              </span>
              <div className="space-y-2 text-xs text-[#171717]">
                <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-1.5">
                  <span className="font-medium">Termin 1 (DP 50% Mulai Kerja):</span>
                  <span className="font-mono font-bold text-[#1D2A4D]">{quotation.dpAmountDisplay}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Termin 2 (Pelunasan 50% Handover):</span>
                  <span className="font-mono font-bold text-[#1D2A4D]">{quotation.finalAmountDisplay}</span>
                </div>
              </div>
              <p className="text-[10px] text-[#737373] italic leading-tight pt-1 border-t border-[#E5E7EB]">
                Antrean produksi & pengerjaan dimulai efektif 1 hari kerja setelah konfirmasi bukti transfer termin pertama diterima.
              </p>
            </div>

            {/* Kebijakan Revisi & Garansi */}
            <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[#171717] font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Kebijakan Batas Revisi & Masa Garansi</span>
              </div>
              <ul className="text-xs text-[#171717] space-y-1.5 list-disc list-inside">
                <li>
                  Maksimal <strong>{revisiPolicy.revisiMayor}x putaran revisi mayor</strong> (alur navigasi & layout struktur).
                </li>
                <li>
                  Termasuk <strong>{revisiPolicy.microChange}x micro-changes</strong> (koreksi minor teks, palet warna, tipografi).
                </li>
                <li>
                  Garansi bebas error / cacat sistem selama <strong>{revisiPolicy.garansiHari} hari kalender</strong> terhitung sejak handover.
                </li>
              </ul>
            </div>
          </section>

          {/* ======================================================== */}
          {/* KOMPONEN 10: LEMBAR PENGESAHAN TANDA TANGAN DUAL-PARTY     */}
          {/* ======================================================== */}
          <section className="pt-2 border-t-2 border-[#1D2A4D] space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373]">
                Lembar Persetujuan & Pengesahan Surat Penawaran
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
              {/* Kolom Pihak Pertama (Penyedia Jasa) */}
              <div className="border border-[#E5E7EB] rounded-lg p-3.5 bg-[#F8F9FB] text-center space-y-3">
                <span className="text-[10px] font-mono text-[#737373] block uppercase font-semibold">
                  Pihak Pertama (Penyedia Jasa)
                </span>
                <div className="font-bold text-xs text-[#1D2A4D] uppercase">
                  {brandName}
                </div>

                <div className="h-16 flex items-center justify-center">
                  <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    [Tervalidasi Digital &bull; Scope Guard]
                  </div>
                </div>

                <div className="border-t border-[#D1D5DB] pt-1.5">
                  <div className="font-bold text-xs text-[#171717]">{brandPersona}</div>
                  <div className="text-[10px] text-[#737373]">Lead Consultant & Production PIC</div>
                  <div className="text-[10px] text-[#737373] font-mono mt-0.5">Tgl: {recipient.issueDate}</div>
                </div>
              </div>

              {/* Kolom Pihak Kedua (Klien / Penerima Proposal) */}
              <div className="border border-[#E5E7EB] rounded-lg p-3.5 bg-[#F8F9FB] text-center space-y-3">
                <span className="text-[10px] font-mono text-[#737373] block uppercase font-semibold">
                  Pihak Kedua (Klien / Penerima)
                </span>
                <div className="font-bold text-xs text-[#171717] uppercase truncate">
                  {recipient.companyName || "Instansi Klien"}
                </div>

                <div className="h-16 flex items-center justify-center text-[10px] text-[#9CA3AF] border-b border-dashed border-[#D1D5DB]">
                  (Tanda Tangan & Cap Instansi)
                </div>

                <div className="pt-1.5">
                  <div className="font-bold text-xs text-[#171717]">
                    {recipient.picName || "Nama Terang PIC"}
                  </div>
                  <div className="text-[10px] text-[#737373]">
                    {recipient.picRole || "Jabatan Penanggung Jawab"}
                  </div>
                  <div className="text-[10px] text-[#737373] font-mono mt-0.5">
                    Tgl Disetujui: _______________
                  </div>
                </div>
              </div>
            </div>

            {/* Cara Persetujuan Cepat via WhatsApp */}
            <div className="bg-[#F8F9FB] rounded-lg p-3 text-center space-y-1 border border-[#E5E7EB]">
              <div className="text-xs font-bold text-[#171717] flex items-center justify-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Tata Cara Persetujuan Dokumen (Fast-Track Approval):</span>
              </div>
              <p className="text-xs text-[#737373]">
                Klien dapat menyetujui dokumen ini secara langsung dengan membalas pesan WhatsApp resmi dengan kata <strong className="bg-white px-2 py-0.5 rounded border border-[#D1D5DB] font-mono text-[#171717]">"SETUJU"</strong> atau mengirimkan kembali salinan PDF yang telah ditandatangani.
              </p>
            </div>

            {/* Footer Lembar */}
            <div className="flex justify-between items-center text-[10px] font-mono text-[#9CA3AF] pt-2 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-1.5">
                <img src="/gemintang-logo.png" alt="Gemintang" className="w-3.5 h-3.5 object-contain inline-block" />
                <span>Dokumen Resmi Gemintang Production &bull; Didukung KaryaFlow AI Scope Guard</span>
              </div>
              <div>Halaman 1 dari 1</div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
