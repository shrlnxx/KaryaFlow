# INFORMATION ARCHITECTURE: KARYAFLOW
**Version:** 1.0.0 (Phase 01 Modern Bento SaaS)  
**Standard:** Job-To-Be-Done (JTBD) Freelancer & Creative Studio Operational Lifecycle

---

## 1. Core User Mental Model
Seorang pelaku usaha kreatif (web studio, fotografer, desainer grafis) mengalami siklus proyek dalam 4 tahapan kritis:
1. **Intake & Risk Discovery:** Menerima pesan chat klien yang ambigu/berbahaya &rarr; Mendeteksi klausul revisi tak terbatas sebelum memulai.
2. **Deterministic Scoping:** Memetakan kebutuhan ke SKU resmi katalog dengan harga riil yang dihitung kode (bukan tebakan AI).
3. **Formal Commitment:** Mengirimkan Proposal A4 resmi dengan syarat termin DP 50% dan batasan tegas (*Exclusions*).
4. **Scope Guarding in Flight:** Menolak permintaan tambahan di tengah jalan secara santun, atau mengalihkannya ke add-on berbayar.

---

## 2. Navigasi & Pengelompokan Modul

```
KaryaFlow App Shell
├── 1. WORKSPACE (Executive Overview)
│   ├── Active Studio Profile (Gemintang Web / MemokuVisual Media)
│   ├── Key Performance Bento (Confirmed Contract Value, Brief Risk Velocity, Revision Protocol)
│   └── Quick Navigation Shortcuts
│
├── 2. BRIEF & RISK RADAR (Job Intake)
│   ├── Raw Chat Input & Textarea
│   ├── Gemini AI Clause Deconstruction
│   ├── Traffic Light Clause Stream (Red: High Risk, Yellow: Ambiguous, Green: Measured)
│   └── Pre-DP WhatsApp Clarification Checklist (1-Click Copy)
│
├── 3. CONTRACT & PRICING (Scope Definition)
│   ├── Official SKU Catalog Browser & Line Item Picker
│   ├── Real-time Deterministic Calculation Engine
│   ├── DP 50% & Final 50% Milestone Terms
│   └── Unconfirmed Item Safeguard (UNMAPPED)
│
├── 4. FORMAL PROPOSAL (A4 Deliverable)
│   ├── 10-Point Legal & Business Proposal Sheet
│   ├── Print / PDF Export Engine (@media print optimized)
│   └── Shareable WhatsApp Executive Summary
│
└── 5. SCOPE GUARD (Margin Protection Simulator)
    ├── Mid-Project Change Request Input
    ├── 3-Scenario Jury Test Presets (Covered, Out of Scope, Ambiguous)
    ├── AI Contract Evaluator & Decision Banner
    ├── Add-on SKU & Timeline Extension Mapping
    └── Polite WhatsApp Counter-Offer Generator
```

---

## 3. Data Flow & State Map Across Views

```
+-------------------------------------------------------------------------------+
| GLOBAL PERSISTENT STATE                                                       |
| - activeBrand: 'gemintang' | 'memoku'                                         |
| - currentBriefText: string                                                    |
| - currentChips: BriefChipItem[]                                               |
| - currentWaQuestions: WaQuestionItem[]                                        |
| - activeLineItems: WorkspaceLineItem[]                                        |
| - activeView: 'workspace' | 'brief' | 'pricing' | 'proposal' | 'guard'        |
+-------------------------------------------------------------------------------+
        |                     |                       |                 |
        v                     v                       v                 v
[1. Bento Workspace]   [2. Brief & WA]       [3. SKU & Pricing]   [4. Proposal] & [5. Scope Guard]
        |                     |                       |                 |
        +---------------------+-----------------------+-----------------+
                              |
                              v
              Pure Deterministic Calculator
           `calculateQuotation(activeLineItems)`
          (No Price Hallucination by Gemini AI)
```

---

## 4. Responsive Hierarchy Strategy

* **Desktop (&ge; 1024px):**
  - Left persistent navigation sidebar (compact 240px) with studio branding, active workspace selector, and grouped navigation items.
  - Top contextual bar (height 52px) featuring breadcrumbs, live model status pill, and quick simulation reset.
  - Bento Grid main viewport featuring high-density modular cards with generous whitespace.
* **Tablet (768px &ndash; 1023px):**
  - Collapsible icon-first sidebar (64px) to preserve maximum horizontal canvas width for tables and split comparison cards.
* **Mobile (< 768px):**
  - Top sticky navigation bar with slide-over drawer navigation and bottom quick-action switcher.
  - Bento cards stacked naturally into single-column layout without data loss.

