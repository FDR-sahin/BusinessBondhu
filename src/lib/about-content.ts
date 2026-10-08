import { Cpu, MapPin, Search, Share2, ShieldCheck, Sparkles, Users, type LucideIcon } from "lucide-react";
import type { Lang } from "@/store/lang-store";

export interface ValueItem {
  icon: LucideIcon;
  title: Record<Lang, string>;
  text: Record<Lang, string>;
}

export const VALUES: ValueItem[] = [
  {
    icon: ShieldCheck,
    title: { bn: "বিশ্বাসযোগ্য তথ্য", en: "Verified Information" },
    text: {
      bn: "প্রতিটি পোস্ট প্রকাশের আগে যাচাই করা হয়, আর ভুল মনে হলে যে কেউ রিপোর্ট করতে পারেন।",
      en: "Every post is reviewed for quality, and community members can easily report inaccurate details.",
    },
  },
  {
    icon: MapPin,
    title: { bn: "স্থানীয় দৃষ্টিভঙ্গি", en: "Local Insights" },
    text: {
      bn: "৮ বিভাগ ও ৬৪ জেলার আলাদা বাজার ও চাহিদা মাথায় রেখে তথ্য সাজানো হয়েছে।",
      en: "Tailored market insights for division and district-level economic realities across Bangladesh.",
    },
  },
  {
    icon: Users,
    title: { bn: "কমিউনিটির শক্তি", en: "Community Power" },
    text: {
      bn: "উদ্যোক্তারা নিজেদের অভিজ্ঞতা ও দাম শেয়ার করেন, সবাই সেখান থেকে শেখেন।",
      en: "Real entrepreneurs share actual supplier rates, margins, and lessons learned from the field.",
    },
  },
  {
    icon: Cpu,
    title: { bn: "প্রযুক্তির সঠিক ব্যবহার", en: "Smart Technology" },
    text: {
      bn: "এআই আপনার বাজেট ও এলাকা দেখে আইডিয়া সাজিয়ে দেয়, সিদ্ধান্ত থাকে আপনার হাতে।",
      en: "AI evaluates budgets and local market trends to suggest feasible venture plans.",
    },
  },
];

export const PAIN_POINTS: Record<Lang, string[]> = {
  bn: [
    "বাজারদর জানতে দোকানে দোকানে ঘুরে অনেক সময় চলে যায়।",
    "কোন এলাকায় কোন ব্যবসা ভালো চলবে, তার নির্ভরযোগ্য ধারণা পাওয়া কঠিন।",
    "অন্য উদ্যোক্তার সফলতা বা ভুল থেকে শেখার কোনো একটি জায়গা নেই।",
  ],
  en: [
    "Spending hours visiting market stalls just to check wholesale and retail price points.",
    "Hard to find reliable district-level data on which ventures actually thrive.",
    "Lack of a dedicated ledger to learn from real success stories and mistakes of fellow storekeepers.",
  ],
};

export interface StepItem {
  icon: LucideIcon;
  title: Record<Lang, string>;
  text: Record<Lang, string>;
}

export const STEPS: StepItem[] = [
  {
    icon: Search,
    title: { bn: "খুঁজুন", en: "Discover Ideas" },
    text: {
      bn: "বিভাগ, জেলা, ক্যাটাগরি ও দাম অনুযায়ী ব্যবসার আইডিয়া খুঁজে নিন।",
      en: "Browse verified business ideas by division, district, category, and initial capital.",
    },
  },
  {
    icon: Share2,
    title: { bn: "জানুন ও শেয়ার করুন", en: "Learn & Share" },
    text: {
      bn: "পাইকারি-খুচরা দাম দেখুন, প্রশ্ন করুন, আর নিজের জানা তথ্যও পোস্ট করুন।",
      en: "Inspect wholesale and retail margins, ask questions, and publish your own shop insights.",
    },
  },
  {
    icon: Sparkles,
    title: { bn: "সিদ্ধান্ত নিন", en: "Take Action" },
    text: {
      bn: "বাজেট দিয়ে এআই পরামর্শ নিন এবং ঝুঁকি বুঝে নিজের ব্যবসা শুরু করুন।",
      en: "Calculate feasibility with our AI venture guide and launch your business with confidence.",
    },
  },
];

export interface TeamMember {
  name: Record<Lang, string>;
  role: Record<Lang, string>;
}

export const TEAM: TeamMember[] = [
  {
    name: { bn: "আরিফ হাসান", en: "Arif Hasan" },
    role: { bn: "প্রতিষ্ঠাতা ও প্রধান নির্বাহী", en: "Founder & CEO" },
  },
  {
    name: { bn: "সাদিয়া রহমান", en: "Sadia Rahman" },
    role: { bn: "প্রোডাক্ট ম্যানেজার", en: "Product Manager" },
  },
  {
    name: { bn: "তানভীর আহমেদ", en: "Tanvir Ahmed" },
    role: { bn: "লিড ইঞ্জিনিয়ার", en: "Lead Engineer" },
  },
  {
    name: { bn: "নাজমুন নাহার", en: "Najmun Nahar" },
    role: { bn: "কমিউনিটি ম্যানেজার", en: "Community Manager" },
  },
];

export interface FaqItem {
  q: Record<Lang, string>;
  a: Record<Lang, string>;
}

export const FAQS: FaqItem[] = [
  {
    q: {
      bn: "Business Hub BD কী এবং এটি কাদের জন্য?",
      en: "What is Business Hub BD and who is it for?",
    },
    a: {
      bn: "এটি বাংলাদেশের উদ্যোক্তাদের একটি অনলাইন কমিউনিটি। যারা নতুন ব্যবসা শুরু করতে চান বা বিদ্যমান ব্যবসা বাড়াতে চান, তারা এখানে এলাকাভিত্তিক আইডিয়া, পাইকারি-খুচরা দাম ও অন্যদের অভিজ্ঞতা পাবেন।",
      en: "It is a community ledger for Bangladeshi entrepreneurs. Whether starting a new venture or growing an existing business, users discover regional ideas, wholesale pricing, and peer experiences.",
    },
  },
  {
    q: {
      bn: "কীভাবে পোস্ট করব?",
      en: "How do I submit a post?",
    },
    a: {
      bn: "প্রথমে একটি অ্যাকাউন্ট খুলে লগইন করুন। তারপর ড্যাশবোর্ডের “নতুন পোস্ট” থেকে শিরোনাম, ক্যাটাগরি, এলাকা, দাম ও বিবরণ দিয়ে পোস্ট জমা দিন। খসড়া হিসেবেও সেভ করে রাখা যায়।",
      en: "Sign in to your account, navigate to 'Create Post' in the dashboard, and fill in the venture details, category, region, and price breakdown. You can also save posts as drafts.",
    },
  },
  {
    q: {
      bn: "আমার পোস্ট সঙ্গে সঙ্গে দেখা যাচ্ছে না কেন?",
      en: "Why is my post not visible immediately?",
    },
    a: {
      bn: "মান ঠিক রাখতে নতুন পোস্ট প্রকাশের আগে পর্যালোচনা করা হয়। ড্যাশবোর্ডের “আমার পোস্ট” পাতায় আপনি দেখতে পাবেন পোস্টটি অপেক্ষমান, অনুমোদিত নাকি বাতিল হয়েছে।",
      en: "To ensure accuracy, posts are moderated before going live. You can track your post status (Pending, Approved, or Rejected) on the 'My Posts' dashboard page.",
    },
  },
  {
    q: {
      bn: "পাইকারি, খুচরা ও রিটেইল সেল দাম কীভাবে দেব?",
      en: "How should I input wholesale, retail, and selling prices?",
    },
    a: {
      bn: "পাইকারি দাম হলো আপনি যে দামে মাল কেনেন, খুচরা দাম হলো বাজারে প্রচলিত মূল্য, আর রিটেইল সেল হলো আপনি ক্রেতার কাছে যে দামে বিক্রি করেন। সম্ভব হলে সাম্প্রতিক ও বাস্তব দাম দিন, যাতে অন্যরা উপকৃত হন।",
      en: "Wholesale cost is your purchase price, market retail is standard market pricing, and selling price is your sale rate. Please provide accurate, recent figures to help other storekeepers.",
    },
  },
  {
    q: {
      bn: "এআই পরামর্শ কতটা নির্ভরযোগ্য?",
      en: "How reliable is the AI Business Advisor?",
    },
    a: {
      bn: "এআই-এর দেওয়া খরচ, লাভ ও ঝুঁকির হিসাব আনুমানিক। এটি আপনাকে ভাবনার একটি শুরু দেয়, কিন্তু বাস্তব ফলাফল বাজার, মৌসুম ও আপনার দক্ষতার ওপর নির্ভর করে। বিনিয়োগের আগে নিজে যাচাই করে নিন।",
      en: "The AI calculations provide initial feasibility estimates. While helpful for planning, actual profitability depends on local market conditions and execution. Always verify supplier rates before investing.",
    },
  },
  {
    q: {
      bn: "কোনো পোস্টের তথ্য ভুল বা বিভ্রান্তিকর মনে হলে কী করব?",
      en: "What if I find inaccurate or misleading information?",
    },
    a: {
      bn: "পোস্টের নিচে থাকা “রিপোর্ট করুন” বোতামে চাপ দিয়ে কারণ জানান। আমাদের টিম বিষয়টি দেখবে এবং প্রয়োজনে পোস্টটি সরিয়ে দেবে।",
      en: "Click the 'Report' button at the bottom of the post and specify the reason. Our team will review the report and take appropriate action.",
    },
  },
  {
    q: {
      bn: "সব জেলার তথ্য কি পাওয়া যায়?",
      en: "Is information available for all 64 districts?",
    },
    a: {
      bn: "সব ৬৪ জেলা ও ৮ বিভাগ বেছে নেওয়া যায়। তবে কোন এলাকায় কত পোস্ট আছে তা কমিউনিটির অংশগ্রহণের ওপর নির্ভর করে। আপনার এলাকার তথ্য শেয়ার করে আপনিও এই ঘাটতি পূরণে সাহায্য করতে পারেন।",
      en: "All 8 divisions and 64 districts are supported. Data availability depends on community posts in each area—feel free to contribute insights from your district!",
    },
  },
  {
    q: {
      bn: "আমার তথ্য কি নিরাপদ?",
      en: "Is my personal data secure?",
    },
    a: {
      bn: "আমরা শুধু প্রয়োজনীয় তথ্য সংগ্রহ করি। পোস্ট ও মন্তব্যে আপনার নাম ও ছবি দেখা যায়, কিন্তু ইমেইল ঠিকানা অন্যদের কাছে প্রকাশ করা হয় না। ব্যক্তিগত তথ্য কখনো পোস্টে দেবেন না।",
      en: "We prioritize user privacy. Only your display name and public profile are shown on posts. Your email and private details are never exposed.",
    },
  },
  {
    q: {
      bn: "অ্যাকাউন্ট মুছে ফেলতে চাইলে কী করব?",
      en: "How do I delete my account?",
    },
    a: {
      bn: "ড্যাশবোর্ডের “সেটিংস” পাতায় অ্যাকাউন্ট মুছে ফেলার অপশন আছে। নিশ্চিত করার পর আপনার অ্যাকাউন্ট ও সংশ্লিষ্ট তথ্য মুছে ফেলা হবে।",
      en: "You can delete your account from the 'Settings' page in your dashboard. Once confirmed, your profile and associated data will be removed.",
    },
  },
  {
    q: {
      bn: "আমাদের সঙ্গে কীভাবে যোগাযোগ করব?",
      en: "How can I contact support?",
    },
    a: {
      bn: "এই পাতার নিচের ফর্ম ব্যবহার করে বার্তা পাঠাতে পারেন, অথবা পাশে দেওয়া ইমেইল ও ফোন নম্বরে সরাসরি যোগাযোগ করতে পারেন।",
      en: "You can send a message using the form at the bottom of this page or reach us directly via the provided email and phone number.",
    },
  },
];
