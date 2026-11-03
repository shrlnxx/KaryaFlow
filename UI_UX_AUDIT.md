# UI/UX AUDIT: KARYAFLOW APPLICATION
**Document:** System UI/UX Comprehensive Audit & Technical Evaluation  
**Project:** KaryaFlow &mdash; AI Scope Guard & Margin Protection for Creative Agencies & Freelancers (EKRAF x GCC Track AI)  
**Date:** 3 November 2026  
**Auditor:** Senior Product Designer & UI/UX Architect

---

## 1. Executive Summary & Existing Application Inventory

### 1.1 Technical Stack Inventory
* **Framework:** Next.js 14.2.23 (App Router with Server Components & Client Components)
* **Language & Runtime:** TypeScript 5.7+ / Node.js 24 LTS
* **Styling & CSS:** Tailwind CSS 3.4.17 + PostCSS 8 + Autoprefixer 10
* **Icons:** `lucide-react` (v0.474.0)
* **Validation & Schemas:** Zod 4.6.7
* **Utilities:** `clsx` 2.1.1, `tailwind-merge` 2.6.0
* **AI Engine:** Google AI Studio REST Integration (`gemini-3.5-flash-lite` / `gemini-3.8-flash` with deterministic JSON locking & Zod schema validation)

### 1.2 Route & File Structure Inventory
* **Routes:**
  * `/` (`src/app/page.tsx`): Single-page workspace dashboard containing state for Brand switching, Chat Brief Input, Traffic Light risk chips, WhatsApp clarification checklist, SKU table, A4 Proposal preview, and Scope Guard simulator.
  * `/api/analyze` (`src/app/api/analyze/route.ts`): Backend route calling Gemini AI to parse unstructured WhatsApp chats into structured risk clauses & proposed SKUs.
  * `/api/scope-guard` (`src/app/api/scope-guard/route.ts`): Backend route evaluating scope creep, add-on costs, extra workdays, and polite WhatsApp reply drafts.
* **Component Inventory:**
  * `src/components/A4Proposal.tsx`: Formal printable proposal sheet rendering 10 legal and business components.
  * `src/components/ScopeGuardPanel.tsx`: Change request evaluation panel with 3 judge presets, verdict banner, and WhatsApp reply copy box.
* **Core Business Logic Inventory:**
  * `src/lib/calculator.ts`: Pure deterministic quotation calculations (Subtotal, DP 50%, Pelunasan 50%, IDR formatting, protection against unmapped pricing hallucinations).
  * `src/lib/schemas.ts`: Strict Zod schemas for SKU validation, brief analysis, and scope verdicts.
  * `src/data/catalog.json`: Official SKU catalog for Gemintang Production & MemokuVisual.
  * `src/data/mock-data.ts`: High-fidelity scenarios for offline resilience and judge demonstrations.

---

## 2. UX Audit & Identified Friction Points

1. **Monolithic Page State in Single Canvas (`src/app/page.tsx`)**:
   * Currently, `src/app/page.tsx` hosts over 500 lines combining state management, header navigation, tab toggling, bento metric rendering, brief textarea, traffic light chips, WhatsApp checklist, and SKU data table.
   * While fast, it lacks a true **Global Application Shell** architecture (Sidebar, Contextual Topbar, Content Viewport).
2. **Missing Persistent Hierarchical Navigation**:
   * Navigation was previously switched via raw tab buttons (`Bento Workspace | Proposal A4 | Scope Guard`), which felt like an internal component switcher rather than an enterprise-grade SaaS navigation.
3. **Typography & Spacing Inconsistencies**:
   * Arbitrary font sizes and spacing (`py-2.5`, `my-3`, `gap-3.5`, `text-[11px]`, `text-[10px]`) were scattered across elements without a centralized design token mapping.
4. **Interactive vs Static Visual Hierarchy**:
   * Checkbox items and clickable risk cards shared similar borders with static information panels, causing cognitive load regarding what is interactive.
5. **Responsive Breakdown on Intermediate Viewports**:
   * On tablet widths (768px &ndash; 1024px), the 12-column layout squeezed the left chat column (5 cols) and right ledger table (7 cols), causing awkward horizontal scrolling on data tables.

---

## 3. Proposed Information Architecture

The application is structured into a logical, job-focused hierarchy that mirrors the freelancer/agency workflow:

1. **WORKSPACE (Overview & Executive Health)**
   - Project Persona Context (`Gemintang Production` vs `MemokuVisual`)
   - High-Level Contract Metric & Risk Velocity
   - Bento Workspace Canvas
2. **BRIEF & ANALYSIS (Intake & Risk Detection)**
   - Client Chat / Raw Brief Input
   - AI Clause Deconstruction & Traffic Light Risk Assessment
   - WhatsApp Pre-DP Clarification Generator
3. **CONTRACT MANAGEMENT (Scope & Commercial Terms)**
   - Service Catalog & SKU Picker
   - Interactive Quantity & Deterministic Ledger
   - 50/50 Payment Milestone Breakdown
   - Revision & Warranty Protocol
4. **DOCUMENTS (Client Deliverables)**
   - Proposal A4 Formal Sheet (Print & PDF Ready)
   - Exclusions Checklist & Legal Safeguards
5. **VALIDATION & PROTECTION (Scope Guard)**
   - Scope Creep Simulator
   - Change Request Verdict (`Covered` vs `Out of Scope` vs `Need Clarification`)
   - Polite WhatsApp Counter-Offer Generator

---

## 4. Design System Tokens (Specification)

### Color Palette
* **App Background:** `#F8F9FB`
* **Primary Surface (Card/Canvas):** `#FFFFFF`
* **Secondary Surface (Subtle Muted):** `#F1F3F5`
* **Primary Text (High Contrast):** `#171717`
* **Secondary Text (Muted):** `#737373`
* **Border Token (Crisp 1px):** `#E5E7EB`
* **Primary Accent (Trust Blue):** `#2563EB`
* **Success (Verified/Clear):** `#10B981`
* **Warning (Ambiguous/Clarify):** `#F59E0B`
* **Danger (High Risk/Out of Scope):** `#EF4444`

### Typography Scale
* **Page Title:** `24px` &ndash; `28px` (Semibold / Bold)
* **Section Heading:** `16px` &ndash; `18px` (Semibold)
* **Card Heading:** `14px` &ndash; `15px` (Medium / Semibold)
* **Body Text:** `13px` &ndash; `14px` (Regular)
* **Supporting / Caption Text:** `12px` (Regular / Medium)
* **Metadata / Monospace Numbers:** `11px` &ndash; `12px` (`font-mono`, tabular figures)

### Spacing & Grid System
* Base Grid: 4px / 8px incremental scale (`p-1`: 4px, `p-2`: 8px, `p-3`: 12px, `p-4`: 16px, `p-6`: 24px, `p-8`: 32px).
* Radii: `rounded-md` (6px), `rounded-lg` (10px), `rounded-xl` (14px), `rounded-2xl` (16px).

---

## 5. Phase 01 Implementation Plan

1. **Step 1:** Establish Design Tokens in [`src/app/globals.css`](file:///d:/GEMINTANG/KaryaFlow/src/app/globals.css) and configure Tailwind CSS theme extensions in [`tailwind.config.js`](file:///d:/GEMINTANG/KaryaFlow/tailwind.config.js).
2. **Step 2:** Formulate `INFORMATION_ARCHITECTURE.md` documenting navigation, state distribution, and module boundaries.
3. **Step 3:** Build Foundation Component System:
   * Reusable Shell Layout ([`src/components/layout/AppShell.tsx`](file:///d:/GEMINTANG/KaryaFlow/src/components/layout/AppShell.tsx))
   * Persistent Sidebar ([`src/components/layout/Sidebar.tsx`](file:///d:/GEMINTANG/KaryaFlow/src/components/layout/Sidebar.tsx))
   * Contextual Topbar with Breadcrumb & AI Indicator ([`src/components/layout/Topbar.tsx`](file:///d:/GEMINTANG/KaryaFlow/src/components/layout/Topbar.tsx))
   * Reusable Bento Container & Header Primitives ([`src/components/ui/BentoCard.tsx`](file:///d:/GEMINTANG/KaryaFlow/src/components/ui/BentoCard.tsx))
4. **Step 4:** Integrate the Application Shell into [`src/app/page.tsx`](file:///d:/GEMINTANG/KaryaFlow/src/app/page.tsx) without altering existing state or business calculations.
5. **Step 5:** Quality Control (Verification with `npm test`, `npx tsc --noEmit`, and `npm run build`).

