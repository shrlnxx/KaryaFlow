"use client";

import React, { useState, useId, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faShieldHalved,
  faTriangleExclamation,
  faCalendarDays,
  faClock,
  faCircleCheck,
  faFileCircleCheck,
  faBuilding,
  faUser,
  faUserTie,
  faPenToSquare,
  faCheck,
  faCopy,
  faEnvelope,
  faPhone,
  faLocationDot,
  faBriefcase,
  faFileLines,
  faWandMagicSparkles,
  faChevronDown,
  faChevronUp,
  faArrowsRotate,
  faHourglassHalf,
  faBolt,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { QuotationCalculationResult } from "../lib/calculator";
import { calculateTimeline, TimelineConfig } from "../lib/timeline";

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

  // State Editor Panels
  const [showRecipientEditor, setShowRecipientEditor] = useState<boolean>(false);
  const [showTimelineEditor, setShowTimelineEditor] = useState<boolean>(false);
  const [copiedWa, setCopiedWa] = useState<boolean>(false);

  // State Timeline Estimator
  const [timelineConfig, setTimelineConfig] = useState<TimelineConfig>({
    startDate: "2026-11-03",
    baseDays: 10,
    bufferPercent: 20,
    mode: "standard",
  });

  const timeline = useMemo(() => {
    return calculateTimeline(timelineConfig, activeBrand);
  }, [timelineConfig, activeBrand]);

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
        ? "Pengembangan Website Profil Perusahaan & Layanan Digital"
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
        projectTitle: "Pengembangan Website Profil Perusahaan & Layanan Digital",
        documentNumber: "PROP/GEM/2026/11/001",
        issueDate: "3 November 2026",
        validityDays: 14,
        isVerified: true,
      });
      setTimelineConfig({
        startDate: "2026-11-03",
        baseDays: 10,
        bufferPercent: 20,
        mode: "standard",
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

  const expiryDate = "17 November 2026";

  const handleCopyWhatsApp = () => {
    const waText = `*SURAT PENAWARAN RESMI — GEMINTANG PRODUCTION*
Kepada Yth. *${recipient.picName || "Bapak/Ibu"}*
${recipient.picRole ? `(${recipient.picRole}) ` : ""}*${recipient.companyName || "Klien Terhormat"}*

Halo ${recipient.picName || "Bapak/Ibu"},
Menindaklanjuti diskusi ruang lingkup proyek *${recipient.projectTitle}*, berikut kami lampirkan ringkasan proposal penawaran resmi dari tim Gemintang Production:

📄 *No. Dokumen:* ${recipient.documentNumber}
📅 *Tanggal Terbit:* ${recipient.issueDate}
⏳ *Masa Berlaku:* ${recipient.validityDays} Hari Kalender (s.d. ${expiryDate})

*IKHTISAR INVESTASI & LINIMASA:*
• Total Nilai Investasi: *${quotation.subtotalDisplay}*
• Termin 1 (DP 50% Mulai Kerja): *${quotation.dpAmountDisplay}*
• Termin 2 (Pelunasan Serah Terima): *${quotation.finalAmountDisplay}*
• Estimasi Linimasa Kerja: *${timeline.totalDays} Hari Kerja (${timeline.mode === "express" ? "Mode Express" : `${timeline.baseDays}H + Buffer ${timeline.bufferPercent}%`})*
• Target Selesai / Go-Live: *${timeline.targetDateDisplay}*

*TAHAPAN PENGERJAAN (4 FASE):*
1. Fase 1: Discovery & Aset (${timeline.milestones[0]?.dayRange || "H1-H2"})
2. Fase 2: UI/UX & Layout (${timeline.milestones[1]?.dayRange || "H3-H5"})
3. Fase 3: Development & Coding (${timeline.milestones[2]?.dayRange || "H6-H8"})
4. Fase 4: Review, Revisi & Go-Live (${timeline.milestones[3]?.dayRange || "H9-H10"})

*GARANSI & BATASAN KERJA:*
• Garansi Bebas Bug: *${revisiPolicy.garansiHari} Hari Kalender*
• Batas Revisi Mayor: Maksimal ${revisiPolicy.revisiMayor}x putaran
• Batas Micro-change: ${revisiPolicy.microChange}x perubahan minor teks/warna
• Scope Exclusions: ${exclusions.slice(0, 2).join("; ")}

Untuk mengunci tanggal antrean produksi dan menerbitkan invoice DP, silakan balas pesan ini dengan *“SETUJU”*. Dokumen lembar proposal formal (PDF A4) siap kami kirimkan.

Terima kasih atas kepercayaan dan kerjasamanya.

Salam hormat,
*${brandPersona}*
Gemintang Production • IT Solutions & Creative Agency`;

    navigator.clipboard.writeText(waText).then(() => {
      setCopiedWa(true);
      setTimeout(() => setCopiedWa(false), 2500);
    });
  };

  const isGemintangBrand = activeBrand === "gemintang" || brandName.toLowerCase().includes("gemintang");

  return (
    <div className="space-y-3 sm:space-y-4 max-w-full overflow-hidden font-sans">
      {/* ======================================================== */}
      {/* 1. TOP ACTION & RECIPIENT GUARD BAR (NO-PRINT)            */}
      {/* ======================================================== */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E2E8F0] shadow-xs no-print space-y-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#0F172A]/10 text-[#0F172A] flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faFileCircleCheck} className="text-sm text-[#0F172A]" />
              </span>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-extrabold text-[#0F172A] tracking-tight">
                  Proposal Resmi &bull; Gemintang Production
                </h2>
                <p className="text-[11px] font-medium text-[#64748B] line-clamp-1 sm:line-clamp-none">
                  Format lembar A4 B2B siap cetak & simpan PDF &bull; Terintegrasi Estimasi Linimasa.
                </p>
              </div>
            </div>

            <div className="self-start sm:self-auto shrink-0 flex items-center gap-2">
              {recipient.isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-700 text-xs" />
                  <span>Data Terverifikasi</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-700 text-xs" />
                  <span>Draf Penerima</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Data Penerima, Estimasi Linimasa, Salin WA, Cetak PDF */}
          <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2 pt-1 border-t border-[#F1F5F9] sm:border-none sm:pt-0">
            {/* Tombol Data Penerima */}
            <button
              type="button"
              onClick={() => {
                setShowRecipientEditor((prev) => !prev);
                if (!showRecipientEditor) setShowTimelineEditor(false);
              }}
              className="flex items-center justify-center gap-1.5 h-9 px-3 text-xs font-bold text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] rounded-lg border border-[#CBD5E1] transition-colors shadow-xs"
              aria-expanded={showRecipientEditor}
            >
              <FontAwesomeIcon icon={faPenToSquare} className="text-xs text-[#1D4ED8]" />
              <span className="truncate">Data Penerima</span>
              <FontAwesomeIcon icon={showRecipientEditor ? faChevronUp : faChevronDown} className="text-[10px] text-[#64748B]" />
            </button>

            {/* Tombol Estimasi Linimasa (FITUR BARU) */}
            <button
              type="button"
              onClick={() => {
                setShowTimelineEditor((prev) => !prev);
                if (!showTimelineEditor) setShowRecipientEditor(false);
              }}
              className={`flex items-center justify-center gap-1.5 h-9 px-3 text-xs font-bold rounded-lg border transition-colors shadow-xs ${
                showTimelineEditor
                  ? "bg-[#0F172A] text-white border-[#0F172A]"
                  : "bg-[#F8FAFC] text-[#0F172A] hover:bg-[#F1F5F9] border-[#CBD5E1]"
              }`}
              aria-expanded={showTimelineEditor}
            >
              <FontAwesomeIcon icon={faHourglassHalf} className={`text-xs ${showTimelineEditor ? "text-amber-300" : "text-amber-600"}`} />
              <span className="truncate">Estimasi Linimasa</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-black hidden md:inline">
                {timeline.totalDays}H
              </span>
            </button>

            {/* Tombol Salin Ringkasan WA */}
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="flex items-center justify-center gap-1.5 h-9 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 rounded-lg border border-emerald-300 transition-colors shadow-xs"
              title="Salin teks penawaran berformat rapi untuk dikirim via WhatsApp"
            >
              {copiedWa ? (
                <>
                  <FontAwesomeIcon icon={faCheck} className="text-xs text-emerald-600" />
                  <span className="truncate">Tersalin ke WA!</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faWhatsapp} className="text-sm text-emerald-600" />
                  <span className="truncate">Salin ke WA</span>
                </>
              )}
            </button>

            {/* Tombol Cetak / PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 h-9 px-4 text-xs font-bold text-white bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#334155] rounded-lg transition-colors shadow-xs"
            >
              <FontAwesomeIcon icon={faPrint} className="text-xs" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PANEL BARU: ESTIMASI LINIMASA PENGERJAAN INTERAKTIF      */}
        {/* ======================================================== */}
        {showTimelineEditor && (
          <div className="mt-2 pt-3 border-t border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 rounded-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div>
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faHourglassHalf} className="text-amber-600 text-xs" />
                  <span>Kalkulator & Estimasi Linimasa Pengerjaan Proyek</span>
                </h3>
                <p className="text-[11px] font-medium text-[#64748B]">
                  Sesuaikan durasi hari kerja, buffer keamanan risiko revisi, dan mode pengerjaan secara real-time.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#64748B]">Target Selesai:</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  {timeline.targetDateDisplay}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* 1. Mode Pengerjaan */}
              <div className="bg-white p-2.5 rounded-lg border border-[#CBD5E1] space-y-1.5">
                <label className="text-[11px] font-bold text-[#0F172A] block">
                  Mode Pengerjaan:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTimelineConfig({ ...timelineConfig, mode: "standard" })}
                    className={`py-1.5 px-2 rounded text-xs font-bold transition-all text-center ${
                      timelineConfig.mode === "standard"
                        ? "bg-[#0F172A] text-white shadow-xs"
                        : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                    }`}
                  >
                    Standar (Normal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimelineConfig({ ...timelineConfig, mode: "express" })}
                    className={`py-1.5 px-2 rounded text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
                      timelineConfig.mode === "express"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                    }`}
                  >
                    <FontAwesomeIcon icon={faBolt} className="text-[10px]" />
                    <span>Fast-Track</span>
                  </button>
                </div>
                <p className="text-[10px] text-[#64748B]">
                  {timelineConfig.mode === "standard"
                    ? "Jadwal pengerjaan reguler dengan buffer waktu."
                    : "Prioritas antrean kilat (durasi dipadatkan)."
                  }
                </p>
              </div>

              {/* 2. Hari Kerja Dasar */}
              <div className="bg-white p-2.5 rounded-lg border border-[#CBD5E1] space-y-1.5">
                <label className="text-[11px] font-bold text-[#0F172A] block">
                  Durasi Kerja Dasar (Hari):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={3}
                    max={60}
                    value={timelineConfig.baseDays}
                    onChange={(e) => setTimelineConfig({ ...timelineConfig, baseDays: Math.max(1, parseInt(e.target.value) || 10) })}
                    className="w-16 text-xs font-black px-2 py-1.5 rounded bg-[#F8FAFC] border border-[#CBD5E1] text-center text-[#0F172A]"
                  />
                  <div className="flex flex-wrap gap-1">
                    {[7, 10, 14, 21].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setTimelineConfig({ ...timelineConfig, baseDays: days })}
                        className={`px-2 py-1 text-[10px] font-bold rounded border ${
                          timelineConfig.baseDays === days
                            ? "bg-[#0F172A] text-white border-[#0F172A]"
                            : "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1] hover:bg-[#E2E8F0]"
                        }`}
                      >
                        {days}H
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-[#64748B]">
                  Hari kerja murni tanpa menghitung keterlambatan materi.
                </p>
              </div>

              {/* 3. Buffer Keamanan Risiko Klien */}
              <div className="bg-white p-2.5 rounded-lg border border-[#CBD5E1] space-y-1.5">
                <label className="text-[11px] font-bold text-[#0F172A] block">
                  Buffer Risiko Revisi:
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[0, 15, 20, 30].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      disabled={timelineConfig.mode === "express"}
                      onClick={() => setTimelineConfig({ ...timelineConfig, bufferPercent: percent })}
                      className={`py-1 text-[10px] font-bold rounded border transition-all text-center ${
                        timelineConfig.bufferPercent === percent
                          ? "bg-[#0F172A] text-white border-[#0F172A]"
                          : "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1] hover:bg-[#E2E8F0]"
                      } ${timelineConfig.mode === "express" ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      +{percent}%
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#64748B]">
                  {timelineConfig.bufferPercent > 0
                    ? `Tambahan +${timeline.bufferDays} hari buffer antisipasi revisi & materi.`
                    : "Tanpa buffer waktu cadangan."}
                </p>
              </div>
            </div>

            {/* Rincian 4 Milestones */}
            <div className="bg-white p-2.5 rounded-lg border border-[#CBD5E1] space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#475569] block">
                Rincian 4 Tahapan Kerja (Roadmap Milestones):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {timeline.milestones.map((m) => (
                  <div key={m.id} className="p-2 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-[#1D4ED8]">
                      <span>FASE {m.phaseNumber}</span>
                      <span className="bg-[#E2E8F0] text-[#0F172A] px-1.5 py-0.2 rounded text-[9px]">{m.dayRange}</span>
                    </div>
                    <div className="font-bold text-[11px] text-[#0F172A]">{m.title}</div>
                    <div className="text-[9.5px] text-[#64748B] leading-tight">{m.activities}</div>
                    <div className="text-[9px] font-bold text-emerald-800 pt-0.5">Output: {m.output}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* COLLAPSIBLE RECIPIENT DATA EDITOR (ANTI-ERROR FORM)      */}
        {/* ======================================================== */}
        {showRecipientEditor && (
          <div className="mt-2 pt-3 border-t border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 rounded-lg space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div>
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-[#1D4ED8] text-xs" />
                  <span>Panel Validasi Data Penerima Proposal</span>
                </h3>
                <p className="text-[11px] font-medium text-[#64748B]">
                  Perubahan langsung memperbarui lembar A4 secara real-time.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 sm:pt-0 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleResetToPreset("gemintang")}
                  className="text-[#1D4ED8] font-semibold hover:underline flex items-center gap-1.5"
                >
                  <FontAwesomeIcon icon={faArrowsRotate} className="text-[10px]" />
                  <span>Preset B2B Sentosa</span>
                </button>
                <span className="text-[#CBD5E1]">&bull;</span>
                <button
                  type="button"
                  onClick={() => handleResetToPreset("fresh")}
                  className="text-[#64748B] font-medium hover:underline"
                >
                  Form Kosong
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="space-y-1">
                <label htmlFor={companyInputId} className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faBuilding} className="text-[#64748B] text-xs" />
                  <span>Nama Instansi / Perusahaan *</span>
                </label>
                <input
                  id={companyInputId}
                  type="text"
                  value={recipient.companyName}
                  onChange={(e) => setRecipient({ ...recipient, companyName: e.target.value })}
                  placeholder="Contoh: PT Gemilang Digital Nusantara"
                  className="w-full text-xs font-medium px-2.5 py-1.5 rounded bg-white border border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-[#0F172A]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={picInputId} className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUser} className="text-[#64748B] text-xs" />
                  <span>Nama PIC Penanggung Jawab *</span>
                </label>
                <input
                  id={picInputId}
                  type="text"
                  value={recipient.picName}
                  onChange={(e) => setRecipient({ ...recipient, picName: e.target.value })}
                  placeholder="Contoh: Bpk. Budi Pratama, S.T."
                  className="w-full text-xs font-medium px-2.5 py-1.5 rounded bg-white border border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-[#0F172A]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={picRoleInputId} className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faBriefcase} className="text-[#64748B] text-xs" />
                  <span>Jabatan / Divisi PIC</span>
                </label>
                <input
                  id={picRoleInputId}
                  type="text"
                  value={recipient.picRole}
                  onChange={(e) => setRecipient({ ...recipient, picRole: e.target.value })}
                  placeholder="Contoh: Head of IT / Manager"
                  className="w-full text-xs font-medium px-2.5 py-1.5 rounded bg-white border border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-[#0F172A]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={phoneInputId} className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faPhone} className="text-[#64748B] text-xs" />
                  <span>Nomor WhatsApp Aktif *</span>
                </label>
                <input
                  id={phoneInputId}
                  type="text"
                  value={recipient.phone}
                  onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                  placeholder="Contoh: +62 812-3456-7890"
                  className="w-full text-xs font-medium px-2.5 py-1.5 rounded bg-white border border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-[#0F172A]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={emailInputId} className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[#64748B] text-xs" />
                  <span>Email Klien</span>
                </label>
                <input
                  id={emailInputId}
                  type="email"
                  value={recipient.email}
                  onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
                  placeholder="Contoh: procurement@perusahaan.co.id"
                  className="w-full text-xs font-medium px-2.5 py-1.5 rounded bg-white border border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-[#0F172A]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={addressInputId} className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faLocationDot} className="text-[#64748B] text-xs" />
                  <span>Alamat / Kota Domisili</span>
                </label>
                <input
                  id={addressInputId}
                  type="text"
                  value={recipient.address}
                  onChange={(e) => setRecipient({ ...recipient, address: e.target.value })}
                  placeholder="Contoh: Jakarta Selatan"
                  className="w-full text-xs font-medium px-2.5 py-1.5 rounded bg-white border border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-[#0F172A]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label htmlFor={projectTitleInputId} className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faFileLines} className="text-[#64748B] text-xs" />
                  <span>Perihal / Judul Proyek</span>
                </label>
                <input
                  id={projectTitleInputId}
                  type="text"
                  value={recipient.projectTitle}
                  onChange={(e) => setRecipient({ ...recipient, projectTitle: e.target.value })}
                  placeholder="Contoh: Pembuatan Website E-Commerce & Profil Perusahaan"
                  className="w-full text-xs font-medium px-2.5 py-1.5 rounded bg-white border border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-[#0F172A]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={docNumberInputId} className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[#64748B] text-xs" />
                  <span>Nomor Dokumen</span>
                </label>
                <input
                  id={docNumberInputId}
                  type="text"
                  value={recipient.documentNumber}
                  onChange={(e) => setRecipient({ ...recipient, documentNumber: e.target.value })}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 rounded bg-white border border-[#CBD5E1] text-[#0F172A]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0]">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-[#64748B]">
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-[#64748B] text-xs" />
                  <span>Tgl:</span>
                  <input
                    id={issueDateInputId}
                    type="text"
                    value={recipient.issueDate}
                    onChange={(e) => setRecipient({ ...recipient, issueDate: e.target.value })}
                    className="w-24 text-xs font-semibold px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#0F172A]"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faClock} className="text-[#64748B] text-xs" />
                  <span>Berlaku:</span>
                  <input
                    id={validityDaysInputId}
                    type="number"
                    min={1}
                    max={60}
                    value={recipient.validityDays}
                    onChange={(e) => setRecipient({ ...recipient, validityDays: parseInt(e.target.value) || 14 })}
                    className="w-12 text-xs font-bold px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] text-center text-[#0F172A]"
                  />
                  <span>Hari</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#334155] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                <span>Simpan & Kunci Validasi</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. LEMBAR A4 RESMI SIAP CETAK (COMPACT & PRECISE 1-PAGE)  */}
      {/* ======================================================== */}
      <div className="bg-[#CBD5E1]/60 p-1 sm:p-5 md:p-6 rounded-xl border border-[#94A3B8] overflow-x-auto flex justify-center w-full max-w-full min-w-0 print:p-0 print:bg-white print:border-none">
        <article
          id="a4-proposal-sheet"
          className="bg-white text-[#0F172A] border border-[#CBD5E1] shadow-xl w-full max-w-[800px] min-h-[1080px] p-4 sm:p-7 md:p-9 space-y-2.5 text-[11px] leading-relaxed font-sans min-w-0 print:border-none print:shadow-none print:p-0 print:m-0 print:space-y-2 print:max-w-full print:min-h-0"
        >
          {/* ======================================================== */}
          {/* KOMPONEN 1: KOP SURAT RESMI (LOGO & BRAND LETTERHEAD)     */}
          {/* ======================================================== */}
          <header className="border-b-2 border-[#0F172A] pb-2.5 flex flex-row items-start justify-between gap-4 break-inside-avoid">
            {/* Logo Resmi & Identitas Studio */}
            <div className="flex items-center gap-3">
              {isGemintangBrand ? (
                <div className="shrink-0 bg-white p-1 rounded-lg border border-[#E2E8F0] shadow-xs">
                  <img
                    src="/gemintang-logo.png"
                    alt="Logo Resmi Gemintang Production"
                    className="h-11 sm:h-12 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-black text-base shrink-0">
                  {brandName.charAt(0)}
                </div>
              )}

              <div className="border-l-2 border-[#0F172A]/20 pl-2.5 space-y-0.5">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-[#0F172A] uppercase leading-none">
                  {brandName}
                </h1>
                <p className="text-[10px] font-bold text-[#1D4ED8] tracking-wider uppercase">
                  {brandSector}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 text-[9px] sm:text-[9.5px] font-medium text-[#475569] leading-tight pt-0.5">
                  <span>halo@gemintang.id</span>
                  <span>&bull;</span>
                  <span>+62 812-3456-7890</span>
                  <span>&bull;</span>
                  <span>Yogyakarta, ID</span>
                </div>
              </div>
            </div>

            {/* Metadata Dokumen Formal */}
            <div className="text-right space-y-0.5 shrink-0">
              <div className="inline-block bg-[#0F172A] text-white font-extrabold text-[8.5px] uppercase tracking-wider px-2 py-0.5 rounded">
                Surat Penawaran Resmi
              </div>
              <div className="text-[11px] sm:text-xs font-extrabold text-[#0F172A] tracking-tight">
                No: {recipient.documentNumber}
              </div>
              <div className="text-[9.5px] font-medium text-[#475569] flex items-center justify-end gap-1">
                <FontAwesomeIcon icon={faCalendarDays} className="text-[#64748B] text-[10px]" />
                <span>Tanggal: <strong className="font-bold text-[#0F172A]">{recipient.issueDate}</strong></span>
              </div>
              <div className="text-[9px] text-[#9A3412] font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300 inline-block">
                Masa Berlaku: {recipient.validityDays} Hari (s.d. {expiryDate})
              </div>
            </div>
          </header>

          {/* ======================================================== */}
          {/* KOMPONEN 2 & 3: PENERIMA PROPOSAL & PERIHAL PROYEK        */}
          {/* ======================================================== */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 break-inside-avoid">
            {/* KOTAK PENERIMA PROPOSAL B2B */}
            <div className="bg-[#F8FAFC] rounded-lg border border-[#CBD5E1] p-2.5 space-y-1">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#475569] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faBuilding} className="text-[#1D4ED8] text-xs" />
                  <span>DITUJUKAN KEPADA:</span>
                </span>
                {recipient.isVerified ? (
                  <span className="text-[8.5px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                    Terverifikasi
                  </span>
                ) : (
                  <span className="text-[8.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                    Draf
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-[#0F172A] tracking-tight">
                  {recipient.companyName || "Nama Instansi Belum Diisi"}
                </div>
                <div className="text-[11px] font-bold text-[#1D4ED8] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUser} className="text-[#64748B] text-xs shrink-0" />
                  <span>U.p. {recipient.picName || "Nama PIC Belum Diisi"}</span>
                  {recipient.picRole && (
                    <span className="text-[10px] text-[#475569] font-medium">
                      &bull; {recipient.picRole}
                    </span>
                  )}
                </div>

                <div className="pt-0.5 text-[9.5px] font-medium text-[#475569] space-y-0.2">
                  <div className="flex items-center gap-3">
                    {recipient.phone && <span>Tel/WA: <strong className="font-semibold text-[#0F172A]">{recipient.phone}</strong></span>}
                    {recipient.email && <span>Email: <strong className="font-semibold text-[#0F172A]">{recipient.email}</strong></span>}
                  </div>
                  {recipient.address && (
                    <div className="text-[#64748B] line-clamp-1">{recipient.address}</div>
                  )}
                </div>
              </div>
            </div>

            {/* RINGKASAN INTENT PROYEK */}
            <div className="bg-[#F8FAFC] rounded-lg border border-[#CBD5E1] p-2.5 space-y-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#475569] flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faFileLines} className="text-[#1D4ED8] text-xs" />
                    <span>PERIHAL PROYEK:</span>
                  </span>
                  <span className="text-[9px] font-bold text-[#475569] flex items-center gap-1">
                    <FontAwesomeIcon icon={faUserTie} className="text-[9px] text-[#64748B]" />
                    <span>PIC: {brandPersona.split(" ")[0]}</span>
                  </span>
                </div>

                <div className="mt-1 text-[11.5px] font-extrabold text-[#0F172A] leading-tight tracking-tight">
                  {recipient.projectTitle}
                </div>
                <p className="text-[10px] font-medium text-[#475569] mt-0.5 leading-relaxed">
                  Menetapkan spesifikasi deliverable terukur, kuota revisi resmi, dan linimasa pengerjaan bertahap dengan buffer SLA.
                </p>
              </div>

              <div className="pt-1 border-t border-[#E2E8F0] flex items-center justify-between text-[9px] text-[#475569] font-semibold">
                <span>Dokumen Sah &bull; Terikat SLA</span>
                <span className="text-[#1D4ED8] font-bold">KaryaFlow Scope Guard</span>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* KOMPONEN 4: KOTAK INVESTASI PROYEK & SKEMA TERMIN         */}
          {/* ======================================================== */}
          <section className="bg-[#0F172A] text-white rounded-lg p-2.5 sm:p-3 space-y-2 shadow-xs break-inside-avoid print:bg-[#0F172A] print:text-white">
            <div className="flex items-center justify-between border-b border-white/20 pb-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="text-xs text-[#FB923C]" />
                <span>Ringkasan Nilai Investasi & Linimasa Pengerjaan</span>
              </span>
              <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500">
                Pasti &bull; Non-Estimasi
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-1.5 bg-white/5 sm:bg-transparent rounded sm:rounded-none sm:border-r sm:border-white/20 last:border-none space-y-0.5">
                <span className="text-[9px] text-slate-300 font-semibold block">Total Nilai Kontrak</span>
                <span className="text-xs sm:text-sm font-black text-white tracking-tight block">
                  {quotation.subtotalDisplay}
                </span>
              </div>
              <div className="p-1.5 bg-white/5 sm:bg-transparent rounded sm:rounded-none sm:border-r sm:border-white/20 last:border-none space-y-0.5">
                <span className="text-[9px] text-slate-300 font-semibold block">Termin 1 (DP 50%)</span>
                <span className="text-xs sm:text-sm font-black text-[#FB923C] tracking-tight block">
                  {quotation.dpAmountDisplay}
                </span>
              </div>
              <div className="p-1.5 bg-white/5 sm:bg-transparent rounded sm:rounded-none sm:border-r sm:border-white/20 last:border-none space-y-0.5">
                <span className="text-[9px] text-slate-300 font-semibold block">Termin 2 (Pelunasan)</span>
                <span className="text-xs sm:text-sm font-black text-slate-100 tracking-tight block">
                  {quotation.finalAmountDisplay}
                </span>
              </div>
              <div className="p-1.5 bg-white/5 sm:bg-transparent rounded sm:rounded-none space-y-0.5">
                <span className="text-[9px] text-slate-300 font-semibold block">Estimasi Linimasa</span>
                <span className="text-[11px] sm:text-xs font-black text-emerald-300 tracking-tight block">
                  {timeline.totalDays} Hari Kerja
                </span>
              </div>
            </div>

            {quotation.hasUnconfirmedItems && (
              <div className="text-[9.5px] text-amber-200 bg-amber-950/70 p-1.5 rounded border border-amber-600 text-center font-semibold">
                * Terdapat <strong>{quotation.unconfirmedCount} item layanan</strong> berstatus estimasi terbuka yang perlu disepakati via konsultasi langsung.
              </div>
            )}
          </section>

          {/* ======================================================== */}
          {/* KOMPONEN BARU: ROADMAP ESTIMASI TAHAPAN PENGERJAAN        */}
          {/* ======================================================== */}
          <section className="space-y-1.5 break-inside-avoid">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] sm:text-[11px] font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <FontAwesomeIcon icon={faHourglassHalf} className="text-xs text-[#1D4ED8]" />
                <span>Roadmap Estimasi Linimasa Pengerjaan ({timeline.totalDays} Hari Kerja)</span>
              </h2>
              <span className="text-[8.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                <FontAwesomeIcon icon={faFlagCheckered} className="text-[9px] text-emerald-700" />
                <span>Target Selesai: {timeline.targetDateDisplay}</span>
              </span>
            </div>

            {/* 4-Fase Milestones Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {timeline.milestones.map((m) => (
                <div key={m.id} className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 space-y-1 relative">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1">
                    <span className="text-[9px] font-black text-[#1D4ED8]">
                      FASE {m.phaseNumber} ({m.dayRange})
                    </span>
                    <span className="text-[8.5px] font-bold text-[#64748B] bg-white px-1 py-0.2 rounded border border-[#E2E8F0]">
                      {m.durationDays} Hari
                    </span>
                  </div>
                  <div className="text-[10px] font-extrabold text-[#0F172A] leading-tight">
                    {m.title}
                  </div>
                  <div className="text-[8.5px] font-medium text-[#64748B] leading-tight line-clamp-2">
                    {m.activities}
                  </div>
                  <div className="text-[8.5px] font-bold text-emerald-800 bg-emerald-100/70 px-1 py-0.5 rounded leading-tight">
                    Output: {m.output}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[8.5px] text-[#64748B] italic leading-tight pt-0.5">
              * {timeline.clientSlaNote}
            </p>
          </section>

          {/* ======================================================== */}
          {/* KOMPONEN 5 & 7: TABEL RINCIAN RUANG LINGKUP & BIAYA SKU   */}
          {/* ======================================================== */}
          <section className="space-y-1 break-inside-avoid">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] sm:text-[11px] font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <FontAwesomeIcon icon={faFileCircleCheck} className="text-xs text-[#1D4ED8]" />
                <span>Rincian Layanan & Spesifikasi Deliverable (SKU)</span>
              </h2>
              <span className="text-[9px] font-bold text-[#64748B]">
                {quotation.items.length} Item Deliverable Terjadwal
              </span>
            </div>

            <div className="border border-[#CBD5E1] rounded-lg overflow-hidden w-full max-w-full">
              <table className="w-full text-left text-[10.5px]">
                <thead className="bg-[#F1F5F9] border-b border-[#CBD5E1] text-[#334155] text-[9px] uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="py-1.5 px-2.5 w-20">Kode SKU</th>
                    <th className="py-1.5 px-2.5">Nama Layanan & Spesifikasi Teknis</th>
                    <th className="py-1.5 px-2 text-center w-12">Qty</th>
                    <th className="py-1.5 px-2.5 text-right w-24">Tarif Satuan</th>
                    <th className="py-1.5 px-2.5 text-right w-24">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {quotation.items.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-1.5 px-2.5 font-bold text-[#1D4ED8] text-[9.5px]">
                        {line.sku}
                      </td>
                      <td className="py-1.5 px-2.5 space-y-0.2">
                        <div className="font-bold text-[#0F172A] text-[10.5px]">{line.name}</div>
                        {line.notes && (
                          <div className="text-[9.5px] font-medium text-[#64748B] leading-tight">
                            {line.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-1.5 px-2 text-center font-bold text-[#0F172A]">
                        {line.quantity}
                      </td>
                      <td className="py-1.5 px-2.5 text-right font-semibold text-[#475569] text-[10px]">
                        {line.unitPriceDisplay}
                      </td>
                      <td className="py-1.5 px-2.5 text-right font-black text-[#0F172A] text-[10.5px]">
                        {line.lineTotalDisplay}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F8FAFC] border-t-2 border-[#0F172A] text-[#0F172A]">
                  <tr>
                    <td colSpan={4} className="py-1.5 px-2.5 text-right text-[10px] uppercase tracking-wider font-black text-[#0F172A]">
                      Total Nilai Kontrak Investasi:
                    </td>
                    <td className="py-1.5 px-2.5 text-right font-black text-xs tracking-tight text-[#0F172A]">
                      {quotation.subtotalDisplay}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* ======================================================== */}
          {/* KOMPONEN 6, 8 & 9: 2-COLUMN BALANCED PROTECTIONS & TERMS */}
          {/* ======================================================== */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 break-inside-avoid">
            {/* KIRI: DAFTAR TEGAS TIDAK TERMASUK (EXCLUSIONS) */}
            <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-lg p-2.5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#881337] font-extrabold text-[10px] uppercase tracking-wider">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-xs text-[#E11D48] shrink-0" />
                <span>Scope Exclusions (Tidak Termasuk):</span>
              </div>
              <p className="text-[9px] font-medium text-[#9F1239] leading-tight">
                Di luar kesepakatan dasar; memerlukan add-on terpisah jika diminta:
              </p>
              <ul className="list-disc list-inside text-[9.5px] text-[#881337] space-y-0.5 pl-0.5">
                {exclusions.map((ex, i) => (
                  <li key={i} className="font-semibold leading-snug">
                    {ex}
                  </li>
                ))}
              </ul>
            </div>

            {/* KANAN: KEBIJAKAN REVISI, GARANSI & TERMIN */}
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2.5 space-y-1.5">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1">
                <span className="text-[10px] font-extrabold text-[#0F172A] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-xs text-emerald-700 shrink-0" />
                  <span>Ketentuan Revisi & Garansi</span>
                </span>
                <span className="text-[9px] font-bold text-[#64748B]">Garansi {revisiPolicy.garansiHari} Hari</span>
              </div>

              <div className="text-[9.5px] font-medium text-[#334155] space-y-0.5">
                <div className="flex justify-between items-center">
                  <span>Termin 1 (DP 50% Mulai Kerja):</span>
                  <span className="font-extrabold text-[#0F172A]">{quotation.dpAmountDisplay}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Termin 2 (Pelunasan 50% Handover):</span>
                  <span className="font-extrabold text-[#0F172A]">{quotation.finalAmountDisplay}</span>
                </div>
              </div>

              <ul className="text-[9px] text-[#475569] space-y-0.5 list-disc list-inside border-t border-[#E2E8F0] pt-1">
                <li>
                  Maksimal <strong className="font-bold text-[#0F172A]">{revisiPolicy.revisiMayor}x revisi mayor</strong> & <strong className="font-bold text-[#0F172A]">{revisiPolicy.microChange}x micro-changes</strong>.
                </li>
                <li>
                  Garansi cacat/bug sistem <strong className="font-bold text-[#0F172A]">{revisiPolicy.garansiHari} hari</strong> kalender terhitung sejak serah terima.
                </li>
              </ul>
            </div>
          </section>

          {/* ======================================================== */}
          {/* KOMPONEN 10: LEMBAR PENGESAHAN TANDA TANGAN DUAL-PARTY     */}
          {/* ======================================================== */}
          <section className="pt-2 border-t-2 border-[#0F172A] space-y-2 break-inside-avoid">
            <div className="text-center">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#64748B]">
                Lembar Pengesahan & Persetujuan Dokumen Penawaran
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Kolom Pihak Pertama (Penyedia Jasa) */}
              <div className="border border-[#CBD5E1] rounded-lg p-2.5 bg-[#F8FAFC] text-center space-y-1.5">
                <span className="text-[8.5px] text-[#64748B] block uppercase font-bold">
                  Pihak Pertama (Penyedia Jasa)
                </span>
                <div className="font-black text-[10.5px] text-[#0F172A] uppercase">
                  {brandName}
                </div>

                <div className="h-10 flex items-center justify-center">
                  <div className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                    [Tervalidasi Digital &bull; Scope Guard]
                  </div>
                </div>

                <div className="border-t border-[#CBD5E1] pt-1">
                  <div className="font-black text-[10.5px] text-[#0F172A]">{brandPersona}</div>
                  <div className="text-[9px] font-medium text-[#64748B]">Lead Consultant & Production PIC</div>
                  <div className="text-[8.5px] text-[#64748B] font-semibold">Tgl: {recipient.issueDate}</div>
                </div>
              </div>

              {/* Kolom Pihak Kedua (Klien / Penerima Proposal) */}
              <div className="border border-[#CBD5E1] rounded-lg p-2.5 bg-[#F8FAFC] text-center space-y-1.5">
                <span className="text-[8.5px] text-[#64748B] block uppercase font-bold">
                  Pihak Kedua (Klien / Penerima)
                </span>
                <div className="font-black text-[10.5px] text-[#0F172A] uppercase truncate">
                  {recipient.companyName || "Instansi Klien"}
                </div>

                <div className="h-10 flex items-center justify-center text-[9px] text-[#94A3B8] font-medium border-b border-dashed border-[#CBD5E1]">
                  (Tanda Tangan & Cap Instansi)
                </div>

                <div className="pt-1">
                  <div className="font-black text-[10.5px] text-[#0F172A]">
                    {recipient.picName || "Nama Terang PIC"}
                  </div>
                  <div className="text-[9px] font-medium text-[#64748B]">
                    {recipient.picRole || "Jabatan Penanggung Jawab"}
                  </div>
                  <div className="text-[8.5px] text-[#64748B] font-semibold">
                    Tgl Disetujui: _______________
                  </div>
                </div>
              </div>
            </div>

            {/* Fast Approval & Footer */}
            <div className="bg-[#F1F5F9] rounded-lg p-1.5 sm:p-2 text-center space-y-0.5 border border-[#CBD5E1]">
              <p className="text-[9.5px] font-medium text-[#334155] leading-tight flex items-center justify-center gap-1.5">
                <FontAwesomeIcon icon={faWhatsapp} className="text-emerald-600 text-xs" />
                <span>
                  Persetujuan Cepat: Balas WhatsApp resmi dengan kata <strong className="bg-white px-1.5 py-0.2 rounded border border-[#CBD5E1] font-bold text-[#0F172A]">"SETUJU"</strong> untuk mengunci antrean produksi atau kirimkan kembali salinan PDF ini.
                </span>
              </p>
            </div>

            <footer className="flex justify-between items-center text-[8.5px] font-semibold text-[#94A3B8] pt-1 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-1.5">
                <img src="/gemintang-logo.png" alt="Gemintang" className="w-3 h-3 object-contain inline-block shrink-0" />
                <span>Gemintang Production &bull; KaryaFlow Scope Guard Protection</span>
              </div>
              <div>Halaman 1 dari 1 (Dokumen Sah)</div>
            </footer>
          </section>
        </article>
      </div>
    </div>
  );
}
