# DUCK Entertainment (`duckegy.com`) — AI Coding Agent Constitution & Architecture Blueprint (`AGENTS.md`)

> **Authority Level:** **MANDATORY & NON-NEGOTIABLE**  
> **Project:** DUCK Entertainment — Egypt Marine & Water Activities Platform (`IN DUCK WE TRUST`, B2C + B2B + Multi-Provider)  
> **Engineering Standard:** IEEE 29148 SRS v3.1 (`DUCK____Answers___Strategic_Direction.pdf` Synchronized) + Feature-Sliced Clean Architecture (React 19 + Vite 8)  
> **Visual Reference:** [`../FinalDesign/Final_4.html`](../FinalDesign/Final_4.html) (Premium, Minimal & Modern — Editorial Marine Aesthetic)

---

## 1. Mandatory Pre-Flight Protocol (Agent Operating Rules)

Every AI coding agent, subagent, or automated workflow operating in this repository **MUST** execute this pre-flight protocol before planning, creating, modifying, or deleting any code:

1. **Read & Cross-Reference First:**
   - Read this `AGENTS.md` file in full.
   - Cross-reference every business requirement, user flow, data contract, and acceptance criterion against [`duck_entertainment_comprehensive_project_brief_srs_for_vibe_coding.md`](./duck_entertainment_comprehensive_project_brief_srs_for_vibe_coding.md) and [`README.md`](./README.md).
2. **Strict Brand Identity Lock (Zero Hallucination):**
   - **NEVER** alter Duck's official logo (`logo-transparent.png`), typography direction, or exact official brand color palette:
     - **Deep Navy / Charcoal Base (Primary Text / Dark Headers / Footer):** `#121528` (`--color-navy`; PDF brief swatch ref: `#0C1226`)
     - **Nile / Sea Teal-Blue (Secondary / Water Theme / Links / Borders):** `#067BA1` (`--color-blue`; PDF brief swatch ref: `#147D9F`)
     - **Sunburst Yellow (Primary Sunlight Accent / High-Contrast CTAs / Egyptian Price Pills):** `#F5E847` (`--color-yellow`; PDF brief swatch ref: `#FDFB45`)
     - **Surfaces:** Crisp white (`#FFFFFF`), soft sea-mist tint (`#F3FAFC` / `#F7FBFD`), with minimum `4.5:1` WCAG contrast ratio.
   - **NEVER** invent unapproved activities, fake prices, stock/AI photos, locations, or contact details. Use only real DUCK operational photography, official contact details (`+201550061006`, `https://wa.me/201550061006`, `duck.asw@gmail.com`), and approved baseline pricing/capacities in Section 8.
   - **NO Background Music:** Never embed auto-playing audio or background music in any video or promotional asset (`SRS §2.2`).
3. **Inspect Before Creating (Reuse First — Zero Duplication):**
   - Always inspect existing code, styles, and shared/entity components (`src/shared/ui/`, `src/entities/*/ui/`, `src/features/`, `src/widgets/`) before creating new code so duplicate utilities/components are never introduced (per Client Strategic Direction §03).
   - **Legacy Folder Deprecation (`src/components/`):** The `src/components/` directory is a **deprecated legacy directory** superseded by FSD folders (`src/widgets/`, `src/features/`, `src/entities/`). **NEVER** add new code to `src/components/`.
4. **Scope & Production Preservation Enforcement:**
   - DUCK is a full **multi-provider Egypt water activities platform** supporting B2C, B2B (tiered packages + custom RFQ), and dynamic addition of new providers and destinations without editing code.
   - This repository is strictly the **Frontend Web Application** (connecting via `src/shared/api/` contracts). **NEVER** store raw credit card numbers (`NFR-008`), and **NEVER** alter the live production site database, OS, or hosting before auditing current infrastructure and creating & testing a verified **Backup & Recovery Plan** (Client Strategic Direction p.4).
5. **Living Documentation & Immediate `.md` Synchronization Rule:**
   - Whenever any architectural update, visual token change, package update, directory adjustment, new component/route addition, or important new engineering/business rule is introduced or discovered, the agent **MUST immediately update all Markdown (`.md`) files across the repository** (`AGENTS.md`, `README.md`, `duck_entertainment_comprehensive_project_brief_srs_for_vibe_coding.md`, and any files under `docs/`) in the same task so all documentation remains 100% synchronized.
6. **Mobile-First Experience & UI/UX Obsession (Top Priority Mandate):**
   - Over 80% of DUCK Entertainment's traffic arrives from mobile social media (Instagram & TikTok in-app browsers). **The mobile experience (`360px–430px`), visual UI/UX polish, ultra-easy booking ergonomics, and seamless responsiveness across all breakpoints are the #1 user-facing priority** of every task.

---

## 2. Visual Direction: Refined Nile & Sea Aesthetic (Zero Cartoonishness, 100% Duck Identity)

Keep Duck's exact brand colors (`#121528`, `#067BA1`, `#F5E847`) and welcoming, adventurous personality, but execute every surface with an **Editorial Marine / Sea-Inspired** polish matching [`Final_4.html`](../Final_4.html)—**never** cartoonish Neo-Brutalism:

- **Forbidden Cartoonish Patterns:**
  - **NO** thick `2px–3px` solid black borders (`#000` / `#121528` comic outlines).
  - **NO** hard comic offset shadows (`box-shadow: 6px 6px 0 #121528`).
  - **NO** flat cartoon vector SVG illustrations replacing real water/Nile scenes.
- **Required Editorial Marine Design Tokens (`src/shared/styles/tokens.css`):**
  - **Soft Oceanic Depth:** Use subtle, layered marine shadows (`--shadow-soft: 0 12px 32px rgba(18, 21, 40, 0.08)`, `--shadow-ocean: 0 20px 48px rgba(6, 123, 161, 0.12)`).
  - **Hairline Translucent Borders:** `--border-marine: 1px solid rgba(6, 123, 161, 0.16)` and `--border-subtle: 1px solid rgba(18, 21, 40, 0.08)`.
  - **Smooth Radii & Glassmorphism:** Smooth `20px–24px` (`--radius-card: 22px`, `--radius-lg: 24px`) card corners, `99px` pill buttons/badges, and frosted glass surfaces (`background: rgba(255, 255, 255, 0.74); backdrop-filter: blur(14px)`).
  - **Purposeful `#F5E847` Sunlight Accent:** Use `#F5E847` intentionally as a high-contrast sunlight highlight (primary CTAs, Egyptian price pills, active states, hero text highlight underline)—balanced calmly against deep `#121528` navy, `#067BA1` sea teal, and airy `#F3FAFC` / `#FFFFFF` backgrounds. Never flood entire sections with raw yellow backgrounds.
  - **Real Photography & Organic Wave Dividers:** Render real high-resolution photography (`object-fit: cover`) layered with subtle marine gradient overlays (`linear-gradient(135deg, rgba(18, 21, 40, 0.84), rgba(6, 123, 161, 0.68))`) and organic SVG wave dividers with hairline dark strokes (`stroke: #121528; stroke-width: 3.5px`). Example: Standalone Groups & Corporate Section (`#groups`) using real cover photo (`HSXR5504.JPG`).
  - **Decoupled Groups & B2B Navigation:** Group/corporate booking is decoupled from individual trip destination filters and given its own prominent navbar link (`حجز المجموعات` / `Groups & B2B`), standalone showcase section (`#groups`), and dedicated details & RFQ registration hub (`#groups-details`).

---

## 3. Mobile-First UX, Responsiveness & Ultra-Easy Appointment Booking (Top Priority)

### 3.1 Mobile-First Engineering (`360px+`)
Every screen, modal, card, filter bar, and table must be designed **Mobile-First** for Instagram & TikTok smartphone visitors before scaling up:
- **Progressive Breakpoints:** Base styles target **Mobile (`360px – 639px`)**, enhanced via `@media (min-width: 640px)`, `@media (min-width: 768px)` (Tablet), `@media (min-width: 1024px)` (Laptop), and `@media (min-width: 1280px)` (Desktop).
- **Zero Horizontal Overflow:** `overflow-x: hidden` on body; no card, dual-price badge, or table may break `360px` viewport bounds in `LTR` or `RTL`.
- **Thumb-Zone Tap Targets:** All interactive controls (buttons, date chips, slot pills, `QuantityStepper` `+`/`-`, language/currency switchers) **MUST** have `min-height: 48px–56px` (minimum `44px × 44px` hit area) with `>= 8px` gap between adjacent targets.
- **Sticky Mobile Bottom Booking Bar (`StickyBar.jsx`):** Fixed to `bottom: 0` on `< 768px` viewports with `padding-bottom: env(safe-area-inset-bottom)` showing live dual pricing and the primary CTA.
- **Swipe Carousels & Mobile Forms:** Galleries must support native touch swipe (`overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none`). Mobile form inputs must use `font-size >= 16px` (preventing iOS Safari zoom) and semantic `inputMode` (`tel`, `email`, `numeric`).

### 3.2 Ultra-Frictionless Appointment Booking (Under 45 Seconds on Mobile)
The **3-Step Guest-First Booking Flow** (`/booking` / `src/features/guest-checkout/`) must feel effortless on a phone:
1. **Step 1 — Pick Date, Time & Tickets (`StepDateSlotCount.jsx`):**
   - **One-Tap Quick Date Chips:** `Today` (`اليوم`), `Tomorrow` (`غداً`), `Day After` (`بعد غد`) + clean native/custom calendar date picker.
   - **Sunrise-to-Sunset Slot Pills (`BR-001`):** Tappable visual pills (`Sunrise`, `Morning`, `Afternoon`, `Sunset` with exact daylight hours).
   - **Instant `+ / -` Ticket Steppers (`QuantityStepper.jsx`):** Separate steppers for **Egyptian** vs. **Foreigner** participants with real-time split-ticket total calculation (`DualPriceSummary.jsx`) and optional Add-ons (`Transportation`, `Photography`). Strictly block `> 2` total units for Water Bike (`BR-003`).
2. **Step 2 — Minimal Guest Info (`StepGuestInfo.jsx`):**
   - **Only 3 Required Fields:** `Full Name`, `WhatsApp Phone` (`type="tel" inputMode="tel"`), and `Email` (`type="email" inputMode="email"`), plus the mandatory **24-Hour Free Cancellation Policy** agreement checkbox.
   - Auto-format phone input and **zero mandatory login/registration** before booking (`BR-010`).
3. **Step 3 — Online Payment & Post-Booking Account Prompt (`StepOnlinePayment.jsx` & `PostBookingAccountPrompt.jsx`):**
   - Seamless handoff/handling for Online Payment (`Success`, `Failed`, `Pending`).
   - **Failure Resilience (`NFR-007`):** Persist all Step 1 & Step 2 inputs in `sessionStorage` via `useSessionStorage.js` so payment failure never wipes user input and allows 1-tap retry.
   - **Post-Booking 1-Tap Account Prompt (`BR-010` / `FR-005`):** Immediately on confirmation (`BookingConfirmationPage.jsx`), display a friendly card pre-filled with the guest's Name, Email, and Phone—requiring **only a Password** to create an account in 1 click and track bookings in `/my-bookings`.

---

## 4. Tech Stack & Installed Packages Map

The repository is intentionally lean, zero-bloat, and built on **React 19** and **Vite 8** (`ESM`). Below is the exact manifest from `package.json`:

| Category | Installed Package / Native Capability | Version | Mandatory Usage Rules & Restrictions |
| :--- | :--- | :--- | :--- |
| **Core UI Framework** | `react`, `react-dom` | `^19.3.1` | Functional components, React 19 hooks, `React.lazy`, `Suspense`, `useMemo`, `useCallback`. Class components forbidden (except `ErrorBoundary.jsx`). |
| **Build & Bundler** | `vite`, `@vitejs/plugin-react` | `^8.3.6` | All env vars must use `VITE_` prefix and be read exclusively via `src/shared/config/env.js`. Configure `@` alias to `/src` in `vite.config.js`. |
| **Language & Types** | JavaScript (`ES2024+` / `.js`, `.jsx`) + `@types/react` | `^19.3.0` | `.jsx` for React components, `.js` for pure logic/services. Document domain models/contracts with JSDoc `@typedef` matching SRS §8 schemas. |
| **Routing Engine** | Custom / Lightweight Router in `src/app/routes/AppRouter.jsx` *(or `react-router-dom` if explicitly added)* | Native / Configured | Centralize route constants in `src/shared/config/routes.js`. Protect `/admin/*` via `src/app/routes/ProtectedRoute.jsx`. |
| **State Management** | React Context API + Custom Hooks (`src/app/providers/*`, `src/features/*/model/*`) | Built-in | Do **NOT** install Redux, MobX, or external state libraries. Global state is strictly `AuthProvider`, `LanguageProvider`, `CurrencyProvider`. Checkout state uses `BookingFlowProvider.jsx` + `useSessionStorage.js`. |
| **Styling System** | Vanilla CSS + CSS Custom Properties (`src/shared/styles/tokens.css`, `reset.css`) | Built-in | Do **NOT** install Tailwind, Bootstrap, MUI, or CSS-in-JS. Consume tokens from `tokens.css`. Purge default Vite boilerplate styles (`#aa3bff` purple and fixed `1126px` `#root` in `src/index.css`). |
| **Form Validation** | Pure Domain & Shared Validators (`src/shared/utils/validators.js`, `src/entities/booking/lib/*`) | Built-in | Validate synchronously via pure functions (`capacityValidator.js`, `cancellationPolicy.js`, `validators.js`) with bilingual `EN`/`AR` errors. |
| **i18n & Direction** | Dictionary Engine (`src/shared/i18n/ar.json`, `en.json`, `index.js`) + `LanguageProvider.jsx` | Built-in | Zero hardcoded UI strings in `.jsx`. Update `<html lang dir>` dynamically (`ar`/`rtl` ↔ `en`/`ltr`). |
| **Icons & Assets** | Inline SVG Components & Sprite (`public/icons.svg`, `public/favicon.svg`) | Built-in | Lightweight inline SVGs with `currentColor`. Mirror directional icons automatically in `[dir="rtl"]`. |
| **Linting & Testing** | `eslint` (`^10.14.0`), `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, Vitest (`vitest.config.js`) | Installed / Configured | Must pass `npm run lint` and `npm run build` with **0 errors and 0 warnings**. |

> **Strict Dependency Rule:** Do **NOT** run `npm install` to add duplicate UI kits, icon packs, date libraries, or state managers without explicit user approval.

---

## 5. Clean Architecture & Feature-First Directory Structure

This repository implements **Feature-Sliced Design (FSD) mapped strictly to Clean Architecture principles**:

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ 1. PRESENTATION LAYER (UI, Pages, Layouts, Widgets, Feature Flows)        │
│    src/pages/*  ──►  src/layouts/*  ──►  src/widgets/*  ──►  src/features/*│
│    (plus entity-specific dumb UI views in src/entities/*/ui/*)            │
├───────────────────────────────────────────────────────────────────────────┤
│ 2. DATA LAYER (API Services, Mocks, DTO Mappers, Session Persistence)     │
│    src/entities/*/api/*   │   src/shared/api/*   │   useSessionStorage.js │
├───────────────────────────────────────────────────────────────────────────┤
│ 3. DOMAIN LAYER (Entities, Value Objects, Business Rules & Validators)    │
│    src/entities/*/model/* │   src/entities/*/lib/* (Pure JS, Zero React)  │
├───────────────────────────────────────────────────────────────────────────┤
│ 4. CORE & SHARED KERNEL (App Providers, Route Guards, Design Tokens, UI)  │
│    src/app/*              │   src/shared/{ui,styles,config,i18n,hooks,lib}│
└───────────────────────────────────────────────────────────────────────────┘
```

### Canonical Directory Tree & Dependency Law

```text
src/
├── app/                        # Layer 1 (Top): App bootstrap, global providers, route guards
│   ├── providers/              # AppProviders, AuthProvider, LanguageProvider, CurrencyProvider, ErrorBoundary
│   ├── routes/                 # AppRouter, ProtectedRoute (/admin guard)
│   └── App.jsx
├── pages/                      # Layer 2: Thin route screens (max ~80-100 lines)
├── layouts/                    # Layer 3: MainLayout, BookingLayout, AdminLayout
├── widgets/                    # Layer 4: Autonomous page sections (Hero, Navbar, ActivitiesGrid, FAQ, Footer...)
├── features/                   # Layer 5: Interactive user flows (guest-checkout, post-booking-account, b2b-quote...)
│   └── <feature-slice>/
│       ├── model/              # Feature state hooks/providers (BookingFlowProvider, useBookingFlow)
│       ├── ui/                 # Step UI components (StepDateSlotCount, StepGuestInfo, StepOnlinePayment)
│       └── index.js            # Public API barrel export
├── entities/                   # Layer 6: Core Business Domain & Data Services
│   └── <entity-slice>/         # (activity, addon, booking, destination, quote, review, user)
│       ├── lib/                # Pure JS domain rules (priceCalculator, capacityValidator, cancellationPolicy, timeSlots)
│       ├── model/              # Domain schemas, approved pricing/data, status enums
│       ├── api/                # Entity data repositories (activityService, bookingService, quoteService...)
│       ├── ui/                 # Entity UI views (ActivityCard, PriceBadge, LimitedSeatsBadge...)
│       └── index.js            # Public API barrel export
└── shared/                     # Layer 7 (Bottom): Domain-agnostic primitives & infrastructure
    ├── api/                    # httpClient.js & mock adapters
    ├── config/                 # constants.js, env.js, routes.js
    ├── hooks/                  # useCurrency.js, useMediaQuery.js, useSessionStorage.js
    ├── i18n/                   # en.json, ar.json, index.js
    ├── lib/                    # formatters.js, analytics.js, seo.jsx
    ├── styles/                 # tokens.css, reset.css
    ├── ui/                     # Reusable custom widgets (Button, StickyBar, QuantityStepper, Modal...)
    └── utils/                  # validators.js
```

#### Strict Dependency Rules:
1. **Inward / Downward Imports Only:** `app` ➔ `pages` ➔ `layouts` ➔ `widgets` ➔ `features` ➔ `entities` ➔ `shared`.
2. **Forbidden Upward Imports:** `shared/` never imports from `entities/` or above; `entities/` never imports from `features/` or above; `features/` never imports from `widgets/` or above.
3. **No Raw Math or Hardcoded Arrays in UI:** UI components must **never** inline pricing math or hardcoded activity arrays—always delegate to `priceCalculator.js`, `capacityValidator.js`, and entity services.

---

## 6. Component Granularity, Naming & Custom Widget Rules

### 6.1 Small, Single-Responsibility Files (Strict Line & Complexity Ceiling)
- **UI Component Line Ceiling:** **Maximum `120–150` lines** per `.jsx` file.
- **Page Component Line Ceiling:** **Maximum `80–100` lines** per Page file in `src/pages/`.
- **Domain/Utility Module Ceiling:** **Maximum `120` lines** per `.js` file; cyclomatic complexity `< 8`.
- **Mandatory Decomposition:** Any component with `> 2` nested conditional/loop levels, multiple visual sub-sections, or `> 150` lines **MUST** be split into smaller sub-widgets and custom hooks (`model/use*.js`).

### 6.2 Strict File & Symbol Naming Conventions

| Artifact Type | Naming Pattern | Location | Canonical Examples |
| :--- | :--- | :--- | :--- |
| **Feature / Widget / Entity Folders** | `kebab-case` | `src/{pages,widgets,features,entities}/` | `guest-checkout/`, `post-booking-account/`, `b2b-quote/` |
| **Shared UI Widget Folders** | `PascalCase` | `src/shared/ui/<WidgetName>/` | `QuantityStepper/`, `StickyBar/`, `SectionHeader/`, `DatePicker/` |
| **React Components (`.jsx`)** | `PascalCase.jsx` | `ui/` or widget root | `PriceBadge.jsx`, `DualPriceSummary.jsx`, `LimitedSeatsBadge.jsx`, `StepGuestInfo.jsx` |
| **Component Stylesheets (`.css`)** | `PascalCase.css` | Co-located with `.jsx` | `Button.css`, `Input.css` |
| **Custom Hooks (`.js`)** | `useCamelCase.js` | `shared/hooks/` or `features/*/model/` | `useBookingFlow.js`, `useCurrency.js`, `useSessionStorage.js` |
| **Domain Calculators & Validators** | `camelCase.js` | `src/entities/*/lib/` | `priceCalculator.js`, `capacityValidator.js`, `cancellationPolicy.js`, `timeSlots.js` |
| **API Services (`.js`)** | `<entity>Service.js` | `src/entities/*/api/` | `activityService.js`, `bookingService.js`, `quoteService.js` |
| **Barrel Exports** | `index.js` | Root of each slice | `src/entities/activity/index.js`, `src/pages/booking/index.js` |

### 6.3 DRY & Custom Reusable Widgets Registry (`src/shared/ui/` & `src/entities/*/ui/`)
**The "Rule of 2":** Any UI pattern used **2+ times** must live in `src/shared/ui/` or `src/entities/*/ui/`. Never duplicate button, input, pill, modal, or pricing markup:
1. `Button.jsx` — Brand Yellow (`#F5E847` + `#121528` text) primary pill (`min-height: 48px–52px`), Nile Teal (`#067BA1`) secondary, translucent outline, and WhatsApp variants.
2. `PriceBadge.jsx` — Simultaneous **Dual Pricing Pill (`BR-002`)** showing both Egyptian (`EGP` pill in `#F5E847`) and Foreigner rate (converted when `USD`/`EUR` active; unified single rate when `price_egp === price_foreign`).
3. `LimitedSeatsBadge.jsx` — Scarcity alert pill (`"Limited: Only 2 bikes available"`) for Water Bike (`BR-003`).
4. `ActivityCard.jsx` — Smooth `22px`-radius card with real photography, hairline marine border, soft oceanic shadow, `LimitedSeatsBadge`, `PriceBadge`, and direct `Book Now` CTA.
5. `QuantityStepper.jsx` — Thumb-friendly `48px` `+`/`-` ticket counter enforcing `min`/`max` (`max = 2` total for Water Bike).
6. `StickyBar.jsx` — Persistent mobile bottom booking bar with safe-area bottom inset.
7. `SectionHeader.jsx`, `Input.jsx`, `Select.jsx`, `Checkbox.jsx`, `DatePicker.jsx`, `Modal.jsx`, `Toast.jsx`, `EmptyState.jsx`, `Skeleton.jsx`, `BookingStatusBadge.jsx`.

---

## 7. Performance Budgets, Analytics Funnel, RBAC & Bilingual Standards

- **Strategic Priority Ranking (Client Direction):**
  1. Conversion Rate Optimization (CRO) · 2. Booking Experience · 3. Performance & SEO · 4. Provider Management · 5. Scalability · 6. Analytics & Data-Driven Decisions.
- **Performance Budgets (`NFR-001` — `< 2.5s` FCP on 4G):**
  - Keep design **Premium, Minimal & Modern** with lightweight, GPU-composited **micro-animations** (`transform`, `opacity` only) — **never** add heavy visual effects at the expense of page load speed or booking simplicity.
  - Wrap `/admin/*`, `/portal/*`, `/b2b`, and secondary routes in `React.lazy()` + `<Suspense fallback={<Skeleton />}>` inside `AppRouter.jsx`.
  - Memoize filtered activity grids, inventory availability lookups, and table searches (`useMemo`, `useCallback`; debounce search `~250ms`).
  - Use `loading="lazy"`, `decoding="async"`, and explicit `aspect-ratio` on below-the-fold images; `fetchpriority="high"` on hero media.
- **Analytics & Conversion Attribution Stack (`GA4` + `GTM` + `Meta Pixel` + `Meta CAPI`):**
  - Emit structured events via `src/shared/lib/analytics.js` measuring real bookings, EGP revenue value, and traffic source:
    1. `Page View` (`page_view`)
    2. `View Activity` (`view_activity`)
    3. `Search` (`search`)
    4. `Initiate Booking` (`initiate_booking`)
    5. `Add Booking Details` (`add_booking_details`)
    6. `Initiate Checkout` (`initiate_checkout`)
    7. `Purchase / Successful Booking` (`purchase`)
    8. `Lead Submission` (`lead_submission`)
- **Split-Screen 2-Role Public Auth, Password-Only Direct Staff Routes & 6-Role RBAC (`NFR-004`):**
  - **Public `/login` Screen:** Split-screen layout exposing **only 2 public account types** (`Customer` / `Partner`). **NEVER** expose a public RBAC role-switcher modal or staff demo cards in customer-facing UI.
  - **Direct Staff Gate:** Internal roles (`Admin`, `Operations`, `TourGuide`, `ContentManager`, `B2B`) authenticate strictly via dedicated direct URLs (`#/portal/admin`, `#/portal/ops`, `#/portal/guide`, `#/portal/content`, `#/portal/b2b`) with a minimal **password-only gate** and zero public navigation chrome.
  - **Classic Sidebar Dashboard:** All role dashboards use a classic fixed/sticky **vertical sidebar layout aligned logically to language direction** (`Right` in Arabic `RTL`, `Left` in English `LTR`).
  - Enforce granular permission checks (`can(permission)`) via `AuthProvider` and `ProtectedRoute` across all 6 client-mandated roles plus Guest Checkout:
    1. **Customer (`Guest` / `Buyer`):** Browse, filter, guest/logged-in booking, online payment, QR ticket & `My Bookings` management.
    2. **Admin:** Full platform governance (all bookings, customers, pricing, activities, providers, destinations, B2B commissions, content, inventory, and **customizing per-user permissions**).
    3. **Service Provider / Partner:** Strictly scoped to **own** services, agreed prices, time slots, equipment capacity, and **own** bookings.
    4. **Operations Team:** Booking execution tracking, `Confirmed -> Completed` transitions, time slot & equipment availability control (no global financial/admin edits).
    5. **Tour Guide / Agent:** Create & track customer/group booking requests and B2B leads within granted permissions.
    6. **Content Manager:** Manage copy, real DUCK photos, descriptions, and promotional offers **strictly without financial or sensitive administrative permissions**.
- **Bilingual (`AR`/`EN` extensible to `DE`/`FR`/`RU`) & Accounting Currency (`EGP` Base):**
  - Launch with full **Arabic (`RTL`)** and **English (`LTR`)** dictionaries structured modularly for future **German, French, and Russian** expansion.
  - **Accounting Currency = `EGP`:** All payments, accounting records, and settlement amounts are in `EGP`; `USD` and `EUR` are strictly **indicative estimates** shown in UI without altering the `EGP` payment currency.
  - **CSS Logical Properties Only:** Forbid `margin-left/right`, `padding-left/right`, `text-align: left/right`, `left/right`, `border-left/right`; exclusively use `margin-inline-start/end`, `padding-inline-start/end`, `text-align: start/end`, `inset-inline-start/end`, `border-inline-start/end`.
  - Render prices, phone numbers (`+201550061006`), and booking refs (`DUCK-2026-8492`) in monospace `Consolas` (`font-weight: 700`) with `dir="ltr"` / `unicode-bidi: isolate`.
- **Security & Payment Resilience (`NFR-007`, `NFR-008`):**
  - Preserve failed-payment booking inputs in `sessionStorage`; **NEVER** store raw credit card numbers, CVVs, or expiry dates in client state or storage.

---

## 8. Domain Invariants & Critical Business Rules Quick-Reference

| Rule ID | Domain Rule | Exact Engineering Requirement | Canonical File(s) |
| :--- | :--- | :--- | :--- |
| **`BR-001`** | **Daylight Hours Only** | Operating slots strictly **Sunrise to Sunset**; future dates only (`>= today`). | `src/entities/booking/lib/timeSlots.js` |
| **`BR-002`** | **Simultaneous Dual Pricing** | Both Egyptian (`EGP`) and Foreigner prices visible on every card without extra clicks. | `src/entities/activity/ui/PriceBadge.jsx`<br>`src/entities/booking/lib/priceCalculator.js` |
| **`BR-003`** | **Equipment Inventory & Water Bike Cap** | Operational capacity: **Kayak = `20`**, **Water Bike = `2`**, **SUP = configurable pre-launch**; Inventory & Availability Engine blocks slot overbooking and lets Admin/Providers update capacity per provider, activity, and slot via UI. | `src/entities/booking/lib/capacityValidator.js`<br>`src/entities/activity/ui/LimitedSeatsBadge.jsx` |
| **`BR-004`** | **Safety & Eligibility** | Max weight **130 kg**; **no swimming required** (life jackets mandatory & provided); adults accompany children. | `src/shared/config/constants.js`<br>`src/widgets/safety-rules/SafetyRulesBox.jsx` |
| **`BR-005`** | **Approved Lineup & Dynamic Catalog** | Core: **Kayak**, **SUP**, **Water Bike**. Hubs: **Aswan** (*Aswan Island*, *Gharb Soheil*), **Matrouh**, **Giza**, **Siwa** — Admin/Providers can add activities, destinations & providers from Dashboard without code edits. | `src/entities/activity/model/activitiesData.js`<br>`src/entities/addon/model/addonsData.js` |
| **`BR-006`** | **Online Payment & `EGP` Accounting** | $\text{Total} = (\text{Count}_{\text{EG}} \times \text{Price}_{\text{EG}}) + (\text{Count}_{\text{Foreign}} \times \text{Price}_{\text{Foreign}}) + \text{Addons}$ settled in **EGP** (`USD`/`EUR` indicative display only). | `src/entities/booking/lib/priceCalculator.js` |
| **`BR-007`** | **24h Free Cancellation & Statuses** | 100% refund if canceled `>= 24h` prior; non-refundable `< 24h` or no-show; visible before payment. Support all 6 statuses: `Pending`, `Confirmed`, `Paid`, `Completed`, `Cancelled`, `Refunded`. | `src/entities/booking/lib/cancellationPolicy.js` |
| **`BR-008`** | **Hybrid B2B Packages & RFQ (`>= 10`)** | Combine **Ready Group Packages** + **Custom RFQ** for Companies, Schools/Universities, Hotels, Tour Guides, Tour Operators & Events with partner-specific prices, commissions & terms. | `src/features/b2b-quote/ui/B2BQuoteForm.jsx` |
| **`BR-009`** | **6-Role RBAC & Custom Permissions** | Restrict `/admin/*` & `/portal/*` by RBAC permissions across `Customer`, `Admin`, `Partner`, `Operations`, `Tour Guide/Agent`, `Content Manager` (with custom permission overrides per user). | `src/app/routes/ProtectedRoute.jsx`<br>`src/app/providers/AuthProvider.jsx` |
| **`BR-010`** | **Guest Checkout + QR & 1-Tap Prompt** | Zero pre-login required; deliver instant confirmation, Booking Ref, **QR Code**, arrival info, WhatsApp/Email actions, and 1-tap password-only account setup to track `/my-bookings`. | `src/features/post-booking-account/ui/PostBookingAccountPrompt.jsx` |
| **`BR-011`** | **Mobile Navbar Simplicity & FA Icons** | On mobile (`<= 900px`), display ONLY the clean single white navbar (`.nr`, height ~52px); hide dark `.top` bar and place utilities (lang, currency, weather) in `.mnav`; reduce bottom `.dock` to compact ~42-45px height; use Font Awesome 6.5.2 icons for all UI elements. | `src/widgets/navbar/Navbar.jsx`<br>`src/widgets/mobile-dock/MobileDock.jsx` |
| **`BR-012`** | **Compact Cards & Enterprise Footer** | Review cards (`.rf`) must keep author metadata and badges in a single compact non-wrapping row (~45px) to prevent excessive vertical stretching; map destination cards (`.mp-mini`) must display thumbnail + badge + 2-line wrapped text without mid-word truncation; footer (`footer.ftr`) must follow 4-column responsive layout with social buttons, links, hubs, direct WhatsApp/phone contacts, and safety badges. | `src/widgets/reviews/ReviewCard.jsx`<br>`src/widgets/footer/Footer.jsx` |

---

## 9. Definition of Done (Self-Check Checklist for Agents)

- [ ] **Architecture & Boundaries:** Imports strictly flow downward (`pages -> layouts -> widgets -> features -> entities -> shared`); business math lives only in `entities/*/lib/`; zero files added to legacy `src/components/`.
- [ ] **Visual Identity & Aesthetic:** Exact brand palette (`#121528`, `#067BA1`, `#F5E847`) preserved with refined Nile & Sea depth (no Neo-Brutalist thick black borders or hard offset shadows).
- [ ] **Mobile-First UX & 45s Booking Flow:** Verified at `360px` mobile width first; tap targets `>= 48px`; sticky bottom bar active; Step 1 (quick dates/slots/steppers), Step 2 (3 fields), and Step 3 (payment + post-booking prompt) seamless.
- [ ] **Granularity & DRY:** UI components `< 150` lines, pages `< 100` lines; repeated patterns extracted to `src/shared/ui/` or `src/entities/*/ui/`.
- [ ] **Bilingual `RTL`/`LTR`, EGP Base & RBAC Security:** CSS Logical Properties used exclusively; `EGP` settlement preserved; all 6 RBAC roles & permissions enforced; zero card numbers stored; `sessionStorage` preserved on payment failure; 8 analytics funnel events wired.
- [ ] **Performance Budget & Live Preservation:** `FCP < 2.5s`, lazy images, subtle GPU micro-animations only, and verified Backup & Recovery plan before any production data/hosting change.
- [ ] **Living `.md` Documentation Sync:** `AGENTS.md`, `README.md`, `duck_entertainment_comprehensive_project_brief_srs_for_vibe_coding.md`, and `docs/` updated immediately if any rule or structure changed.
- [ ] **Build & Lint Verification:** `npm run lint` and `npm run build` pass with **0 errors and 0 warnings**.
