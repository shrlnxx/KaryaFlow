"use client";

import React from "react";
import {
  LayoutDashboard,
  FileSearch,
  Receipt,
  FileCheck2,
  ShieldAlert,
  Monitor,
  Camera,
  X,
} from "lucide-react";
import { UMKMKey } from "../../data/mock-data";

export type NavViewId = "overview" | "brief" | "contract" | "proposal" | "guard";

interface SidebarProps {
  activeView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  activeBrand: UMKMKey;
  onSelectBrand: (brand: UMKMKey) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  activeView,
  onSelectView,
  activeBrand,
  onSelectBrand,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const navGroups = [
    {
      group: "WORKSPACE",
      items: [
        { id: "overview" as NavViewId, label: "Bento Overview", icon: LayoutDashboard },
      ],
    },
    {
      group: "ANALISIS & SCOPE",
      items: [
        { id: "brief" as NavViewId, label: "Bedah Brief & WA", icon: FileSearch },
        { id: "contract" as NavViewId, label: "Katalog & Nilai SKU", icon: Receipt },
      ],
    },
    {
      group: "OUTPUT & PROTEKSI",
      items: [
        { id: "proposal" as NavViewId, label: "Proposal A4 Siap Cetak", icon: FileCheck2 },
        { id: "guard" as NavViewId, label: "Scope Guard Simulator", icon: ShieldAlert },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        aria-label="Navigasi Utama"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 1. Studio / Brand Header */}
          <div className="p-4 border-b border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
                  KF
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold tracking-tight text-[#171717]">KaryaFlow</span>
                    <span className="text-[10px] font-medium bg-[#F1F3F5] text-[#737373] px-1.5 py-0.2 rounded">v1.2</span>
                  </div>
                  <p className="text-[11px] text-[#737373]">Scope & Margin Protection</p>
                </div>
              </div>

              {/* Close Button on Mobile Drawer */}
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#737373] hover:text-[#171717] hover:bg-[#F1F3F5] active:bg-[#E5E7EB] lg:hidden focus:outline-none focus:ring-2 focus:ring-[#171717]"
                aria-label="Tutup Menu Navigasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile / Persona Switcher */}
            <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-1 space-y-0.5">
              <span className="text-[10px] font-mono text-[#737373] px-2 py-0.5 uppercase tracking-wider block">
                Studio Aktif
              </span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectBrand("gemintang");
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#171717] ${
                    activeBrand === "gemintang"
                      ? "bg-white text-[#171717] font-semibold shadow-xs border border-[#E5E7EB]"
                      : "text-[#737373] hover:text-[#171717]"
                  }`}
                  aria-pressed={activeBrand === "gemintang"}
                >
                  <Monitor className="w-3 h-3 text-[#2563EB]" />
                  <span>Web Dev</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectBrand("memoku");
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#171717] ${
                    activeBrand === "memoku"
                      ? "bg-white text-[#171717] font-semibold shadow-xs border border-[#E5E7EB]"
                      : "text-[#737373] hover:text-[#171717]"
                  }`}
                  aria-pressed={activeBrand === "memoku"}
                >
                  <Camera className="w-3 h-3 text-[#2563EB]" />
                  <span>Foto/Video</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Grouped Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto" aria-label="Menu Halaman">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <span className="text-[10px] font-mono font-semibold text-[#9CA3AF] px-2.5 uppercase tracking-wider">
                  {group.group}
                </span>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectView(item.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#171717] ${
                          isActive
                            ? "bg-[#171717] text-white shadow-xs"
                            : "text-[#737373] hover:text-[#171717] hover:bg-[#F1F3F5]"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#737373]"}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* 3. Studio Footer Info */}
          <div className="p-3.5 border-t border-[#E5E7EB] bg-[#F8F9FB] text-xs">
            <div className="flex items-center justify-between text-[11px] text-[#737373] font-mono">
              <span>Track AI Ekraf</span>
              <span className="text-[#10B981] font-semibold">&bull; Topik 1</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
