# Business Hub BD — UI/UX Specification & Design System Guidelines

> **Overview**: This specification defines the User Interface (UI) and User Experience (UX) design standards, visual hierarchy, responsiveness rules, and fallback states for **Business Hub BD**.

---

## 1. Design Philosophy & Principles

1. **Bangla-First & Culturally Localized**:
   - Primary typography, labels, and microcopy prioritize natural, polite Bangla phrasing suitable for Bangladeshi entrepreneurs.
   - Prices expressed with ৳ (Taka) symbol and localized numeric formatting.
   - Geographic hierarchy strictly follows: **বিভাগ (Division) → জেলা (District) → এলাকা/উপজিলা (Area/Upazila)**.

2. **Price Transparency & Actionable Clarity**:
   - Distinguish visually between **Wholesale Price (পাইকারি দাম)**, **Retail Market Price (খুচরা বাজারদর)**, and **Expected Sale Price (সম্ভাব্য বিক্রয় মূল্য)**.
   - Profit Potential indicators use high-contrast badges:
     - High (`high`): Emerald / Success badge
     - Medium (`medium`): Amber / Secondary badge
     - Low (`low`): Slate / Neutral badge

3. **Graceful Fallbacks & Zero Blank Screens**:
   - Skeleton loaders during data fetch states.
   - When backend API connection fails, automatically fall back to curated mock data so the UI remains 100% interactive and functional.
   - Clear empty states with call-to-action buttons when no items are returned.

---

## 2. Visual Hierarchy & Color Palette

- **Primary Brand Color**: Deep Emerald (`#059669` / `emerald-600`) representing prosperity, trust, and growth.
- **Secondary Accent**: Warm Amber (`#d97706` / `amber-600`) for AI highlights, profit potential, and callouts.
- **Background & Surfaces**:
  - Light Mode: Clean slate-50 (`#f8fafc`) page background with crisp white elevated cards (`#ffffff`).
  - Dark Mode: Rich slate-950 (`#020617`) background with slate-900 border-lit cards.
- **Typography**: Inter / Hind Siliguri for legibility in both English and Bangla scripts.

---

## 3. Component UI/UX Requirements

### 3.1 Post Cards (`PostCard`)
- Clean image container with subtle scale hover animation (`hover:scale-105 transition-transform`).
- Location pill (District, Division) on top-left of image.
- Category badge on top-right.
- Clear breakdown of Wholesale vs. Retail price.
- Engagement metrics footer (Likes count, Comments count, Views count).

### 3.2 Navigation & Layout (`Header`, `Footer`, `MobileNav`)
- Sticky top header with blur glassmorphism effect (`backdrop-blur-md bg-background/80`).
- Responsive mobile drawer for quick access to Explore, AI Advisor, Analysis, and Blog.
- Quick dark mode toggle and language switcher (`BN` / `EN`).

### 3.3 AI Advisor UI (`/ai-advisor`)
- Quick-select budget pills (৳৫,০০০, ৳১০,০০০, ৳২০,০০০, ৳৫০,০০০).
- Interactive risk level bar with visual color coding:
  - Low Risk (<30%): Green
  - Medium Risk (30–60%): Yellow/Orange
  - High Risk (>60%): Red
- Itemized startup expense breakdown with total sum sanity check.

### 3.4 Dashboard UI (`/dashboard`)
- Sidebar layout with active route indicator.
- Status badges for user posts: `Approved` (Emerald), `Pending` (Amber), `Rejected` (Rose with modal reason view), `Draft` (Slate).

---

## 4. Implementation Guidelines
- All client components must be resilient to API downtime.
- Framer Motion stagger animations for lists (`Stagger`, `StaggerItem`).
- Accessible keyboard navigation and ARIA landmarks.
