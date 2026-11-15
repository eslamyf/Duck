# DUCK Entertainment — Comprehensive Project Brief & Engineering Specification

> **Purpose of this Document:** This file is the single source of truth for building the **DUCK Entertainment Frontend Web Application**. It consolidates the approved IEEE 29148 Software Requirements Specification (SRS v3.0), the Marketing & Brand Brief, UX User Flows, Business Rules, Pricing, Brand Identity, and Technical Constraints into a structured format optimized for AI coding agents and developers.

---

## 1. Project Overview & Context

- **Project Name:** DUCK Entertainment (`duckegy.com`) — Water Activities & Nile Experiences Booking Platform
- **Brand Tagline / Promise:** `IN DUCK WE TRUST`
- **Track / Initiative:** Tech & Web Track — CreativeZ / Dandara Al Ebdaa (12 Nov – 3 Dec 2026)
- **Technical Scope:** **Frontend Web Application ONLY** (React/Next.js/Vite or clean modular HTML/CSS/JS ready for client backend integration).
  - **Included:** Customer/Buyer Frontend (B2C), Corporate/Groups Frontend (B2B RFQ), and Admin Dashboard Frontend (`/admin`).
  - **Out of Scope:** Building backend servers from scratch, coding a payment processor from scratch, building native iOS/Android apps, or altering the brand's visual identity.
- **Core Objective:** Redesign and rebuild the frontend of `duckegy.com` (which already serves ~3,000 booked customers) to fix current UX/copy flaws, clarify dual pricing (Egyptian vs. Foreigner), enable frictionless **Guest Checkout** with online payment, capture high-value **B2B group leads**, and provide a clean **Admin UI**—maximizing conversions from social media traffic (especially Instagram & TikTok on mobile).

---

## 2. Brand Identity, Visual System & Tone of Voice

### 2.1 Visual Identity (STRICT — Do Not Alter)
- **Logo:** Yellow stylized duck icon flanked by blue water waves + `DUCK Entertainment` wordmark.
- **Approved Color Palette:**
  - **Primary Accent / Brand Yellow:** `#F5E847` (High energy, CTAs, highlights, badges)
  - **Secondary / Nile Teal-Blue:** `#067BA1` (Water theme, links, secondary buttons, accents)
  - **Dark Navy / Charcoal Base:** `#121528` (Primary text, dark headers, footer, contrast base)
  - **Backgrounds:** Clean white (`#FFFFFF`) and soft off-white/light sand surfaces for calm readability (ensure minimum `4.5:1` WCAG contrast ratio).
- **Typography:**
  - **English Primary / Display:** `Berlin Sans FB Demi Bold` (or clean rounded geometric display fallback if font file isn't loaded locally) + clean sans-serif body (`Inter` / `Plus Jakarta Sans`).
  - **Monospace / Codes / Refs:** `Consolas Bold` (for booking references, prices, badges).
  - **Arabic Typography:** Modern clean Arabic sans-serif (`Cairo` or `IBM Plex Sans Arabic`) with full **RTL** layout support.
- **Visual Vibe & Motion:**
  - Calm, organized, trustworthy, and relaxing Nile aesthetic—**not** noisy, chaotic, or cluttered.
  - Use subtle, high-performance **micro-animations** (smooth card hovers, instant filter transitions, clean drawer/modal reveals) while maintaining fast load times (`FCP < 2.5s`).

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
- **`BR-003` Water Bike Capacity Cap:** Maximum capacity for **Water Bike** is **2 units total per time slot**. The UI must block selecting more than 2 and display a clear availability alert.
- **`BR-004` Safety & Eligibility Rules:**
  - Maximum participant weight: **130 kg**.
  - **Swimming skills are NOT required** (certified life jackets are mandatory and provided for all participants).
  - Children must be accompanied by an adult.
- **`BR-005` Product Lineup:** Core activities are strictly **Kayak**, **SUP**, and **Water Bike** across approved destinations.
- **`BR-006` Mandatory Online Payment for B2C:** Individual bookings are confirmed only upon completing **Online Payment** via the payment gateway flow.
- **`BR-007` Cancellation & Refund Policy:** **Free cancellation and 100% full refund** if canceled at least **24 hours** before the activity start time. Non-refundable if canceled less than 24 hours prior or in case of no-show.
- **`BR-008` B2B Group Bookings:** Large groups, universities, scouts, and corporate events (`>= 10` participants) are handled via a dedicated **B2B RFQ Form**.
- **`BR-009` Admin Role Restriction:** Access to `/admin` routes, booking status management, and trip/pricing edits is strictly restricted to users with the `Admin` role.
- **`BR-010` Guest Checkout + Post-Booking Account Prompt:** Users **must NOT be forced to register or log in** to book and pay (`Guest Checkout`). Immediately *after* submitting their info and completing booking/payment, display a prominent, friendly card/modal inviting them to **create an account in 1 click** (by simply setting a password using their already-entered name, email, and phone) to track their booking status in real time.

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

### 7.2 B2B Corporate & Groups Flow (`/groups` or `/b2b`)
- **Value Proposition for Organizers:** Operational readiness, group rotation schedules, certified life jackets, dedicated supervisors, and past group highlights.
- **B2B RFQ Form:**
  - Organization / University / Company Name (Required)
  - Contact Person Name (Required)
  - Phone / WhatsApp Number (Required)
  - Activity Type (`Kayak` / `SUP` / `Water Bike` / `Mixed Event`)
  - Destination
  - Expected Group Size (`>= 10` participants, Required)
  - Preferred Date & Notes
- **Confirmation:** Generates a `Quote Reference ID` + instant button to message the B2B sales coordinator on WhatsApp.

### 7.3 Admin Dashboard Frontend (`/admin`)
- **Route Guard (`NFR-004`):** Protected route; unauthenticated users or `Buyer` accounts are redirected to `/admin/login`. (Include a clear demo role-switcher or mock admin login credentials for testing/presentation).
- **KPI Overview Cards:** Total Bookings, Today's Bookings (Sunrise–Sunset schedule), Total Revenue (`EGP`), and Pending B2B Quote Requests.
- **Bookings Management Table:**
  - Columns: `Booking Ref`, `Customer Name & Phone`, `Activity & Destination`, `Date & Time Slot`, `Ticket Breakdown (EG / Foreign)`, `Total Amount`, `Payment Status` (`Paid` / `Pending` / `Failed`), `Booking Status` (`Confirmed` / `Completed` / `Cancelled`).
  - Features: Search by Booking Ref/Name, filter by Date/Destination/Status, view QR/details drawer, and update Booking Status.
- **B2B Quotes Tab:** View incoming group RFQs, group size, organization details, and update lead status (`New` / `Quoted` / `Confirmed`).
- **Trips & Pricing Manager:** Ability to toggle activity availability, edit Egyptian/Foreigner prices, and verify equipment capacity limits (e.g., Water Bike = `2`).

---

## 8. Data Models & Schema (Frontend State / API Contract)

```typescript
export type Role = 'Guest' | 'Buyer' | 'Admin';
export type ActivityCategory = 'Kayak' | 'SUP' | 'WaterBike';
export type Currency = 'EGP' | 'USD' | 'EUR';

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
- **Analytics & Tracking Containers:** Include clean placeholder hooks/scripts in `<head>` for **Meta Pixel ID** and **Google Analytics (GA4)** so marketing tracking IDs can be dropped in effortlessly.

---

## 10. Non-Functional & Quality Checklist (Acceptance Criteria)

- [ ] **Mobile-First Responsive (`360px+`):** Flawless layout on mobile, tablet, and desktop with a persistent sticky bottom CTA bar on mobile activity pages.
- [ ] **Bilingual & Bidirectional (`EN` LTR / `AR` RTL):** Instant language toggle that mirrors layout direction, typography, and currency formatting cleanly.
- [ ] **Dual Pricing Visibility (`AC-01`):** Every trip card clearly displays both Egyptian and Foreigner prices with zero text overlap or typos.
- [ ] **Water Bike Scarcity Enforcement (`AC-02`):** Attempting to book `> 2` units for Water Bike in a single slot is blocked with a clear notice.
- [ ] **Frictionless Guest Checkout + Post-Booking Account Prompt (`AC-03`):** Complete booking and simulated online payment without logging in, followed immediately by the 1-click password setup prompt to track the booking.
- [ ] **Payment Failure Resilience (`AC-04`):** Simulated payment failure retains all user input in session state and allows immediate retry.
- [ ] **Zero Card Data Storage (`NFR-008`):** Never store credit card numbers in `localStorage` or frontend state; pass payment intent cleanly to the payment gateway screen.
- [ ] **Admin Route Protection (`AC-06`):** `/admin` routes are guarded and inaccessible to guests or standard buyers.