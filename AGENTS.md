# DUCK Entertainment — Agent Constitution (`AGENTS.md`)

> **Authority:** Mandatory and non-negotiable for every AI coding agent, subagent, and automated workflow in this repository.  
> **Product:** DUCK Entertainment (`duckegy.com`) — Nile & sea water-activities booking. Tagline: **IN DUCK WE TRUST**.  
> **Engineering standard:** IEEE 29148 SRS v3.0 (`duck_entertainment_comprehensive_project_brief_srs_for_vibe_coding.md`) mapped onto the existing React 19 + Vite 8 Feature-Sliced tree.  
> **Visual reference prototype:** `../Final_4.html` (Editorial Marine / Sea-Inspired polish). Do not regress to cartoon Neo-Brutalism (`Final_3.html` hard offsets).

---

## 1. Mandatory Pre-Flight Protocol (Agent Operating Rules)

Before planning, creating, editing, or deleting any code, every agent **MUST**:

1. **Read this file in full**, then cross-reference [`duck_entertainment_comprehensive_project_brief_srs_for_vibe_coding.md`](./duck_entertainment_comprehensive_project_brief_srs_for_vibe_coding.md) and [`README.md`](./README.md). Business rules, dual pricing, Guest Checkout, B2B RFQ, Admin, contacts, and IEEE 29148 IDs in the SRS win over memory.
2. **Strict Brand Identity Lock**
   - Never alter Duck’s official logo (`https://www.duckegy.com/logo-transparent.png` / brand wordmark) or invent a new mark.
   - Never change the official palette or “improve” it with extra brand colors:
     - **Deep Navy** `#121528` (`--color-navy` / `--n`) — text, headers, footer, dark surfaces
     - **Nile / Sea Teal** `#067BA1` (`--color-blue` / `--b`) — water theme, links, secondary actions
     - **Sunburst Yellow** `#F5E847` (`--color-yellow` / `--y`) — high-contrast accent only
   - Typography: English display `Berlin Sans FB Demi` with fallbacks `Plus Jakarta Sans` / `Poppins` / `Inter`; Arabic `Cairo` or `IBM Plex Sans Arabic`; booking refs, prices, and phones in `Consolas` / `ui-monospace` with `dir="ltr"` + `unicode-bidi: isolate`.
3. **No invented facts.** Do not invent prices, activities, meeting points, or contacts. Official contacts only: **`+201550061006`**, `https://wa.me/201550061006`, **`duck.asw@gmail.com`**, Aswan (Aswan Island / Makani Café, Gharb Soheil / Al-Shima Beach). Baseline prices live in Section 8 and `src/entities/activity/model/activitiesData.js`.
4. **Reuse before create.** Search `src/shared/ui/`, `src/entities/*/ui/`, `src/features/`, and `src/widgets/` first. `src/components/` is **deprecated** (`buyer/BookingModal.jsx`, `buyer/GuestCheckout.jsx`, `common/*`). Never add files there.
5. **Frontend-only scope.** No backend servers, no payment processor implementation, no storing card numbers (`NFR-008`). Data goes through `src/shared/api/httpClient.js` and `src/entities/*/api/` so mocks swap to a real API via `VITE_` env.
6. **No background music** in video or promo assets (`SRS §2.2`).
7. **Living docs.** If architecture, packages, routes, or business rules change, update `AGENTS.md`, `README.md`, the SRS, and `docs/` in the same task.

---

## 2. Visual Direction: Refined Nile & Sea Aesthetic (Zero Cartoonishness, 100% Duck Identity)

Keep Duck’s exact colors and friendly personality. Execute them as **Editorial Marine / Sea-Inspired** polish — calm, photographic, trustworthy — not cartoon Neo-Brutalism.

**Do (Final_4 language):**
- Soft oceanic depth: `box-shadow: 0 12px 32px rgba(18, 21, 40, 0.08)` (and `0 20px 48px rgba(6, 123, 161, 0.12)` for elevated booking tickets).
- Hairline translucent borders: `1px solid rgba(6, 123, 161, 0.16)`.
- Smooth radii **`20px–24px`** on cards/sheets; pills remain `999px`.
- Frosted glass overlays: `backdrop-filter: blur(12px)` (nav, mobile dock, sticky booking bar, destination chips).
- `#F5E847` as **sunlight accent only**: primary CTAs, Egyptian price pills, active/focus rings, scarcity badges. Never as a full-screen yellow block (reviews, transport, FAQ aside).
- Deep `#121528` navy hero/footer + `#067BA1` sea teal for water, stats, links.
- Real high-resolution photography (`object-fit: cover`) with subtle marine gradient overlays (`linear-gradient` navy → teal, not flat vector SVG scenes).
- Gentle organic wave dividers between major sections.
- Micro-motion `150–250ms cubic-bezier(0.22, 1, 0.36, 1)`. Respect `prefers-reduced-motion`.

**Do not (Final_3 leftovers):**
- Thick `2px` black borders, hard offset shadows (`6px 6px 0 #121528`), dashed navy outlines as a system, or clip-art SVG Nile scenes as the default media.
- Yellow full-bleed review bands or yellow FAQ “sticky notes.”
- New palettes, gradients that dilute brand hexes, or playful stickers that fight the logo.

Tokens belong in `src/shared/styles/tokens.css` (currently navy/blue/yellow only — extend with `--shadow-sea`, `--border-hairline`, `--radius-card`, `--glass` without changing the three brand hexes). Purge leftover Vite purple (`#aa3bff`) and `#root { width: 1126px }` if they reappear in `src/index.css`.

---

## 3. Mobile-First UX, Responsiveness & Ultra-Easy Appointment Booking (Top Priority)

Most traffic is Instagram / TikTok **in-app mobile browsers**. Design **`360px+` first**, then `640 / 768 / 1024 / 1280`.

### 3.1 Mobile engineering
- Zero horizontal overflow (`overflow-x: hidden` on `html/body`; no element wider than the viewport in AR or EN).
- Thumb targets **`min-height: 48px–56px`** (never below `44px`). Form `font-size >= 16px` to stop iOS zoom.
- Sticky bottom booking bars with `padding-bottom: env(safe-area-inset-bottom)`.
- Native-feeling swipe carousels (`scroll-snap-type: x mandatory`, hidden scrollbars, optional arrow controls).
- Mobile nav = sheet/drawer; admin tables = stacked cards or sticky first column.
- Persistent mobile dock may use yellow only on the center **احجز** CTA.

### 3.2 Ultra-frictionless 3-step Guest-First booking (< 45 seconds on a phone)

**Never require an account before pay (`BR-010`).** Wire UI to `src/features/guest-checkout/` (`BookingFlowProvider`, `useBookingFlow`, `StepDateSlotCount`, `StepGuestInfo`, `StepOnlinePayment`, `DualPriceSummary`, `AddonsSelector`). Persist wizard state with `src/shared/hooks/useSessionStorage.js` (`NFR-007`).

1. **Step 1 — Date, time & tickets**
   - One-tap chips: **Today / Tomorrow / Day After** + `<input type="date">`.
   - Sunrise-to-Sunset slot pills only (`BR-001`): **Sunrise, Morning, Afternoon, Sunset** (`src/entities/booking/lib/timeSlots.js`).
   - Instant `+ / -` steppers for **Egyptian** vs **Foreigner** participants (`QuantityStepper`), live total via `priceCalculator.js`:
     `Total = (EG × price_egp) + (Foreign × price_foreign) + addons`.
   - Water Bike: hard-cap `egyptian_count + foreigner_count <= 2` (`capacityValidator.js`, `LimitedSeatsBadge`).
2. **Step 2 — Minimal guest info (3 required fields only)**
   - Full Name, WhatsApp phone (`inputmode="tel"` + auto-format), Email (`inputmode="email"`).
   - Mandatory 24h cancellation checkbox (`BR-007`). Optional add-ons collapsed.
3. **Step 3 — Online payment & post-booking account prompt**
   - Gateway handoff states: **Success / Failed / Pending** (`PaymentSuccess`, `PaymentFailed`, `PaymentPending`, `PaymentRetryNotice`).
   - Failed payment restores Step 1–2 from `sessionStorage` — never re-type (`NFR-007`).
   - **Never** persist PAN/CVV/expiry (`NFR-008`).
   - After success: booking ref (e.g. `DUCK-2026-8492`) + 1-tap **Post-Booking Account Prompt** (`PostBookingAccountPrompt.jsx`) — password only; name/email/phone pre-filled (`FR-005` / `BR-010`).

Visual prototype of this flow: `../Final_4.html` booking sheet (`#book`). Production implementation must live in the FSD slices above, not in a new HTML island inside React.

---

## 4. Tech Stack & Installed Packages Map

Inspected from `package.json` (this repo is intentionally lean). **Do not `npm install` UI kits, icon packs, date libraries, Tailwind, MUI, Redux, or routers without an explicit user request.**

| Layer | Installed / native | Version | Usage rule |
| :--- | :--- | :--- | :--- |
| UI | `react`, `react-dom` | `^19.3.1` | Function components + hooks only. `React.lazy` / `Suspense` for `/admin` and secondary routes. Class components forbidden except `ErrorBoundary.jsx`. |
| Bundler | `vite`, `@vitejs/plugin-react` | `^8.3.6` / `^6.1.2` | ESM. Env vars `VITE_*` only via `src/shared/config/env.js`. Add `@` → `/src` in `vite.config.js` if missing. |
| Language | JavaScript `.js` / `.jsx` + `@types/react` | `^19.3.0` | JSDoc `@typedef` for SRS §8 contracts. No TypeScript migration unless asked. |
| Routing | **Not in `package.json`.** Skeleton: `src/app/routes/AppRouter.jsx`, `ProtectedRoute.jsx`, `src/shared/config/routes.js` | Custom | Centralize paths in `routes.js`. Do not scatter URL strings in widgets. If `react-router-dom` is added, it is the single router — no duplicate history hacks. |
| State | React Context + feature hooks | Built-in | Global: `AuthProvider`, `LanguageProvider`, `CurrencyProvider` only. Booking wizard: `BookingFlowProvider`. **No Redux / MobX / Zustand** unless requested. |
| Styling | Vanilla CSS + custom properties | Built-in | `src/shared/styles/tokens.css`, `reset.css`, co-located `PascalCase.css`. **No Tailwind, Bootstrap, MUI, CSS-in-JS.** Consume `--color-navy/blue/yellow` and logical properties. |
| Forms | Pure validators | Built-in | `src/shared/utils/validators.js` + `entities/booking/lib/*`. Bilingual field errors. |
| i18n | `src/shared/i18n/{ar,en}.json` + `LanguageProvider` | Built-in | Zero hardcoded user-facing copy in JSX. Flip `document.documentElement.lang` + `dir`. |
| HTTP | `fetch` wrapper `httpClient.js` | Built-in | Entity `*Service.js` only. `VITE_USE_MOCKS` switches mocks. |
| Icons | Inline SVG / `public/icons.svg` | Built-in | `currentColor`. Flip directional icons under `[dir="rtl"]`. |
| Lint | `eslint` `^10.14.0`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` | Installed | `npm run lint` + `npm run build` = 0 errors, 0 warnings. |
| Test | `vitest.config.js` + `tests/{unit,component,e2e}` | Configured, scripts TBD | Unit-test `priceCalculator`, `capacityValidator`, `cancellationPolicy` without DOM. |
| Dates | Native `Intl` + ISO `YYYY-MM-DD` | Built-in | Do not add `dayjs`/`moment` unless asked. |

**Scripts today:** `dev`, `build`, `lint`, `preview`. There is **no** `npm test` script yet.

**Scaffold honesty:** Many slice files exist as empty or stub `export default function App() { return null }` placeholders. **Fill those files**; do not create a parallel tree.

---

## 5. Clean Architecture & Feature-First Directory Structure

The repo already uses **Feature-Sliced Design (FSD)** mapped to Clean Architecture rings. Dependencies point **inward / downward**. UI never contains raw business math or hardcoded mock arrays.

### 5.1 Rings

| Ring | Responsibility | Canonical folders |
| :--- | :--- | :--- |
| **Presentation** | Pages, layouts, widgets, feature UI, entity cards | `src/pages/`, `src/layouts/`, `src/widgets/`, `src/features/*/ui/`, `src/entities/*/ui/` |
| **Data** | HTTP, mocks, DTO mapping, session persistence | `src/entities/*/api/`, `src/shared/api/`, `src/shared/hooks/useSessionStorage.js` |
| **Domain** | Entities, value objects, pure validators | `src/entities/*/model/`, `src/entities/*/lib/` (**zero React**) |
| **Shared / Core** | Tokens, i18n, routes, guards, primitives | `src/app/`, `src/shared/{ui,styles,config,i18n,hooks,lib,utils}` |

### 5.2 Tree (as on disk)

```text
src/
├── app/                         # bootstrap, providers, route guards
│   ├── providers/               # AppProviders, Auth, Language, Currency, ErrorBoundary
│   ├── routes/                  # AppRouter, ProtectedRoute
│   └── App.jsx
├── pages/                       # thin route composers (home, activity-details, booking, b2b, auth, account, admin, static, not-found)
├── layouts/                     # MainLayout, BookingLayout, AdminLayout
├── widgets/                     # page sections (navbar, hero, activities-grid, destinations, reviews, faq, footer, admin-sidebar, …)
├── features/
│   └── <slice>/                 # guest-checkout, post-booking-account, payment-result, b2b-quote, activity-filter, …
│       ├── model/               # BookingFlowProvider, useBookingFlow, useAuth
│       ├── ui/
│       └── index.js
├── entities/                    # activity, addon, booking, destination, quote, review, user
│   └── <entity>/
│       ├── lib/                 # priceCalculator, capacityValidator, cancellationPolicy, timeSlots
│       ├── model/
│       ├── api/
│       ├── ui/
│       └── index.js
├── shared/
│   ├── api/                     # httpClient + mocks/
│   ├── config/                  # constants.js, env.js, routes.js
│   ├── hooks/
│   ├── i18n/
│   ├── lib/
│   ├── styles/                  # tokens.css, reset.css
│   ├── ui/                      # Button, Input, Modal, QuantityStepper, StickyBar, …
│   └── utils/validators.js
├── components/                  # DEPRECATED — do not extend
├── index.css
└── main.jsx
```

Import law: `app → pages → layouts → widgets → features → entities → shared`.  
Forbidden: `shared` importing `entities`; `entities` importing `features`; cross-slice deep imports (use each slice’s `index.js`).

**Domain math examples (never inline in JSX):**
- Water Bike max capacity `= 2`
- Dual-price calculator
- 24h cancellation (`cancellationPolicy.js`)

---

## 6. Component Granularity, Naming & Custom Widget Rules

### 6.1 Size
- UI `.jsx`: **max ~120–150 lines** (excluding imports/JSDoc). Pages: **~80–100 lines**, compose only.
- Domain `.js`: **max ~120 lines**, cyclomatic complexity `< 8`.
- Split if >2 nested JSX conditionals, mixed sub-sections, or over the line cap — extract child widgets or `model/use*.js`.

### 6.2 Naming (match this repo)

| Artifact | Pattern | Examples |
| :--- | :--- | :--- |
| Folders | `kebab-case` | `guest-checkout/`, `activity-details/`, `b2b-quote/` |
| Shared UI folders | `PascalCase/` | `QuantityStepper/`, `StickyBar/` |
| Components | `PascalCase.jsx` | `DualPriceSummary.jsx`, `PostBookingAccountPrompt.jsx` |
| Styles | co-located `PascalCase.css` | `Button.css` |
| Hooks | `useCamelCase.js` | `useBookingFlow.js`, `useSessionStorage.js` |
| Providers | `PascalCaseProvider.jsx` | `BookingFlowProvider.jsx` |
| Domain | `camelCase.js` | `priceCalculator.js` |
| API | `<entity>Service.js` | `bookingService.js` |
| Barrels | `index.js` | public API only |

Preferred **role-revealing** names when extracting: `dual_price_badge` → `PriceBadge.jsx`, `guest_checkout_sheet` → guest-checkout UI, `mobile_sticky_booking_bar` → `StickyBar.jsx`, `water_bike_capacity_alert` → `LimitedSeatsBadge.jsx`, `ticket_counter_stepper` → `QuantityStepper.jsx`.

### 6.3 DRY — Rule of 2

Any pattern used **twice** goes in `src/shared/ui/` (agnostic) or `src/entities/*/ui/` (domain). Registry already started:

`Button`, `Input`, `Select`, `Checkbox`, `DatePicker`, `QuantityStepper`, `Modal`, `Card`, `Badge`, `Accordion`, `Gallery`, `SectionHeader`, `StickyBar`, `Table`, `Skeleton`, `EmptyState`, `Toast`, `PriceBadge`, `ActivityCard`, `LimitedSeatsBadge`, `BookingStatusBadge`, `AddonOption`, `DestinationCard`, `ReviewCard`.

Do not duplicate raw `<button>` / price pills / steppers in features.

---

## 7. Performance, Scalability & Bilingual RTL/LTR Standards

### Performance (`NFR-001`)
- Lazy-load `/admin` and secondary modals (`React.lazy` + `Suspense` + `Skeleton`).
- `useMemo` filtered lists; `useCallback` stable card handlers.
- Debounce admin search (~250ms); destination pills stay instant.
- Images: WebP when possible, `loading="lazy"` below the fold, `fetchpriority="high"` on hero, explicit `aspect-ratio` (`CLS = 0`). Target **FCP < 2.5s on 4G**.

### Bilingual & direction (`FR-009`)
- `LanguageProvider` sets `<html lang dir>`. Arabic RTL / English LTR with no layout shift.
- **Forbidden physical CSS:** `margin-left/right`, `padding-left/right`, `left`/`right`, `text-align: left/right`, `border-left/right`.
- **Required logical CSS:** `margin-inline`, `padding-inline`, `inset-inline-start/end`, `border-inline-*`, `text-align: start/end`.
- EN headings: Berlin Sans / Plus Jakarta / Inter. AR: Cairo. Prices and `+201550061006` stay LTR isolated.

### Security (`NFR-004`, `NFR-008`)
- `/admin/*` wrapped in `ProtectedRoute` with `Role === 'Admin'` (`BR-009`). Guests/Buyers → `/login`.
- Zero client storage of payment card details.

---

## 8. Domain Invariants & Critical Business Rules Quick-Reference

| ID | Rule | Enforcement |
| :--- | :--- | :--- |
| **BR-001** | Daily operations **Sunrise → Sunset** only | `timeSlots.js`, Step 1 pills |
| **BR-002** | Dual pricing **EGP Egyptian + Foreigner** visible on every trip card with no extra click | `PriceBadge.jsx`, `DualPriceSummary.jsx`, `priceCalculator.js`. Unified badge if `price_egp === price_foreign` (e.g. Matrouh `400 EGP`) |
| **BR-003** | Water Bike **max 2 units / slot** | `capacityValidator.js`, `LimitedSeatsBadge.jsx` |
| **BR-004** | **130 kg** max; swimming **not** required (life jackets provided); children with an adult | `constants.js`, `SafetyRulesBox.jsx` |
| **BR-005** | Products: Kayak, SUP, Water Bike. Hubs: Aswan (primary), Matrouh, Giza, Siwa (seasonal). Baseline: Aswan Private Kayak `850` / `275`; Open Kayak `500` / `180`; SUP `650` / `350`; Matrouh `400` unified. Add-ons: transport, photography | `activitiesData.js`, `addonsData.js`, `destinationsData.js` |
| **BR-006** | B2C confirmed only after **online payment** | `StepOnlinePayment.jsx` |
| **BR-007** | Free cancellation **≥ 24h**; else non-refundable | `cancellationPolicy.js`, Step 2 checkbox |
| **BR-008** | B2B RFQ for groups **≥ 10** (universities, companies) | `B2BQuoteForm.jsx`, `MIN_B2B_GROUP_SIZE` |
| **BR-009** | Admin dashboard **Admin-only** | `ProtectedRoute.jsx`, `features/admin-management/` |
| **BR-010** | Guest checkout + post-booking password-only account prompt | `guest-checkout/*`, `PostBookingAccountPrompt.jsx` |
| **NFR-007** | Failed payment keeps form state in `sessionStorage` | `useSessionStorage.js` |
| **NFR-008** | No card data in storage or client state | payment UI |

Contacts again: `+201550061006`, `duck.asw@gmail.com`. Roles: `Guest` \| `Buyer` \| `Admin`.

---

## 9. Definition of Done (Self-Check Checklist for Agents)

After every task, verify:

- [ ] **Pre-flight:** `AGENTS.md` + SRS consulted; no invented prices/contacts/logo/colors.
- [ ] **Architecture:** Imports downward only; math in `entities/*/lib/`; nothing new in `src/components/`.
- [ ] **Granularity & names:** UI files ≤ ~150 lines, pages ≤ ~100, names match Section 6.
- [ ] **DRY:** Repeated UI extracted to `shared/ui` or `entities/*/ui`.
- [ ] **Visual:** Editorial Marine (soft shadow, hairline teal border, 20–24px radius, glass, yellow as accent). Matches Duck identity (`#121528` / `#067BA1` / `#F5E847`) and `Final_4.html` — not cartoon brutalism.
- [ ] **Mobile 360px+:** No horizontal scroll, 48–56px targets, safe-area sticky booking bar, swipe carousels.
- [ ] **Booking:** 3-step guest flow < 45s; dual EG/Foreign steppers; 3 required fields; payment Success/Fail/Pending with session restore; optional password-only account prompt.
- [ ] **RTL/LTR:** Logical CSS; AR/EN mirror without shift.
- [ ] **Domain:** Dual prices on cards, Water Bike cap 2, 130 kg, 24h cancel, B2B ≥ 10, `/admin` guarded.
- [ ] **Docs:** `.md` files updated if architecture or rules changed.
- [ ] **Quality:** `npm run lint` and `npm run build` with **zero** warnings/errors.

If any box fails, the task is not done.
