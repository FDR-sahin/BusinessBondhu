# Business Hub BD — Website Content & Architectural Analysis

> **Purpose**: This document provides a comprehensive, structured overview of the **Business Hub BD** platform's content, features, pages, data models, and user flows. It is specifically crafted to enable an AI agent or analyst to understand and evaluate the entire website.

---

## 1. Executive Summary

- **Platform Name**: Business Hub BD (বাংলাদেশ বিজনেস হাব)
- **Tagline / Mission**: Empowering micro, small, and medium-sized enterprises (MSMEs) and aspiring entrepreneurs in Bangladesh with localized business ideas, price transparency (wholesale vs. retail), market data, and AI-assisted financial advice.
- **Target Audience**: Entrepreneurs, small business owners, traders, wholesalers, micro-investors, and freelancers across all 8 divisions and 64 districts of Bangladesh.
- **Languages Supported**: Bilingual (Bangla primary, English secondary). UI components and site chrome support dynamic language switching.
- **Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Radix UI, TanStack React Query v5, Zustand, Zod, Recharts, Lucide Icons, Axios.

---

## 2. Core Business Domains & Taxonomy

### 2.1 Business Categories (৮টি ক্যাটাগরি)
1. **Food & Beverage (`food-beverage`)** — খাদ্য ও পানীয়
2. **Clothing (`clothing`)** — পোশাক ও ফ্যাশন
3. **Services (`services`)** — সেবা ও মেকানিক/আইটি সেবা
4. **Pharmacy & Health (`pharmacy-health`)** — ফার্মেসি ও স্বাস্থ্য সুরক্ষা
5. **Electronics (`electronics`)** — ইলেকট্রনিকস ও গ্যাজেটস
6. **Cosmetics (`cosmetics`)** — কসমেটিকস ও বিউটি কেয়ার
7. **Agriculture & Livestock (`agriculture-livestock`)** — কৃষি, দুগ্ধ ও পশুপালন
8. **Others (`others`)** — অন্যান্য উদীয়মান ক্ষেত্র

### 2.2 Geographic Coverage (৮ বিভাগ ও ৬৪ জেলা)
- **Dhaka (ঢাকা)**: 13 districts (Dhaka, Gazipur, Narayanganj, Tangail, etc.)
- **Chattogram (চট্টগ্রাম)**: 11 districts (Chattogram, Cox's Bazar, Cumilla, etc.)
- **Rajshahi (রাজশাহী)**: 8 districts (Rajshahi, Bogura, Pabna, etc.)
- **Khulna (খুলনা)**: 10 districts (Khulna, Jashore, Kushtia, etc.)
- **Barishal (বরিশাল)**: 6 districts (Barishal, Bhola, Patuakhali, etc.)
- **Sylhet (সিলেট)**: 4 districts (Sylhet, Moulvibazar, Habiganj, Sunamganj)
- **Rangpur (রংপুর)**: 8 districts (Rangpur, Dinajpur, Kurigram, etc.)
- **Mymensingh (ময়মনসিংহ)**: 4 districts (Mymensingh, Jamalpur, Netrokona, Sherpur)

---

## 3. Site Map & Page Breakdown

### 3.1 Public Pages (`(public)`)

#### 1. Home Page (`/`)
- **Hero Section**: Headline, search bar with category & district quick filters.
- **Category Grid**: Interactive icons and post counts for all 8 categories.
- **Trending & Recent Posts**: Curated cards showing high-engagement business ideas with profit potential badges.
- **Top Districts Bar**: Direct links to location-filtered ideas.
- **AI Business Advisor Teaser**: Call to Action (CTA) encouraging users to calculate business ROI based on budget.
- **Success Stories / Testimonials**: Real-world community experiences.
- **Newsletter Subscription**: Weekly market trends and price alerts delivery via email.

#### 2. Explore / Search (`/explore`)
- **Search & Multi-Filter**: Filter by search query, division, district, specific area/upazila, category, wholesale/retail price range sliders.
- **Sorting Options**: Sort by newest, most liked, most viewed, or price potential.
- **View Options**: Grid display with pagination and empty-state placeholders.

#### 3. Post Detail View (`/post/[id]`)
- **Post Info**: Title, author card, publishing date, location tags, category badge.
- **Pricing Cards**:
  - Wholesale Price (পাইকারি দাম)
  - Retail Price (খুচরা বাজারদর)
  - Retail Sell Price (সম্ভাব্য বিক্রয় মূল্য)
  - Profit Potential Badge (`low`, `medium`, `high`)
- **Description & Tags**: Detailed business execution guide and keywords.
- **Interactive Action Bar**: Like, Dislike, Bookmark/Save, Share menu, Report post dialog.
- **Comment Section**: Nested threaded comments (1 level deep replies) with reaction support.
- **Related Posts**: Contextual suggestions from the same district or category.

#### 4. AI Advisor (`/ai-advisor`)
- **Input Form**: User enters investment budget (BDT), division, district, optional area, and industry category.
- **AI Output Dashboard**:
  - Recommended business ventures matching budget.
  - Itemized startup cost breakdown table.
  - Estimated Daily & Monthly net profit estimates.
  - Risk Metric gauge (0-100%).
  - Strategic advice on why the venture fits the chosen district.
  - Actionable execution tips.

#### 5. Analytics & Market Insights (`/analysis`)
- **Key Metrics Overview**: Total posts, community members, comment stats, active districts count.
- **Regional Post Distribution**: Interactive breakdown chart by 8 divisions.
- **Category Popularity**: Visual representation of active business sectors.
- **Historical Growth & Price Trends**: Wholesale vs. Retail price margin trends over 6-month cycles.
- **Top District Hubs & Leading Contributors**: Leaderboards of active creators.

#### 6. Educational Blog (`/blog` & `/blog/[slug]`)
- Articles on market research, digital marketing, supply chain tips, legal registration in Bangladesh.
- Sanitized HTML blog reader with estimated reading time, author metadata, and category tags.

#### 7. About & Help (`/about`)
- Core Mission & Platform Values (Trust, Localization, Community Power, Smart Tech).
- Step-by-Step Workflow Guide (Find -> Learn & Share -> Decide).
- Comprehensive FAQ Section covering post approval workflow, pricing guides, safety, and account settings.
- Contact form & direct email/phone contact information.

---

### 3.2 Authentication Pages (`(auth)`)
- **Login (`/login`)**: Email/password authentication, social/OAuth login callback handling.
- **Signup (`/signup`)**: Account creation with division/district selection.
- **Password Recovery (`/forgot-password` & `/reset-password`)**: Token-based security reset flows.

---

### 3.3 Protected User Dashboard (`/dashboard`)

#### 1. Dashboard Overview (`/dashboard`)
- Stat Cards: Total published posts, aggregate likes received, view count, total comments.
- Performance Charts: Weekly likes and post interaction trends.
- Recent Activity Log: Real-time notifications for likes, comments, replies, system updates.

#### 2. Create Post (`/dashboard/create-post`)
- Post Editor Form with Zod validation.
- Cloudinary image upload integration.
- Location selectors (Division -> District cascade).
- Pricing inputs (Wholesale, Retail, Proposed Sell price).
- Action buttons: "Save Draft" or "Submit for Moderation".

#### 3. My Posts Management (`/dashboard/my-posts` & `/dashboard/my-posts/[id]/edit`)
- Status Badges: `Draft`, `Pending Approval`, `Approved`, `Rejected`.
- Rejection reason alerts from moderators.
- Edit and delete actions for user-owned posts.

#### 4. Interaction Hubs
- **Comments (`/dashboard/comments`)**: Unified inbox for comments received on user posts with direct reply capability.
- **Saved Posts (`/dashboard/saved`)**: Personal library of bookmarked business ideas.
- **Likes / Dislikes (`/dashboard/likes`, `/dashboard/dislikes`)**: History of user reactions.
- **Notifications (`/dashboard/notifications`)**: Alert center with read/unread status filters.
- **Profile & Settings (`/dashboard/profile`, `/dashboard/settings`)**: Profile details customization, notification toggles, and account deletion option.

---

## 4. Key Data Entities & API Contracts

### 4.1 Post Interface (`Post`)
```typescript
interface Post {
  id: string;
  title: string;
  image?: string;
  category: string; // e.g. "food-beverage"
  division: string; // e.g. "Dhaka"
  district: string; // e.g. "Gazipur"
  area?: string;
  wholesalePrice: number;
  retailPrice: number;
  retailSellPrice?: number;
  profitPotential: "low" | "medium" | "high";
  author: { id: string; name: string; avatar?: string };
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
}
```

### 4.2 AI Advisor Response (`AdvisorSuggestion`)
```typescript
interface AdvisorSuggestion {
  name: string;
  category?: string;
  costBreakdown: { item: string; amount: number }[];
  totalCost?: number;
  profitDaily: number;
  profitMonthly: number;
  riskPercent: number; // 0 to 100
  reason: string;      // Geographic suitability logic
  tips: string[];
}
```

---

## 5. Summary of Key Operational Workflows

1. **Post Moderation Flow**:
   User creates post -> Saved as `pending` -> Admin moderation check -> Published as `approved` (visible globally on Explore & Home) or `rejected` (with explanation sent to author).

2. **JWT Single-Flight Refresh Flow**:
   Axios interceptor detects HTTP `401 Unauthorized` -> Triggers silent single-flight `/auth/refresh` request -> Retries failed API calls seamlessly without logging out the user.

3. **Multi-Language Flow**:
   Bangla content by default (`bn`), toggleable to English (`en`). Site chrome updates immediately via Zustand state store.

---

> **Note for AI Agents**: When analyzing this repository, refer to `src/types/index.ts` for exact type definitions, `src/lib/constants.ts` for site configuration, and `src/app` for App Router structure.
