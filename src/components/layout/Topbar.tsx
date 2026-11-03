"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronRight,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { NavViewId } from "./Sidebar";
import { UMKMKey } from "../../data/mock-data";

interface TopbarProps {
  activeView: NavViewId;
  activeBrand: UMKMKey;
  studioName: string;
  studioSector: string;
  onOpenMobileMenu: () => void;
  onResetSample: () => void;
  aiStatus: {
    live: boolean;
    label: string;
  };
}

const VIEW_TITLES: Record<NavViewId, { title: string; subtitle: string }> = {
  overview: {
    title: "Bento Workspace Overview",
    subtitle: "Pusat kendali eksekutif untuk memantau nilai kontrak, risiko brief, dan batas revisi.",
  },
  brief: {
    title: "Bedah Brief & Klarifikasi WhatsApp",
    subtitle: "Deteksi klausul rawan (Traffic Light) dan kunci kesepakatan tertulis sebelum klien membayar DP.",
  },
  contract: {
    title: "Katalog Layanan & Kalkulator Nilai SKU",
    subtitle: "Penyusunan deliverable resmi dengan proteksi harga 100% deterministik kode.",
  },
  proposal: {
    title: "Pratinjau Proposal A4 Siap Cetak / PDF",
    subtitle: "Lembar dokumen formal siap dikirim ke klien dengan 10 komponen proteksi hukum.",
  },
  guard: {
    title: "Scope Guard Simulator",
    subtitle: "Pelindung margin usaha terhadap permintaan tambahan di tengah jalan.",
  },
};

export function Topbar({
  activeView,
  studioName,
  studioSector,
  onOpenMobileMenu,
  onResetSample,
  aiStatus,
}: TopbarProps) {
  const currentMeta = VIEW_TITLES[activeView];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 w-full">
      <div className="flex items-center justify-between gap-2 sm:gap-4 flex-nowrap w-full min-w-0">
        {/* Left: Mobile Toggle & Page Title / Breadcrumbs */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#737373] hover:text-[#171717] hover:bg-[#F1F3F5] active:bg-[#E5E7EB] lg:hidden focus:outline-none focus:ring-2 focus:ring-[#171717] transition-colors"
            aria-label="Buka Menu Navigasi"
          >
            <FontAwesomeIcon icon={faBars} className="text-sm" />
          </button>

          {/* Mobile View: Compact Single Line Page Title */}
          <div className="min-w-0 flex-1 sm:hidden flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-[#1D2A4D] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="text-[10px] font-bold">G</span>
            </div>
            <h1 className="font-semibold text-[#171717] text-xs leading-tight truncate">
              {currentMeta.title}
            </h1>
          </div>

          {/* Tablet & Desktop View: Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs min-w-0">
            <span className="font-semibold text-[#171717] shrink-0">{studioName}</span>
            <span className="text-[#9CA3AF] shrink-0 hidden md:inline">({studioSector})</span>
            <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-[#9CA3AF] shrink-0" />
            <span className="font-medium text-[#737373] truncate">
              {currentMeta.title}
            </span>
          </nav>
        </div>

        {/* Right: AI Model Status Badge & Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AI Status Badge */}
          <div
            className="flex items-center gap-1.5 text-[11px] font-bold bg-[#F8F9FB] border border-[#E5E7EB] px-2 py-1 sm:px-2.5 sm:py-1 rounded-md text-[#525252] select-none"
            title={aiStatus.label}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                aiStatus.live ? "bg-[#10B981] animate-pulse" : "bg-[#F59E0B]"
              }`}
            />
            {/* Desktop: Full Label; Mobile: Compact "AI" */}
            <span className="font-medium hidden sm:inline truncate max-w-[150px]">{aiStatus.label}</span>
            <span className="font-medium sm:hidden">AI</span>
          </div>

          {/* Reset / Sample Data Button */}
          <button
            type="button"
            onClick={onResetSample}
            className="flex items-center justify-center gap-1.5 h-8 sm:h-7 px-2.5 rounded-md border border-[#E5E7EB] hover:border-[#171717] bg-white text-xs font-medium text-[#525252] hover:text-[#171717] active:bg-[#F1F3F5] transition-colors shadow-xs shrink-0 focus:outline-none focus:ring-2 focus:ring-[#171717]"
            title="Muat Ulang Contoh Data Simulasi"
            aria-label="Muat Ulang Contoh Data Simulasi"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="text-xs text-[#737373]" />
            <span className="hidden sm:inline">Muat Ulang</span>
          </button>
        </div>
      </div>
    </header>
  );
}
