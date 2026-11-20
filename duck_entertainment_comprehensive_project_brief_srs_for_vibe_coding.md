# DUCK Entertainment — Comprehensive Project Brief & Engineering Specification (SRS v3.1)

> **Purpose of this Document:** This file is the single source of truth for building the **DUCK Entertainment Multi-Provider Water Activities Platform (`duckegy.com`)**. It consolidates IEEE 29148 Software Requirements Specification (SRS v3.1), **Client Strategic Direction (`DUCK____Answers___Strategic_Direction.pdf`)**, UX User Flows, 6-Role RBAC Permissions, Equipment Inventory Rules, Hybrid B2B Packages, Analytics Funnel Events, Brand Identity, and Technical Constraints.

---

## 1. Project Overview, Strategic Priorities & Production Safeguard

- **Project Name:** DUCK Entertainment (`duckegy.com`) — Integrated Egypt Water Activities & Marine Experiences Platform (B2C + B2B + Multi-Provider)
- **Brand Tagline / Promise:** `IN DUCK WE TRUST`
- **Track / Initiative:** Tech & Web Track — CreativeZ / Dandara Al Ebdaa (12 Nov – 3 Dec 2026)
- **Strategic Direction (Not Just a Redesign):** Build an integrated Egyptian platform for water activities supporting **B2C**, **B2B**, and **code-free addition of new Service Providers, Destinations, and Activities** from the Control Panel.
- **Approved Priority Order:**
  1. **Conversion Rate Optimization (CRO)**
  2. **Booking Experience**
  3. **Performance & SEO**
  4. **Provider Management**
  5. **Scalability**
  6. **Analytics & Data-Driven Decisions**
- **Technical Scope:** **Frontend Web Application** (B2C Buyer, B2B Groups, and 6-Role RBAC Portals `/admin`, `/portal`, `/my-bookings`, ready for backend integration).
  - **Out of Scope:** Building backend servers from scratch, storing raw card numbers, or altering the **live `duckegy.com` site, database, OS, or hosting before auditing current infrastructure and creating + testing a full Backup & Recovery plan**.
- **Core Objective:** Preserve ~3,000 existing customers' operational continuity while fixing UX/copy flaws, enforcing transparent dual pricing (`EGP` accounting base), enabling frictionless **Guest Checkout** + QR digital tickets, enforcing **Inventory & Availability (`Kayak: 20`, `Water Bike: 2`)**, capturing **Hybrid B2B packages + RFQ**, and running complete conversion analytics (`GA4`, `GTM`, `Meta Pixel`, `Meta CAPI`).

---

## 2. Brand Identity, Visual System & Tone of Voice

### 2.1 Visual Identity (STRICT — Do Not Alter)
- **Logo:** Official DUCK logo (`logo-transparent.png`) without redesign or replacement.
- **Approved Color Palette:**
  - **Primary Accent / Brand Yellow:** `#F5E847` *(Client PDF brief swatch ref: `#FDFB45`)*
  - **Secondary / Nile Teal-Blue:** `#067BA1` *(Client PDF brief swatch ref: `#147D9F`)*
  - **Dark Navy / Charcoal Base:** `#121528` *(Client PDF brief swatch ref: `#0C1226`)*
  - **Real Media Rule:** **Use real photography from DUCK's actual operations only** (no generic stock or invented visuals).
  - **Design Direction:** **Premium, Minimal & Modern** (Editorial Marine aesthetic: fast, clear pricing, subtle purposeful micro-animations — **zero heavy visual effects that hurt speed or booking simplicity**). Reference: `../FinalDesign/Final_4.html`.
- **Backgrounds:** Crisp white (`#FFFFFF`) and soft sea-mist surfaces (`#F3FAFC` / `#F7FBFD`) with minimum `4.5:1` WCAG contrast.
- **Typography:**
  - **English Primary / Display:** `Berlin Sans FB Demi Bold` (or clean rounded geometric display fallback if font file isn't loaded locally) + clean sans-serif body (`Inter` / `Plus Jakarta Sans`).
  - **Monospace / Codes / Refs:** `Consolas Bold` (for booking references, prices, badges).
  - **Arabic Typography:** Modern clean Arabic sans-serif (`Cairo` or `IBM Plex Sans Arabic`) with full **RTL** layout support.
- **Visual Vibe & Motion:**
  - Calm, organized, trustworthy, and relaxing **Editorial Marine / Sea-Inspired** Nile aesthetic—**not** noisy, chaotic, cluttered, or cartoonish Neo-Brutalism (no thick black borders or hard `6px 6px 0` offset shadows).
  - Execute Duck identity with soft oceanic depth (`0 12px 32px rgba(18, 21, 40, 0.08)`), hairline teal borders, `20px–24px` radii, frosted glass, real photography with marine overlays, and `#F5E847` used only as a sunlight accent (CTAs, Egyptian price pills, active states)—never as full-screen yellow blocks.
  - Visual reference prototype: `Final_4.html` (repository parent). Use subtle, high-performance **micro-animations** while maintaining `FCP < 2.5s`.

### 2.2 Brand Story & Tone of Voice
- **Story:** Started in 2023 in Aswan with a simple idea on the Nile ("a little duck with a big dream"), expanding from Kayaking into Stand-Up Paddleboarding (SUP) and Water Bikes.
- **Tone of Voice:** Friendly, adventurous, welcoming, transparent, and safety-conscious.
- **Content Rule:** **NO background music** in any embedded promotional videos or audio assets.

---

## 3. Diagnostic: Problems in Current Site (`duckegy.com`) to Fix

1. **Typos & Broken Formatting:** Current site has broken text (e.g., `"Form 2 to housr"`, unclosed parentheses in pricing). **Fix:** 100% clean, proofread copy in both English and Arabic.
2. **Cluttered Destinations & Activities:** Mixing Aswan, Matrouh, Giza, and Siwa in one long unorganized list confuses visitors arriving from targeted social ads. **Fix:** Instant destination & activity filtering with Aswan highlighted as the primary hub.
3. **Confusing Dual Pricing:** Egyptian prices are currently hidden in tiny text next to foreigner prices, making group cost calculation hard. **Fix:** Display **both** Egyptian and Foreigner prices clearly on every card + a real-time split-ticket calculator in the booking flow.
4. **No Dedicated B2B Group Path:** Universities, scouts, and travel agencies are buried in a tiny FAQ line. **Fix:** Dedicated B2B section & Request for Quotation (RFQ) page/flow.
5. **Missing Activity Context:** Failure to highlight that **Water Bike** has strictly **2 units** available, and lack of beginner-friendly educational content for **SUP**.

---

## 4. Target Audience & User Personas

### 4.1 B2C (Individual & Tourist Buyers)
- **Foreign Tourists:** Seeking safe, organized, transparent Nile adventures in Aswan with English UI, clear USD/EUR conversions, Google Maps meeting points, and Google Reviews.
- **Egyptian Youth & Domestic Travelers (Persona: Ahmed, 26, Cairo):** Looking for unique outdoor experiences with friends, transparent fixed EGP pricing (no haggling), real photos/UGC, and fast mobile booking from Instagram.

### 4.2 B2B (Corporate, Universities & Groups)
- **Group Organizers (Persona: Mahmoud, 32, HR Manager / Student Union / Scouts / Tour Operators):** Needs proof of operational capacity, strict safety protocols (life jackets, supervision), clear group schedules, and a fast **Request for Quote (RFQ)** form.

---

## 5. Core Activities, Destinations & Approved Pricing

### 5.1 Core Water Activities (`BR-005`)
1. **Kayak (Hero Product):** Most popular activity. Available as Private Kayak or Open/Shared Kayak. Easy for beginners.
2. **SUP (Stand-Up Paddleboard):** Growing activity; requires a brief beginner-friendly explainer ("What is SUP? Who is it for? How to start?") to educate new users.
3. **Water Bike:** Premium/unique activity with **strictly 2 units available per time slot (`BR-003`)**. Must show a prominent `"Limited: Only 2 bikes available"` badge and enforce `max_capacity = 2` in the booking calculator.

### 5.2 Operating Destinations & Seasonality
- **Primary Hub (Year-Round / Current Focus):** **Aswan** — *Aswan Island (جزيرة أسوان)* (Meeting point e.g., Makani Café) and *Gharb Soheil / Gharb Al-Seil (غرب سهيل)* (Al-Shima Beach).
- **Seasonal Destinations:**
  - **Marsa Matrouh** (Ageeba & Um Al-Rakham — Summer)
  - **Giza / Cairo** (Marine Scouts Club / Nile — Seasonal)
  - **Siwa Oasis** (Seasonal)

### 5.3 Approved Reference Pricing (`BR-002`)
> *Note: Architecture must support dynamic pricing updates via Admin Dashboard/data config, with these approved baseline rates:*
- **Aswan — Private Kayak:** `850 EGP` (Foreigners) | `275 EGP` (Egyptians)
- **Aswan — Open / Free Kayak:** `500 EGP` (Foreigners) | `180 EGP` (Egyptians)
- **Aswan — SUP:** `650 EGP` (Foreigners) | `350 EGP` (Egyptians)
- **Matrouh Trips (Unified Rate Example):** `400 EGP` (Unified price display supported when `price_egp === price_foreign`)
- **Optional Add-ons:**
  - Door-to-door Transportation (Pickup & Drop-off)
  - Professional Photography Package

---

## 6. Strict Business Rules (`BR-001` to `BR-010`)

- **`BR-001` Operating Hours:** All water activities operate daily during daylight hours **from Sunrise to Sunset only**. Time slot selectors must only display valid Sunrise-to-Sunset slots.
- **`BR-002` Dual Pricing Display:** Fixed dual pricing (Egyptian citizen rate vs. Foreigner rate) applies. **Both prices must be visible simultaneously** on every activity card without requiring extra clicks.
- **`BR-003` Equipment Capacity & Slot Availability Engine (`Inventory`):**
  - Known fleet capacities: **Kayak = `20` units**, **Water Bike = `2` units (`وحدتان`)**, **SUP = configurable pre-launch fleet count**.
  - An **Inventory & Availability Engine** must track slot reservations, block overbooking/conflicts (`Water Bike` capped strictly at `2`), and allow setting/updating capacity **per Service Provider, per Activity, and per Time Slot** via the Control Panel.
- **`BR-004` Safety & Eligibility Rules:**
  - Maximum participant weight: **130 kg**.
  - **Swimming skills are NOT required** (certified life jackets are mandatory and provided for all participants).
  - Children must be accompanied by an adult.
- **`BR-005` Product Lineup & Code-Free Expansion:** Core activities are **Kayak**, **SUP**, and **Water Bike** across approved destinations (plus optional Add-ons: Transportation, Photography). Admin/Providers must be able to add new activities, destinations, and providers from the Control Panel without editing source code.
- **`BR-006` Mandatory Online Payment & `EGP` Accounting Base:** Individual B2C bookings are confirmed upon completing Online Payment. **All payments, accounting, and ledger records are settled in `EGP`**. `USD` / `EUR` may be displayed strictly as **indicative estimates** without changing the settlement currency.
- **`BR-007` Cancellation Policy & 6-State Booking Lifecycle:** Free 100% refund if canceled `>= 24 hours` before start time (non-refundable `< 24h` or no-show), displayed clearly before payment. System must support all 6 statuses: `Pending`, `Confirmed`, `Paid`, `Completed`, `Cancelled`, `Refunded`.
- **`BR-008` Hybrid B2B Group Packages & Custom RFQ (`>= 10`):** Combine **(1) Ready-Priced Tiered Packages** for standard recurring groups with **(2) Custom Request a Quote (RFQ)** across all 6 B2B partner segments: **Companies, Schools & Universities, Hotels, Tour Guides, Tour Operators, and Events & Occasions** — supporting partner-specific pricing, commissions, and contract terms.
- **`BR-009` 6-Role RBAC & Custom Per-User Permissions:** Access Control enforces permissions across **Customer (`Guest` / `Buyer`)**, **Admin**, **Service Provider / Partner**, **Operations Team**, **Tour Guide / Agent**, and **Content Manager**, with per-user permission customization.
- **`BR-010` Guest Checkout, QR Confirmation & 1-Tap Account Prompt:** Zero pre-login required. Post-payment screen delivers instant confirmation, Booking Ref (`DUCK-2026-XXXX`), activity/slot/location/count/arrival details, **Digital QR Code**, WhatsApp & Email confirmations, `/my-bookings` management page, and 1-tap password-only account creation.
- **`BR-013` Dedicated Wavy Groups Banner & Creative In-Flow Groups Studio (`#/groups`):** The landing page features a prominent organic curved Nile wave banner showcasing real operational group photography (`HSXR5504.JPG` with clear visible participants). Clicking the CTA or navbar link opens an in-flow dedicated page view (`#groupsPage` / `#/groups`) while keeping the **exact main fixed navbar (`header.nv`) pinned at the top everywhere**. The dedicated page opens with a 3-photo Bento photography collage, avoids technical `B2B` jargon in customer copy, and replaces traditional forms with an interactive 3-step Group Trip Builder (clickable tribe/vibe tiles, group size slider & presets, visual activity cards, destination/time/add-on pills, 3 quick contact inputs) paired with a sticky Live Group Adventure Pass (`DUCK GROUP PASS`) and instant WhatsApp dispatch.

- **`BR-014` Cinematic Full-Bleed In-App About Us Page (`#/about`):** All `About Us / من نحن` links in the desktop navbar, mobile drawer, and footer route to an internal standalone page (`#aboutPage` / `#/about`) beneath the persistent fixed navbar (`header.nv`) rather than redirecting externally. Upgraded from traditional card layouts to an ultra-modern, cinematic full-bleed background experience utilizing authentic Nile expedition photography (`HSXR5504.JPG` / `GUQJ8589.JPG`) with theatrical vignettes, frosted glassmorphism HUD metric badges (`+4,000` adventurers, `5` destinations, `100%` certified safety, `24h` free cancellation), glowing Vision & Mission monoliths, 4 interactive excellence pillars, real operational film strip, UN SDGs `8, 9, 11, 17`, zero horizontal overflow, and seamless Arabic/English bilingual support.

---

## 7. Functional Requirements & User Flows

### 7.1 B2C Individual Booking Flow (3-Step Guest-First UX)
1. **Landing Page (`/`):**
   - **Navbar:** Logo, Destinations/Activities links, B2B Groups link, Language Switcher (`EN` / `AR` with full `LTR`/`RTL` flip), Currency Switcher (`EGP` / `USD` / `EUR` for international prices), `My Bookings` / Login button, and `Book Now` primary CTA.
   - **Hero Section:** High-impact Nile visual, tagline (`IN DUCK WE TRUST`), value proposition, and **Quick Filter Bar** (Destination + Activity + Date).
   - **Problem / Solution & Why DUCK:** Fixed transparent pricing, certified safety gear, organized schedules vs. unorganized street vendors.
   - **Activities & Destinations Showcase:** Filterable grid of **Dual Pricing Cards** showing: Activity image, Activity badge, Destination tag, Duration, **Foreigner Price** (converted if USD/EUR selected) + **Egyptian Price Badge**, and a `"2 Left"` scarcity badge for Water Bikes.
   - **SUP Beginner Spotlight:** Quick visual guide explaining Stand-Up Paddleboarding for first-timers.
   - **Interactive Meeting Points Map:** Google Maps embeds/links for Aswan Island (Makani Café), Gharb Soheil (Al-Shima Beach), Giza Marine Scouts Club, etc.
   - **B2B Banner / Teaser:** CTA directing universities/companies to the Group Bookings page.
   - **Social Proof (`What Our Guests Say`):** Verified customer reviews + live/fallback **Google Reviews** widget.
   - **FAQ Accordion:** Structured answers covering safety, non-swimmers, 130 kg max weight, dress code, 24h cancellation policy, and optional transportation.
   - **Transportation & WhatsApp Concierge Section:** Direct WhatsApp CTA (`+201550061006`) for pickup requests or instant questions.
   - **Footer:** Official contacts, policy links (*About Us, Our Team, Safety Information, Booking Policy, FAQ, Contact Us*), and social links (*Instagram, Facebook, TikTok*).
2. **Activity Details Page (`/activities/:slug`):**
   - Photo gallery, inclusions, Sunrise-to-Sunset schedule, safety rules (`130 kg` max, life jackets, no swimming needed), Google Maps meeting point, and a **Mobile Sticky Bottom Bar** (`Book Now` + starting prices).
3. **3-Step Booking & Guest Checkout (`/book/:slug`):**
   - **Step 1 — Configure Trip:** Select Future Date, Daylight Time Slot (Sunrise to Sunset), **Egyptian Tickets Count**, **Foreigner Tickets Count**, and Optional Add-ons (Transportation / Photography). Real-time summary calculates:
     $$\text{Total} = (\text{Count}_{\text{EG}} \times \text{Price}_{\text{EG}}) + (\text{Count}_{\text{Foreign}} \times \text{Price}_{\text{Foreign}}) + \text{Addons}$$
     *(Enforce `Count_Total <= 2` if activity is Water Bike).*
   - **Step 2 — Guest Details:** Full Name, Phone / WhatsApp Number, Email Address (no password required), and mandatory checkbox agreeing to the **24-Hour Free Cancellation Policy**. *(If user already has an account, allow quick sign-in to autofill).*
   - **Step 3 — Online Payment Gateway Simulation / Integration:**
     - Clean handoff/modal supporting `Success`, `Pending`, and `Failed` states.
     - **Edge Case (`NFR-007`):** If payment fails, preserve all entered form data in session state and show a friendly retry prompt without losing inputs.
   - **Confirmation Screen + Post-Booking Account Prompt (`BR-010`):**
     - Displays **Booking Reference ID** (e.g., `DUCK-2026-8492`), **Digital QR Code Ticket**, trip summary, Google Maps link, and a 1-click **"Send Ticket to WhatsApp"** button.
     - **Post-Booking Account Creation Card:** *"Want to track your booking updates & manage your ticket anytime? Create your account in 5 seconds!"* — Pre-fills Name, Email, and Phone; user just enters a **Password** and clicks **Create Account**, unlocking `/my-bookings`.

### 7.2 Hybrid B2B Packages & Custom Groups Flow (`/groups` or `/b2b`)
- **Dual B2B Offering:**
  1. **Ready Tiered Packages:** Fixed transparent per-group/per-person rates for recurring group bands (e.g., `10–24`, `25–49`, `50+` participants).
  2. **Custom RFQ Form:** Tailored proposals for large groups & private events supporting **Companies, Schools & Universities, Hotels, Tour Guides, Tour Operators, Events & Occasions**, with custom pricing, partner commissions (`%`), and contract terms.
- **Required Fields & Confirmation:** Organization Name, Contact Person, WhatsApp Phone, Partner Type, Activity (`Kayak`/`SUP`/`Water Bike`/`Mixed`), Destination, Group Size (`>= 10`), Date & Notes ➔ generates `Quote Reference ID` + WhatsApp handoff (`Lead Submission` event).

### 7.3 Role-Based Portals & Classic Sidebar Control Panels (`/login`, `#/portal/:role`, `/my-bookings`)
- **Split-Screen 2-Role Public Auth (`NFR-004`):** The public login/sign-up screen uses a split-screen layout restricted strictly to **2 public account types** (`Customer` and `Partner`). **No public RBAC role-switcher or staff cards** may be exposed on public pages.
- **Password-Only Direct Staff Routes:** Internal/staff roles (`Admin`, `Operations`, `TourGuide`, `ContentManager`, `B2B`) authenticate exclusively via dedicated direct URLs (`#/portal/admin`, `#/portal/ops`, `#/portal/guide`, `#/portal/content`, `#/portal/b2b`) presenting an isolated password-only gate without public navigation chrome.
- **Classic Sidebar Dashboard (`RTL`/`LTR` Adaptive):** All authenticated portals render in a classic vertical-sidebar shell positioned automatically by reading direction (**Right** in Arabic `RTL`, **Left** in English `LTR`), enforcing `can(permission)` via `AuthProvider` and `ProtectedRoute`:
  - **Customer (`Buyer`):** `/my-bookings` to track bookings, payment status, digital **QR Code**, arrival info & cancellation rules.
  - **Admin:** Full Control Panel (KPIs: Bookings, Today's Schedule, `EGP` Revenue, Attribution Source, Pending B2B Quotes; 6-status Bookings table; B2B Quotes & Partner Commissions; Code-Free Activities/Prices/Providers/Destinations Manager; **Equipment Inventory & Slot Availability Matrix**; **User Role & Custom Permission Editor**).
  - **Service Provider / Partner:** Strictly scoped to own activities, agreed pricing, own slot capacity, and own bookings.
  - **Operations Team:** Booking verification, `Confirmed -> Completed` transitions, and slot/fleet availability control.
  - **Tour Guide / Agent:** Create & track customer/group booking requests and B2B leads within granted permissions.
  - **Content Manager:** Manage activity descriptions, destination copy, real DUCK photography, and offers with financial/user admin controls blocked.

---

## 8. Data Models & Schema (Frontend State / API Contract)

```typescript
export type Role =
  | 'Guest'
  | 'Customer'
  | 'Admin'
  | 'Partner'
  | 'Operations'
  | 'TourGuide'
  | 'ContentManager';
export type ActivityCategory = 'Kayak' | 'SUP' | 'WaterBike';
export type Currency = 'EGP' | 'USD' | 'EUR'; // EGP is accounting/payment base; USD/EUR indicative only
export type Locale = 'ar' | 'en'; // Modular i18n ready for 'de' | 'fr' | 'ru'
export type BookingStatus = 'Pending' | 'Confirmed' | 'Paid' | 'Completed' | 'Cancelled' | 'Refunded';

export interface Activity {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  category: ActivityCategory;
  destination_en: string;
  destination_ar: string;
  duration: string; // e.g., "2 Hours"
  price_egp: number;
  price_foreign: number; // Base in EGP, auto-converted when USD/EUR selected
  max_capacity_per_slot: number; // 2 for WaterBike
  operating_hours: 'Sunrise to Sunset';
  images: string[];
  meeting_point_name_en: string;
  meeting_point_name_ar: string;
  meeting_point_url: string;
  description_en: string;
  description_ar: string;
  includes_en: string[];
  includes_ar: string[];
}

export interface Booking {
  booking_ref: string;
  activity_id: string;
  date: string; // YYYY-MM-DD (Future date)
  time_slot: string; // Daylight slots between Sunrise & Sunset
  egyptian_count: number;
  foreigner_count: number;
  addons: {
    transportation: boolean;
    photography: boolean;
  };
  total_amount_egp: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  is_guest: boolean;
  payment_status: 'Paid' | 'Pending' | 'Failed';
  booking_status: 'Confirmed' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface B2BQuote {
  quote_id: string;
  organization_name: string;
  contact_person: string;
  phone: string;
  activity_type: ActivityCategory | 'Mixed';
  destination: string;
  group_size: number; // >= 10
  preferred_date: string;
  notes?: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Confirmed';
}
```

---

## 9. Official Contact Info, Links & Tracking Placeholders

- **Brand Name:** DUCK Entertainment
- **Website:** `https://www.duckegy.com/`
- **Official Phone & WhatsApp:** `+201550061006` (Direct link: `https://wa.me/201550061006`)
- **Official Email:** `duck.asw@gmail.com`
- **Primary Location:** Aswan, Egypt (Aswan Island & Gharb Soheil)
- **Social Channels:**
  - Instagram (Primary Booking Channel)
  - Facebook
  - TikTok
- **Analytics & Conversion Attribution Stack (`GA4` + `GTM` + `Meta Pixel` + `Meta CAPI`):** Track actual bookings, EGP sales value, and source attribution across all 8 required events:
  1. `Page View` (`page_view`)
  2. `View Activity` (`view_activity`)
  3. `Search` (`search`)
  4. `Initiate Booking` (`initiate_booking`)
  5. `Add Booking Details` (`add_booking_details`)
  6. `Initiate Checkout` (`initiate_checkout`)
  7. `Purchase / Successful Booking` (`purchase`)
  8. `Lead Submission` (`lead_submission`)

---

## 10. Non-Functional & Quality Checklist (Acceptance Criteria)

- [ ] **Mobile-First Responsive & UI/UX Excellence (`309px–430px` — TOP PRIORITY):** Flawless, native-feeling mobile experience down to narrow viewports (`309px`), tablet (`768px+`), and desktop (`1280px+`) layout:
  - **Single Clean Navbar on Mobile:** Hide the dark utility header (`.top`) on mobile; keep exclusively the sleek white bar (`.nr`, height ~52px) with Logo, Book CTA, and hamburger menu. Language, currency, and weather are placed in `.mnav`.
  - **Compact Sticky Dock (`.dock`):** Height minimized to ~42–45px (font 10px, icons 14px, central CTA button 40px) to maximize content view.
  - **Compact Cards & Truncation-Free Text:** Review card (`.rf`) author metadata, date, trip name, and Google badge aligned in a single ~45px row without multi-line stretching; map destination cards (`.mp-mini`) wrap cleanly on 2 lines with thumbnails and badges without ugly `...` cutoff.
  - **Enterprise 4-Column Footer (`footer.ftr`):** Comprehensive responsive footer featuring brand bio, social channels, quick links, active hubs, WhatsApp/phone/email contacts, and safety badges.
  - **Assets & Media Centralization (`src/shared/assets`):** All logos, icons, and photography must be imported directly from `src/shared/assets`. External URLs, CDN hotlinking, and raw text paths are strictly forbidden. The official Font Awesome React package (`@fortawesome/react-fontawesome`) is used strictly as a fallback for missing icons not present in `assets`.
  - **Bilingual & i18n Centralization (`src/shared/i18n`):** All copy, labels, links, currencies, numbers, and `aria-label`s in Arabic and English must reside in `src/shared/i18n` (`ar.json` & `en.json`). Zero hardcoded text in JSX. Switching language dynamically toggles `dir` (`RTL`/`LTR`) and typography without page reload.
  - **Shared UI & DRY Component Law:** Every recurring UI element must be built once in `src/shared/ui/` (`Accordion`, `Badge`, `Button`, `Card`, `Checkbox`, `DatePicker`, `EmptyState`, `Gallery`, `Input`, `Modal`, `QuantityStepper`, `SectionHeader`, `Select`, `Skeleton`, `StickyBar`, `Table`, `Toast`) and imported via `src/shared/ui/index.js`. Zero copy-pasting of markup or duplicated classes in widgets. All text supplied via props from `src/shared/i18n`. Single-source principle applies strictly to constants, hooks, and utils.
  - **Single Source of Truth for Variables:** All variables (colors, fonts, spacing, shadows, animations) reside exclusively in `src/shared/styles/tokens.css`. Duplicating raw variables in other files is strictly forbidden.
  - **Branching & Push Rule:** Pushing to GitHub is permitted on the specific feature branch only (`git push -u origin <branch>`), and prohibited on `main`.
  - Touch targets `>= 44px × 44px`, form inputs `>= 16px` (preventing iOS auto-zoom), zero horizontal scroll overflow.
- [ ] **Bilingual & Bidirectional (`EN` LTR / `AR` RTL -> `DE`/`FR`/`RU` ready) + `EGP` Accounting Base:** Instant language toggle mirroring direction and showing `USD`/`EUR` strictly as indicative values while preserving `EGP` settlement.
- [ ] **Dual Pricing & Equipment Inventory (`AC-01`, `AC-02`):** Both prices clearly visible; slot availability engine enforces **Kayak = 20**, **Water Bike = 2**, and configurable **SUP** caps per provider/slot.
- [ ] **Frictionless Guest Checkout, QR Ticket & 1-Tap Prompt (`AC-03`):** Complete booking without login; instant confirmation shows Ref, QR Code, arrival details, WhatsApp/Email actions, all 6 lifecycle statuses, and 1-tap password-only account setup.
- [ ] **Payment Failure Resilience & Security (`AC-04`, `NFR-008`):** Retain form inputs in `sessionStorage` on failure; never store card numbers.
- [ ] **6-Role RBAC & Custom Permissions (`AC-06`):** Customer, Admin, Partner, Operations, Tour Guide/Agent, and Content Manager portals strictly enforce capability guards and allow per-user permission overrides.
- [ ] **Hybrid B2B & 8-Event Funnel (`AC-07`):** Ready tiered group packages + Custom RFQ for all 6 partner segments; all 8 analytics events wired for GA4/GTM/Meta Pixel/CAPI.
- [ ] **Living `.md` Documentation Synchronization:** Any architectural update or newly discovered engineering/business rule must be updated immediately across all `.md` files (`AGENTS.md`, `README.md`, `duck_entertainment_comprehensive_project_brief_srs_for_vibe_coding.md`, and `docs/`).