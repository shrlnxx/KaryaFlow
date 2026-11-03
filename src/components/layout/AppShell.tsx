"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, NavViewId } from "./Sidebar";
import { Topbar } from "./Topbar";
import { UMKMKey } from "../../data/mock-data";

interface AppShellProps {
  activeView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  activeBrand: UMKMKey;
  onSelectBrand: (brand: UMKMKey) => void;
  studioName: string;
  studioSector: string;
  onResetSample: () => void;
  aiStatus: {
    live: boolean;
    label: string;
  };
  children: React.ReactNode;
}

export function AppShell({
  activeView,
  onSelectView,
  activeBrand,
  onSelectBrand,
  studioName,
  studioSector,
  onResetSample,
  aiStatus,
  children,
}: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile drawer is open & handle Escape key
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsMobileMenuOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#171717] font-sans selection:bg-[#171717] selection:text-white flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      {/* 1. Global Navigation Sidebar */}
      <Sidebar
        activeView={activeView}
        onSelectView={onSelectView}
        activeBrand={activeBrand}
        onSelectBrand={onSelectBrand}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden transition-all duration-200">
        {/* Global Contextual Topbar */}
        <Topbar
          activeView={activeView}
          activeBrand={activeBrand}
          studioName={studioName}
          studioSector={studioSector}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onResetSample={onResetSample}
          aiStatus={aiStatus}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-6 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
