import type { AdvisorRequest, AdvisorResponse, AdvisorSuggestion } from "@/types";

interface DistrictInsight {
  specialty: string;
  sourcingHub: string;
}

const DISTRICT_INSIGHTS: Record<string, DistrictInsight> = {
  Dhaka: { specialty: "সবচেয়ে বড় কনজিউমার মার্কেট ও ই-কমার্স হাব", sourcingHub: "চকবাজার, ইসলামপুর, কারওয়ান বাজার ও বাবুবাজার" },
  Gazipur: { specialty: "গার্মেন্টস কর্মী ও বৃহৎ শিল্পাঞ্চল এলাকা", sourcingHub: "টঙ্গী পাইকারি বাজার ও কোনাবাড়ী" },
  Narayanganj: { specialty: "হোসিয়ারি, পোশাক ও সুতা বাণিজ্যের রাজধানী", sourcingHub: "তানবাজার ও নিতাইগঞ্জ" },
  Chattogram: { specialty: "আন্তর্জাতিক বন্দর, সামুদ্রিক মাছ ও বাণিজ্যিক কেন্দ্র", sourcingHub: "খাতুনগঞ্জ, আছদগঞ্জ ও রিয়াজউদ্দীন বাজার" },
  "Cox's Bazar": { specialty: "পর্যটন, শুঁটকি মাছ ও হোটেল-রেস্তোরাঁ ব্যবসা", sourcingHub: "বড় বাজার ও নাজিরারটেক" },
  Rajshahi: { specialty: "আম, রেশম সিল্ক ও শিক্ষানগরী", sourcingHub: "সাহেব বাজার ও বানেশ্বর হাট" },
  Bogura: { specialty: "উত্তরবঙ্গের বাণিজ্যিক প্রবেশদ্বার, দই ও কৃষি যন্ত্রপাতি", sourcingHub: "রাজাবাজার ও ফতেহ আলী বাজার" },
  Sylhet: { specialty: "প্রবাসী রেমিট্যান্স হাব ও চা-পর্যটন এলাকা", sourcingHub: "বন্দরবাজার ও কালীঘাট" },
  Khulna: { specialty: "চিংড়ি রপ্তানি ও মোংলা বন্দর ট্রানজিট", sourcingHub: "বড় বাজার ও রূপসা" },
  Barishal: { specialty: "নদীবেষ্টিত শস্য ভাণ্ডার, ইলিশ ও পেয়ারা হাব", sourcingHub: "পোর্ট রোড ও নতুন বাজার" },
  Patuakhali: { specialty: "পায়রা বন্দর ও উপকূলীয় মৎস্য বাণিজ্য", sourcingHub: "দশমিনা ও চকবাজার" },
  Rangpur: { specialty: "কৃষিজাত তামাক, আলু ও হ্যান্ডিক্রাফট হাব", sourcingHub: "সিটি বাজার ও নবাবগঞ্জ বাজার" },
  Dinajpur: { specialty: "সুগন্ধি চাল, লিচু ও গম উৎপাদনের কেন্দ্র", sourcingHub: "বাহাদুর বাজার ও পুলহাট" },
  Mymensingh: { specialty: "মৎস্য হ্যাচারি, পোল্ট্রি ও কৃষি বিশ্ববিদ্যালয় জোন", sourcingHub: "ছোটা বাজার ও মেছুয়া বাজার" },
  Cumilla: { specialty: "মিষ্টান্ন, খাদি কাপড় ও প্রবাসী বিনিয়োগ", sourcingHub: "চকবাজার ও কান্দিরপাড়" },
  Jessore: { specialty: "ফুল চাষ, চামড়া শিল্প ও বেনাপোল স্থলবন্দর", sourcingHub: "গদখালী ও বড় বাজার" },
  Tangail: { specialty: "তাঁতের শাড়ি, মিষ্টি ও কৃষি প্রক্রিয়াজাতকরণ", sourcingHub: "করটিয়া হাট ও পার্ক বাজার" },
};

function getDistrictInfo(districtName?: string): DistrictInsight {
  if (!districtName) {
    return { specialty: "স্থানীয় ঘনবসতি ও ক্রমবর্ধমান কনজিউমার চাহিদা", sourcingHub: "নিকটস্থ জেলা সদর ও বিভাগীয় পাইকারি বাজার" };
  }
  return DISTRICT_INSIGHTS[districtName] || {
    specialty: `${districtName} জেলার ক্রমবর্ধমান স্থানীয় খুচরা ও পাইকারি চাহিদা`,
    sourcingHub: `${districtName} সদর বাজার ও বিভাগীয় প্রধান পাইকারি হাব`,
  };
}

interface TemplateIdea {
  id: string;
  name: string;
  category: string;
  minBudget: number;
  maxBudget: number;
  costDistribution: { item: string; ratio: number }[];
  dailyProfitRatio: number;
  monthlyProfitRatio: number;
  riskPercent: number;
  reasonTemplate: (district: string, specialty: string) => string;
  tips: string[];
}

const BUSINESS_TEMPLATES: TemplateIdea[] = [
  // --- TIER 1: Ultra-Low Budget (1,000 - 20,000) ---
  {
    id: "ultra-food-tea",
    name: "ভ্রাম্যমাণ স্পেশাল মসলা চা, কফি ও স্ন্যাকস কর্নার",
    category: "food-beverage",
    minBudget: 1_000,
    maxBudget: 25_000,
    costDistribution: [
      { item: "পাইকারি প্রিমিয়াম চা পাতা, গুঁড়ো দুধ ও চিনি", ratio: 0.35 },
      { item: "খাঁটি মসলা (এলাচ, দারুচিনি, লবঙ্গ) ও আদা", ratio: 0.15 },
      { item: "ফ্লাস্ক, কেটলি ও ডিসপোজেবল ইকো-কাপ", ratio: 0.25 },
      { item: "বিস্কুট-টোস্ট স্টক ও নগদ রিজার্ভ", ratio: 0.25 },
    ],
    dailyProfitRatio: 0.08,
    monthlyProfitRatio: 0.85,
    riskPercent: 14,
    reasonTemplate: (d, s) => `${d} জেলায় ${s} থাকায় জনবহুল পয়েন্টগুলোতে প্রতিদিন প্রচুর পথচারী ও তরুণদের চায়ের আড্ডা জমে। কম খরচে প্রতিদিন নিশ্চিত ক্যাশ সেল সম্ভব।`,
    tips: [
      "বাসস্ট্যান্ড, কলেজ গেট বা বাজারের ব্যস্ত মোড়ে দুপুর থেকে রাত পর্যন্ত স্টল দিন।",
      "মাটির ভাঁড় বা স্পেশাল মশলা চা দিয়ে আলাদা ব্র্যান্ডিং তৈরি করুন।",
      "প্রতিদিন নগদ বিক্রির হিসাব আলাদা ক্যাশ বাক্সে সংরক্ষণ করুন।",
    ],
  },
  {
    id: "ultra-food-spices",
    name: "ঘরে তৈরি খাঁটি গুঁড়ো মসলা ও স্পেশাল আচার প্যাকেজিং",
    category: "food-beverage",
    minBudget: 2_000,
    maxBudget: 30_000,
    costDistribution: [
      { item: "পাইকারি কাঁচা হলুদ, মরিচ, ধনিয়া ও গোটা জিরা", ratio: 0.45 },
      { item: "ফুড-গ্রেড বয়াম, জিপলক পাউচ ও লেবেল স্টিকার", ratio: 0.25 },
      { item: "প্যাকেজিং সিলিং মেশিন ও পরিমাপক স্কেল", ratio: 0.30 },
    ],
    dailyProfitRatio: 0.06,
    monthlyProfitRatio: 0.60,
    riskPercent: 18,
    reasonTemplate: (d, s) => `${d} এলাকার পরিবারগুলো ভেজালমুক্ত খাঁটি হোমমেড মসলা ও আচারের প্রতি আগ্রহী। স্বাস্থ্যসচেতন ক্রেতাদের টার্গেট করা সহজ।`,
    tips: [
      "ভেজালহীন ও ১০০% নির্ভেজাল গ্যারান্টি দিয়ে পাড়া-মহল্লায় ও অনলাইনে পরিচিতি বাড়ান।",
      "১০০ গ্রাম ও ২৫০ গ্রামের আকর্ষণীয় ছোট ট্রায়াল প্যাক তৈরি করুন।",
    ],
  },
  {
    id: "ultra-clothing-socks",
    name: "পাইকারি টি-শার্ট ও মোজা/এক্সেসরিজ লোকাল রিটেইলিং",
    category: "clothing",
    minBudget: 2_000,
    maxBudget: 35_000,
    costDistribution: [
      { item: "পাইকারি এক্সপোর্ট কোয়ালিটি টি-শার্ট ও মোজা লট", ratio: 0.60 },
      { item: "হ্যান্ডব্যাগ, ক্যারি পলি ও হ্যাঙ্গার", ratio: 0.15 },
      { item: "লোকাল ফুটফল পয়েন্ট ভাড়া বা ফেসবুক বুস্টিং", ratio: 0.25 },
    ],
    dailyProfitRatio: 0.05,
    monthlyProfitRatio: 0.55,
    riskPercent: 20,
    reasonTemplate: (d, s) => `${d} জেলায় তরুণ ও শিক্ষার্থীদের মাঝে নিত্যপ্রয়োজনীয় বাজেট পোশাকের নিয়মিত চাহিদা রয়েছে।`,
    tips: [
      "ইসলামপুর বা বঙ্গবাজার থেকে সরাসরি ডজন হিসেবে পাইকারি কেনাকাটা করুন।",
      "৩ জোড়া মোজা বা ২ টি টি-শার্টের কম্বো অফার দিলে দ্রুত বিক্রি হয়।",
    ],
  },
  {
    id: "ultra-electronics-acc",
    name: "মোবাইল কেবল, চার্জার ও গ্যাজেট এক্সেসরিজ ভেন্ডিং",
    category: "electronics",
    minBudget: 3_000,
    maxBudget: 35_000,
    costDistribution: [
      { item: "পাইকারি ফাস্ট চার্জিং কেবল, অ্যাডাপ্টার ও ইয়ারফোন", ratio: 0.65 },
      { item: "ডিসপ্লে কাউন্টার ও স্টোরেজ বক্স", ratio: 0.15 },
      { item: "মার্কেটিং ও রানিং ব্যাকআপ ফান্ড", ratio: 0.20 },
    ],
    dailyProfitRatio: 0.06,
    monthlyProfitRatio: 0.65,
    riskPercent: 22,
    reasonTemplate: (d, s) => `${d} অঞ্চলে স্মার্টফোন ব্যবহারকারীর সংখ্যা ব্যাপক। কেবল বা চার্জার নষ্ট হলে মানুষ তাৎক্ষণিক হাতের কাছে কিনতে চায়।`,
    tips: [
      "গুলিস্তান সুন্দরবন মার্কেট বা মোতালেব প্লাজা থেকে পাইকারি কিনুন।",
      "১ মাসের রিপ্লেসমেন্ট ওয়ারেন্টি দিলে কাস্টমারদের বিশ্বাস বাড়ে।",
    ],
  },
  {
    id: "ultra-agri-seedlings",
    name: "ছাদবাগান ও কিচেন গার্ডেনিং হাইব্রিড চারা ও সার কিট",
    category: "agriculture-livestock",
    minBudget: 2_000,
    maxBudget: 30_000,
    costDistribution: [
      { item: "উন্নত জাতের সবজি ও ফলের চারা এবং বীজ", ratio: 0.50 },
      { item: "জৈব ভার্মিকম্পোস্ট সার ও কোকোপিট", ratio: 0.30 },
      { item: "গ্রো-ব্যাগ ও ডেলিভারি প্যাকেজিং", ratio: 0.20 },
    ],
    dailyProfitRatio: 0.05,
    monthlyProfitRatio: 0.50,
    riskPercent: 16,
    reasonTemplate: (d, s) => `${d} শহরে বাসাবাড়ির ছাদে বা বারান্দায় শাকসবজি ও ফল চাষের আগ্রহ দ্রুত বাড়ছে।`,
    tips: [
      "রেডি-টু-প্ল্যান্ট টব ও গ্রো-ব্যাগে চারা রোপণ করে বিক্রয় করুন।",
      "গাছের পরিচর্যা বিষয়ক বিনামূল্যে টিপস দিয়ে কাস্টমার ধরে রাখুন।",
    ],
  },

  // --- TIER 2: Low-Mid Budget (20,001 - 70,000) ---
  {
    id: "low-clothing-boutique",
    name: "পাইকারি থ্রি-পিস ও বাটিক কুর্তি অনলাইন/অফলাইন বুটিক",
    category: "clothing",
    minBudget: 20_000,
    maxBudget: 80_000,
    costDistribution: [
      { item: "ইসলামপুর ও নরসিংদী থেকে সুতি ও জর্জেট থ্রি-পিস লট", ratio: 0.55 },
      { item: "বাটিক কুর্তি, ওড়না ও ম্যাচিং পায়জামা স্টক", ratio: 0.20 },
      { item: "প্রিমিয়াম প্যাকেজিং বক্স ও ডেলিভারি ব্যাকআপ", ratio: 0.10 },
      { item: "সোশ্যাল মিডিয়া পেজ প্রমোশন ও ফটোগ্রাফি", ratio: 0.15 },
    ],
    dailyProfitRatio: 0.04,
    monthlyProfitRatio: 0.45,
    riskPercent: 24,
    reasonTemplate: (d, s) => `${d} জেলার নারীদের মাঝে আধুনিক ট্রেন্ডি পোশাকের তুমুল চাহিদা রয়েছে। ${s}-এর সঙ্গে অনলাইন শপিং দ্রুত জনপ্রিয় হচ্ছে।`,
    tips: [
      "সরাসরি ভিডিও ও লাইভ সেশনের মাধ্যমে কাপড়ের মান প্রদর্শন করুন।",
      "ক্যাশ অন ডেলিভারি সুবিধা প্রদান করে দ্রুত আস্থা অর্জন করুন।",
    ],
  },
  {
    id: "low-food-juice-cart",
    name: "আধুনিক ফ্রুট জুস, লাচ্ছি ও লাইভ ফাস্টফুড কিয়স্ক",
    category: "food-beverage",
    minBudget: 25_000,
    maxBudget: 90_000,
    costDistribution: [
      { item: "স্টেইনলেস স্টিল ডিজাইন ফুড কার্ট / কিয়স্ক", ratio: 0.35 },
      { item: "কমার্শিয়াল ব্লেন্ডার, আইস বক্স ও জুসার মেশিন", ratio: 0.25 },
      { item: "সিজনাল ফলমূল, দই, দুধ ও সিরাপ প্রাথমিক স্টক", ratio: 0.25 },
      { item: "লোগো প্রিন্টেড গ্লাস, স্ট্র ও ডিসপোজেবল সামগ্রী", ratio: 0.15 },
    ],
    dailyProfitRatio: 0.05,
    monthlyProfitRatio: 0.50,
    riskPercent: 20,
    reasonTemplate: (d, s) => `${d} শহরে তরুণ ও স্বাস্থ্যসচেতন মানুষের জন্য ফ্রেশ ফ্রুট জুস ও লাচ্ছির চাহিদা সারা বছরই থাকে।`,
    tips: [
      "পরিচ্ছন্নতা ও শতভাগ খাঁটি ফলের জুস নিশ্চিত করলে নিয়মিত কাস্টমার তৈরি হবে।",
      "সন্ধ্যায় ভিড় বেশি হয় এমন মার্কেট বা জিম সেন্টারের সামনে আউটলেট দিন।",
    ],
  },
  {
    id: "low-cosmetics-hub",
    name: "চকবাজার সোর্সিং স্কিনকেয়ার ও বিউটি প্রোডাক্টস হাব",
    category: "cosmetics",
    minBudget: 20_000,
    maxBudget: 80_000,
    costDistribution: [
      { item: "চকবাজার থেকে আমদানিকৃত অরিজিনাল কসমেটিক্স লট", ratio: 0.60 },
      { item: "ডিসপ্লে র‍্যাক, এলইডি লাইট ও অর্গানাইজার", ratio: 0.15 },
      { item: "প্যাকেজিং, উপহার বক্স ও অনলাইন ডেলিভারি ফান্ড", ratio: 0.15 },
      { item: "সোশ্যাল মিডিয়া ও লোকাল মার্কেটিং", ratio: 0.10 },
    ],
    dailyProfitRatio: 0.045,
    monthlyProfitRatio: 0.45,
    riskPercent: 23,
    reasonTemplate: (d, s) => `${d} এলাকায় নারী শিক্ষার্থীদের মাঝে মেকআপ ও অর্গানিক স্কিনকেয়ার পণ্যের চাহিদা সবসময় ঊর্ধ্বমুখী।`,
    tips: [
      "অথেনটিক ও নকলমুক্ত পণ্যের নিশ্চয়তা দিয়ে লয়্যাল ক্রেতা তৈরি করুন।",
      "স্কিন টোন অনুযায়ী কম্বো প্যাকেজ তৈরি করে বিক্রি বাড়ান।",
    ],
  },
  {
    id: "low-services-cleaning",
    name: "হোম অ্যান্ড অফিস ডিপ ক্লিনিং ও সোফা-ওয়াশ সার্ভিস",
    category: "services",
    minBudget: 25_000,
    maxBudget: 90_000,
    costDistribution: [
      { item: "কমার্শিয়াল ওয়েট অ্যান্ড ড্রাই ভ্যাকুয়াম ক্লিনার", ratio: 0.40 },
      { item: "সোফা ও কার্পেট ক্লিনিং কেমিক্যাল ও ব্রাশ সেট", ratio: 0.25 },
      { item: "ইউনিফর্ম, সেফটি কিট ও প্রচারমূলক লিফলেট", ratio: 0.15 },
      { item: "লোকাল ফেসবুক ক্যাম্পেইন ও ডিরেক্টরি লিস্টিং", ratio: 0.20 },
    ],
    dailyProfitRatio: 0.05,
    monthlyProfitRatio: 0.55,
    riskPercent: 18,
    reasonTemplate: (d, s) => `${d} শহরের আধুনিক ফ্ল্যাট ও অফিসগুলোতে ব্যস্ততার কারণে নিয়মিত ডিপ ক্লিনিং সার্ভিসের ব্যাপক চাহিদা তৈরি হয়েছে।`,
    tips: [
      "প্রথম কাজের পর কাস্টমারের রিভিউ ভিডিও পেজে শেয়ার করুন।",
      "মাসিক বা ত্রৈমাসিক সাবস্ক্রিপশন প্যাকেজ অফার করুন।",
    ],
  },
  {
    id: "low-agri-quail",
    name: "বাণিজ্যিক কোয়েল পাখির ডিম উৎপাদন ও ছানা সরবরাহ",
    category: "agriculture-livestock",
    minBudget: 20_000,
    maxBudget: 80_000,
    costDistribution: [
      { item: "উন্নত জাতের ৩০০-৫০০ কোয়েল পাখি ক্রয়", ratio: 0.45 },
      { item: "মাল্টি-লেয়ার খাঁচা ও স্বয়ংক্রিয় পানির ড্রপলাইন", ratio: 0.25 },
      { item: "উচ্চমানের ব্যালেন্সড ফিড ও ভিটামিন", ratio: 0.20 },
      { item: "প্যাকেজিং কেস ও পরিবহন খরচ", ratio: 0.10 },
    ],
    dailyProfitRatio: 0.04,
    monthlyProfitRatio: 0.42,
    riskPercent: 20,
    reasonTemplate: (d, s) => `${d} জেলায় পুষ্টিসমৃদ্ধ কোয়েল পাখির ডিমের নিয়মিত চাহিদা হোটেল, সুপারশপ ও মুদি দোকানে রয়েছে।`,
    tips: [
      "প্রতিদিন ভোরে তাজা ডিম স্থানীয় পাইকারি দোকানগুলোতে সাপ্লাই দিন।",
      "সঠিক তাপমাত্রা ও বায়ু চলাচল বজায় রাখলে পাখির মৃত্যুহার একদম কমে যায়।",
    ],
  },

  // --- TIER 3: Mid Budget (70,001 - 2,50,000) ---
  {
    id: "mid-electronics-care",
    name: "স্মার্ট গ্যাজেট শোরুম ও মোবাইল রিপেয়ারিং হাব",
    category: "electronics",
    minBudget: 70_000,
    maxBudget: 300_000,
    costDistribution: [
      { item: "স্মার্টওয়াচ, ট্রু-ওয়্যারলেস ইয়ারবাডস ও গ্যাজেট স্টক", ratio: 0.45 },
      { item: "দোকান পজিশন / অ্যাডভান্স ও ডেকোরেশন গ্লাস শোকেস", ratio: 0.30 },
      { item: "প্রফেশনাল হট গান, এসএমডি ও রিপেয়ারিং টুলস", ratio: 0.15 },
      { item: "চলতি ক্যাপিটাল ও সাইনবোর্ড ব্র্যান্ডিং", ratio: 0.10 },
    ],
    dailyProfitRatio: 0.035,
    monthlyProfitRatio: 0.38,
    riskPercent: 26,
    reasonTemplate: (d, s) => `${d} শহরের প্রধান শপিং কমপ্লেক্সে তরুণদের গ্যাজেট কেনা ও মোবাইল দ্রুত সারানোর নির্ভরযোগ্য সেন্টারের খুব কদর।`,
    tips: [
      "মোতালেব প্লাজা থেকে সরাসরি বাল্ক আমদানিকৃত ডিসপ্লে ও গ্যাজেট আনুন।",
      "দ্রুততম সময়ে ৩০ মিনিটে স্ক্রিন রিপ্লেসমেন্ট সার্ভিস দিয়ে সুনাম অর্জন করুন।",
    ],
  },
  {
    id: "mid-food-fastfood",
    name: "মিনি ফ্যামিলি ক্যাফে, ওয়াফেল ও পিৎজা কর্নার",
    category: "food-beverage",
    minBudget: 80_000,
    maxBudget: 350_000,
    costDistribution: [
      { item: "দোকান অ্যাডভান্স ও নান্দনিক ইন্টেরিয়র লাইটিং", ratio: 0.35 },
      { item: "কমার্শিয়াল ওভেন, ডিপ ফ্রায়ার ও ওয়াফেল মেকার", ratio: 0.25 },
      { item: "প্রাথমিক চিজ, চিকেন ও বেকিং কাঁচামাল স্টক", ratio: 0.25 },
      { item: "ব্র্যান্ডেড বক্স, মেন্যু কার্ড ও ফুডপান্ডা অনবোর্ডিং", ratio: 0.15 },
    ],
    dailyProfitRatio: 0.04,
    monthlyProfitRatio: 0.42,
    riskPercent: 28,
    reasonTemplate: (d, s) => `${d} এলাকায় আধুনিক ইন্টেরিয়রের পরিচ্ছন্ন ফাস্টফুড শপগুলোতে বিকেল ও সন্ধ্যায় বন্ধুদের জমজমাট আড্ডা বসে।`,
    tips: [
      "ইনস্টাগ্রাম ও টিকটক ফ্রেন্ডলি ফটো জোন তৈরি করুন।",
      "স্থানীয় ফুড ব্লগারদের আমন্ত্রণ জানিয়ে উদ্বোধন ও পরিচিতি করান।",
    ],
  },
  {
    id: "mid-agri-poultry",
    name: "আধুনিক ব্রয়লার / সোনালী মুরগির ফার্ম ও ডিম ডিপো",
    category: "agriculture-livestock",
    minBudget: 80_000,
    maxBudget: 350_000,
    costDistribution: [
      { item: "১০০০ সোনালী/ব্রয়লার বাচ্চা ও উন্নত ফিড স্টক", ratio: 0.50 },
      { item: "শেড সংস্কার, হিটিং বাল্ব ও অটোমেটিক ফিডার", ratio: 0.25 },
      { item: "ভ্যাকসিন, মেডিসিন ও ভেটেরিনারি কেয়ার", ratio: 0.15 },
      { item: "জরুরি ব্যাকআপ ও বিদ্যুৎ জেনারেটর ফান্ড", ratio: 0.10 },
    ],
    dailyProfitRatio: 0.035,
    monthlyProfitRatio: 0.36,
    riskPercent: 25,
    reasonTemplate: (d, s) => `${d} জেলায় স্থানীয় হাট-বাজার ও রেস্তোরাঁগুলোতে প্রতিদিন বিপুল পরিমাণ মুরগি ও ডিমের নগদ কেনাবেচা হয়।`,
    tips: [
      "সময়মতো নির্ধারিত শিডিউলে ভ্যাকসিন দিলে রোগের ঝুঁকি প্রায় শূন্যে নামে।",
      "সরাসরি পাইকারি আড়তদারদের সঙ্গে চুক্তিবদ্ধ হয়ে বিক্রি নিশ্চিত করুন।",
    ],
  },
  {
    id: "mid-pharmacy-health",
    name: "মডেল মেডিসিন কর্নার ও হেলথকেয়ার প্রোডাক্টস শপ",
    category: "pharmacy-health",
    minBudget: 100_000,
    maxBudget: 400_000,
    costDistribution: [
      { item: "শীর্ষ ফার্মাসিউটিক্যালস কোম্পানির জীবনরক্ষাকারী ঔষধ স্টক", ratio: 0.55 },
      { item: "দোকান পজিশন, কাঁচের র‍্যাক ও এসি সেটআপ", ratio: 0.25 },
      { item: "ড্রাগ লাইসেন্স, ফার্মাসিস্ট অনবোর্ডিং ও সফটওয়্যার", ratio: 0.10 },
      { item: "ডায়াবেটিস কিট, প্রেসার মিটার ও বেবি ফুড স্টক", ratio: 0.10 },
    ],
    dailyProfitRatio: 0.03,
    monthlyProfitRatio: 0.32,
    riskPercent: 15,
    reasonTemplate: (d, s) => `${d} এলাকায় আবাসিক ঘনবসতি বা ক্লিনিকের কাছাকাছি ২৪/৭ নির্ভরযোগ্য ফার্মেসির চাহিদা সবসময় সুনিশ্চিত।`,
    tips: [
      "কম্পিউটারাইজড ইনভয়েসিং ও মেয়াদোত্তীর্ণ ঔষধ ম্যানেজমেন্ট সফটওয়্যার রাখুন।",
      "নিয়মিত প্রেসার ও সুগার টেস্ট সুবিধা বিনামূল্যে দিলে পাড়ার কাস্টমার বাড়ে।",
    ],
  },
  {
    id: "mid-clothing-menswear",
    name: "রেডিমেড মেন্সওয়্যার, পাঞ্জাবি ও ফরমাল শার্ট শোরুম",
    category: "clothing",
    minBudget: 80_000,
    maxBudget: 350_000,
    costDistribution: [
      { item: "নারায়ণগঞ্জ ও সদরঘাট থেকে প্রিমিয়াম শার্ট ও পাঞ্জাবি লট", ratio: 0.50 },
      { item: "দোকান অ্যাডভান্স ও ইন্টেরিয়র হ্যাঙ্গিং ডেকোরেশন", ratio: 0.30 },
      { item: "ট্রায়াল রুম, ফিটিংস মেশিন ও ব্র্যান্ডিং", ratio: 0.10 },
      { item: "চলতি মূলধন ও ফেস্টিভ্যাল ক্যাম্পেইন", ratio: 0.10 },
    ],
    dailyProfitRatio: 0.035,
    monthlyProfitRatio: 0.38,
    riskPercent: 25,
    reasonTemplate: (d, s) => `${d} শহরের চাকরিজীবী ও তরুণদের মধ্যে রেডিমেড ফরমাল ও ক্যাজুয়াল পোশাকের নিয়মিত বাজার রয়েছে।`,
    tips: [
      "ঈদ, পূজা ও বিয়ের মৌসুমে বিশেষ কালেকশন ডিসপ্লে করুন।",
      "ফ্রি অলটারেশন ও সাইজ এডজাস্টমেন্ট সুবিধা দিন।",
    ],
  },

  // --- TIER 4: High Budget (2,50,001 - 10,00,000) ---
  {
    id: "high-clothing-wholesale",
    name: "পাইকারি গার্মেন্টস ও কাস্টম বুটিক ডিস্ট্রিবিউশন শোরুম",
    category: "clothing",
    minBudget: 250_000,
    maxBudget: 1_200_000,
    costDistribution: [
      { item: "নারায়ণগঞ্জ ও গাজীপুর কারখানা থেকে সরাসরি পোশাক উৎপাদন ও স্টক", ratio: 0.50 },
      { item: "প্রাইম লোকেশনে শোরুম সিকিউরিটি ডিপোজিট ও সেন্ট্রাল এসি", ratio: 0.25 },
      { item: "আধুনিক ইন্টেরিয়র, ব্র্যান্ডিং ও কম্পিউটারাইজড ইনভেন্টরি", ratio: 0.15 },
      { item: "রিজিওনাল ডিলার নেটওয়ার্ক তৈরি ও বিজ্ঞাপন", ratio: 0.10 },
    ],
    dailyProfitRatio: 0.025,
    monthlyProfitRatio: 0.28,
    riskPercent: 28,
    reasonTemplate: (d, s) => `${d} জেলা উত্তর ও দক্ষিণবঙ্গের সংযোগস্থলে হওয়ায় আশপাশের উপজেলাগুলোর খুচরা ব্যবসায়ীরা এখান থেকে পাইকারি সংগ্রহ করতে পারবেন।`,
    tips: [
      "উপজেলা পর্যায়ের ২০০+ ছোট কাপড়ের দোকানের সাথে সাপ্লাই চুক্তি করুন।",
      "সিজনাল ট্রেন্ড অনুযায়ী নিজস্ব ডিজাইনের পোশাক উৎপাদন করে মার্জিন বাড়ান।",
    ],
  },
  {
    id: "high-food-restaurant",
    name: "আধুনিক রুফটপ ফ্যামিলি ডাইন রেস্তোরাঁ ও লাইভ কিচেন",
    category: "food-beverage",
    minBudget: 300_000,
    maxBudget: 1_500_000,
    costDistribution: [
      { item: "কমার্শিয়াল কিচেন সেটআপ (চুলো, ওভেন, চিলার, চিমনি)", ratio: 0.30 },
      { item: "রুফটপ নান্দনিক সিটিং জোন, গ্রিনারি ও আলোকসজ্জা", ratio: 0.30 },
      { item: "প্রিমিয়াম ক্রকারি, সাউন্ড সিস্টেম ও পিওএস সফটওয়্যার", ratio: 0.15 },
      { item: "দোকান পজিশন ও ৩ মাসের কাঁচামাল/স্টাফ রিজার্ভ", ratio: 0.25 },
    ],
    dailyProfitRatio: 0.028,
    monthlyProfitRatio: 0.30,
    riskPercent: 30,
    reasonTemplate: (d, s) => `${d} শহরে পরিবার ও বন্ধুবান্ধব নিয়ে মানসম্মত প্রিমিয়াম পরিবেশে ডাইনিং করার মতো স্পেসের প্রচুর চাহিদা রয়েছে।`,
    tips: [
      "শেফের সিগনেচার ডিশ তৈরি করুন যা অন্য কোথাও পাওয়া যায় না।",
      "জন্মদিন ও কর্পোরেট পার্টির প্যাকেজ অফার করে বড় বুকিং নিশ্চিত করুন।",
    ],
  },
  {
    id: "high-agri-dairy",
    name: "উন্নত জাতের ডেইরি ফার্ম ও পাস্তুরিত তরল দুধ সাপ্লাই প্রকল্প",
    category: "agriculture-livestock",
    minBudget: 300_000,
    maxBudget: 1_500_000,
    costDistribution: [
      { item: "৫-৮টি উচ্চ উৎপাদনশীল উন্নত জাতের ফ্রিজিয়ান গাভী ক্রয়", ratio: 0.50 },
      { item: "আধুনিক শেড নির্মাণ, ফ্যান-কুলিং ও মিল্কিং মেশিন", ratio: 0.25 },
      { item: "নেপিয়ার ঘাস চাষের জমি লিজ ও সাইলেজ/ফিড খাদ্য", ratio: 0.15 },
      { item: "ভেটেরিনারি কেয়ার, চিলিং ভ্যাট ও বোতলজাতকরণ", ratio: 0.10 },
    ],
    dailyProfitRatio: 0.022,
    monthlyProfitRatio: 0.25,
    riskPercent: 22,
    reasonTemplate: (d, s) => `${d} অঞ্চলে খাঁটি তরল দুধ ও মিষ্টির কারখানায় প্রতিদিন হাজার হাজার লিটার দুধের অবিরাম চাহিদা রয়েছে।`,
    tips: [
      "বাসাবাড়িতে সরাসরি মাসিক সাবস্ক্রিপশনে কাঁচের বোতলে দুধ হোম ডেলিভারি দিন।",
      "গোবর থেকে বায়োগ্যাস তৈরি করে ফার্মের নিজস্ব বিদ্যুৎ ও রান্নার খরচ বাঁচান।",
    ],
  },
  {
    id: "high-electronics-appliance",
    name: "হোম অ্যাপ্লায়েন্স, এলইডি টিভি ও রেফ্রিজারেটর শোরুম",
    category: "electronics",
    minBudget: 350_000,
    maxBudget: 1_800_000,
    costDistribution: [
      { item: "শীর্ষ ব্র্যান্ডের ফ্রিজ, ওয়াশিং মেশিন, টিভি ও এসি ইনভেন্টরি", ratio: 0.55 },
      { item: "শোরুম অ্যাডভান্স ও প্রিমিয়াম ডিসপ্লে ইন্টেরিয়র", ratio: 0.25 },
      { item: "ক্যাশ সিকিউরিটি ও ব্র্যান্ড অথরাইজেশন ডিপোজিট", ratio: 0.10 },
      { item: "লোকাল মার্কেটিং ও ইএমআই ফ্যাসিলিটি ব্যাকআপ", ratio: 0.10 },
    ],
    dailyProfitRatio: 0.022,
    monthlyProfitRatio: 0.24,
    riskPercent: 26,
    reasonTemplate: (d, s) => `${d} জেলায় মধ্যবিত্ত পরিবারের সংখ্যা বৃদ্ধির সঙ্গে গৃহস্থালি ইলেকট্রনিক্স সামগ্রীর কিস্তি ও নগদ বিক্রির প্রসার ঘটছে।`,
    tips: [
      "সহজ কিস্তিতে বিক্রির সুবিধা দিলে বিক্রয় ভলিউম প্রায় তিনগুণ বাড়ে।",
      "ফ্রি হোম ডেলিভারি ও দ্রুত ইন্সটলেশন সার্ভিস নিশ্চিত করুন।",
    ],
  },

  // --- TIER 5: Mega / Ultra-High Budget (10,00,001 - 1,00,00,000+) ---
  {
    id: "mega-agri-rice-mill",
    name: "অটোমেটেড রাইস মিল ও দানাদার খাদ্য প্রক্রিয়াজাতকরণ প্ল্যান্ট",
    category: "agriculture-livestock",
    minBudget: 1_000_000,
    maxBudget: 10_000_000,
    costDistribution: [
      { item: "সেমি-অটোমেটেড ড্রায়ার, বয়লার ও কালার সর্টার মেশিনারি", ratio: 0.40 },
      { item: "সরাসরি কৃষক থেকে মৌসুমী ধান ও শস্যের বাল্ক সংগ্রহ", ratio: 0.35 },
      { item: "ফ্যাক্টরি শেড, সাইলো স্টোরেজ ও থ্রি-ফেজ বিদ্যুৎ সংযোগ", ratio: 0.15 },
      { item: "নিজস্ব ব্র্যান্ডেড বস্তা প্যাকেজিং ও ট্রাক লজিস্টিকস", ratio: 0.10 },
    ],
    dailyProfitRatio: 0.018,
    monthlyProfitRatio: 0.20,
    riskPercent: 24,
    reasonTemplate: (d, s) => `${d} এবং আশপাশের সমৃদ্ধ শস্য অঞ্চল থেকে কাঁচামাল সংগ্রহ করে রাজধানীসহ দেশব্যাপী ব্র্যান্ডেড প্যাকেট চাল সরবরাহ করা সম্ভব।`,
    tips: [
      "মৌসুমের সময় সরাসরি মাঠ থেকে ধান কিনলে উৎপাদন খরচ সর্বনিম্ন থাকে।",
      "রাইস ব্র্যান (কুঁড়া) থেকে তেল তৈরির কারখানায় উপজাত বিক্রি করে বাড়তি আয় করুন।",
    ],
  },
  {
    id: "mega-services-fmcg-dist",
    name: "মাল্টিন্যাশনাল এফএমসিজি সুপার ডিলারশিপ ও রিজিওনাল হাব",
    category: "services",
    minBudget: 1_000_000,
    maxBudget: 10_000_000,
    costDistribution: [
      { item: "শীর্ষ কনজিউমার ব্র্যান্ডের ডিস্ট্রিবিউটরশিপ ডিপোজিট ও স্টক", ratio: 0.55 },
      { item: "কভার্ড ভ্যান ও ডেলিভারি ফ্লিট ক্রয়/লিজ", ratio: 0.20 },
      { item: "আধুনিক সেন্ট্রাল ওয়্যারহাউজ স্পেস ও র‍্যাকিং", ratio: 0.15 },
      { item: "সেলস রিপ্রেজেন্টেটিভ টিম ও ইআরপি সফটওয়্যার", ratio: 0.10 },
    ],
    dailyProfitRatio: 0.016,
    monthlyProfitRatio: 0.18,
    riskPercent: 18,
    reasonTemplate: (d, s) => `${d} জেলা শহরের ১০০০+ মুদি ও কনফেকশনারি দোকানে প্রতিদিন নিত্যপ্রয়োজনীয় ব্র্যন্ডের পণ্যের সাপ্লাই প্রয়োজন।`,
    tips: [
      "নির্ধারিত রুট প্ল্যান অনুযায়ী সপ্তাহের নির্দিষ্ট দিনে সময়মতো সাপ্লাই দিন।",
      "দোকানদারদের সঙ্গে সুসম্পর্ক ও ক্রেডিট রিকভারি কঠোর নিয়মে পরিচালনা করুন।",
    ],
  },
  {
    id: "mega-food-bakery-plant",
    name: "অটোমেটেড বিস্কুট, কেক ও ড্রাই-ফুড প্রসেসিং কারখানা",
    category: "food-beverage",
    minBudget: 1_000_000,
    maxBudget: 10_000_000,
    costDistribution: [
      { item: "রোটারি রেক ওভেন, ডো মিক্সার ও অটোমেটেড ফ্লো প্যাক মেশিন", ratio: 0.40 },
      { item: "বাল্ক ময়দা, চিনি, ডালডা ও প্যাকেজিং ম্যাটেরিয়াল ইনভেন্টরি", ratio: 0.30 },
      { item: "বিএসটিআই অনুমোদন, ল্যাব টেস্ট ও ফ্যাক্টরি প্রিমিয়াস", ratio: 0.15 },
      { item: "মার্কেট ডিস্ট্রিবিউশন চ্যানেল ও মার্কেটিং ফ্লিট", ratio: 0.15 },
    ],
    dailyProfitRatio: 0.02,
    monthlyProfitRatio: 0.22,
    riskPercent: 26,
    reasonTemplate: (d, s) => `${d} জেলাসহ সংলগ্ন ৩-৪টি জেলায় প্রিমিয়াম ড্রাই কেক, বিস্কুট ও টোস্টের পাইকারি সরবরাহ করে শক্তিশালী ব্র্যান্ড গড়ে তোলা যায়।`,
    tips: [
      "বিএসটিআই মান নিশ্চিত করে হাইজিন বজায় রাখলে বাজারে দ্রুত সুনাম ছড়াবে।",
      "স্কুল-কলেজ ক্যান্টিন ও টি-স্টলগুলোতে নিজস্ব সেলস ভ্যানে ডেলিভারি দিন।",
    ],
  },
  {
    id: "mega-clothing-garments-unit",
    name: "এক্সপোর্ট কোয়ালিটি ওভেন ও নিটওয়্যার ম্যানুফ্যাকচারিং ইউনিট",
    category: "clothing",
    minBudget: 1_200_000,
    maxBudget: 10_000_000,
    costDistribution: [
      { item: "৫০+ আধুনিক ইন্ডাস্ট্রিয়াল সেলাই ও ওভারলক মেশিনারি", ratio: 0.35 },
      { item: "বাল্ক সুতা, ডেনিম ও কটন ফেব্রিক কাঁচামাল ক্রয়", ratio: 0.35 },
      { item: "ফ্যাক্টরি ফ্লোর লিজ, বয়লার ও বিদ্যুৎ ব্যাকআপ জেনারেটর", ratio: 0.15 },
      { item: "দক্ষ কারিগর বেতন রিজার্ভ ও কোয়ালিটি কন্ট্রোল ল্যাব", ratio: 0.15 },
    ],
    dailyProfitRatio: 0.02,
    monthlyProfitRatio: 0.22,
    riskPercent: 28,
    reasonTemplate: (d, s) => `${d} জেলায় দক্ষ শ্রমশক্তি সহজে পাওয়া যায় এবং তৈরি পোশাকের দেশীয় ও আন্তর্জাতিক বড় বাজার রয়েছে।`,
    tips: [
      "বড় কর্পোরেট ও রিটেইল ব্র্যান্ডগুলোর থেকে নিয়মিত সাবকন্ট্রাক্ট অর্ডার নিন।",
      "জিরো-ডিফেক্ট কোয়ালিটি নিশ্চিত করে দীর্ঘমেয়াদী বায়ার ধরে রাখুন।",
    ],
  },
];

export function generateSmartAdvisorSuggestions(req: AdvisorRequest): AdvisorResponse {
  const budget = Math.max(1_000, Number(req.budget) || 50_000);
  const district = req.district && req.district !== "all" ? req.district : (req.division && req.division !== "all" ? req.division : "ঢাকা");
  const districtInfo = getDistrictInfo(district);
  const categoryFilter = req.category && req.category !== "all" ? req.category : null;

  // 1. Filter templates by category if specified, or pick diverse
  let candidates = BUSINESS_TEMPLATES.filter((tpl) => {
    if (categoryFilter && tpl.category !== categoryFilter) return false;
    return true;
  });

  // If no category match found, fallback to all templates
  if (candidates.length === 0) {
    candidates = [...BUSINESS_TEMPLATES];
  }

  // 2. Score templates by budget proximity
  // Prefer templates whose [minBudget, maxBudget] range encompasses or is close to target budget
  candidates.sort((a, b) => {
    const inRangeA = budget >= a.minBudget && budget <= a.maxBudget ? 0 : 1;
    const inRangeB = budget >= b.minBudget && budget <= b.maxBudget ? 0 : 1;
    if (inRangeA !== inRangeB) return inRangeA - inRangeB;

    const midA = (a.minBudget + a.maxBudget) / 2;
    const midB = (b.minBudget + b.maxBudget) / 2;
    return Math.abs(budget - midA) - Math.abs(budget - midB);
  });

  // 3. Take top 2-3 distinct ideas
  const selectedTemplates = candidates.slice(0, 3);
  if (selectedTemplates.length === 1 && candidates.length > 1) {
    selectedTemplates.push(candidates[1]);
  }

  // 4. Adapt each template proportionally to the EXACT user budget
  const suggestions: AdvisorSuggestion[] = selectedTemplates.map((tpl, idx) => {
    // Generate precise cost breakdown summing up to exact budget
    let accumulated = 0;
    const breakdown = tpl.costDistribution.map((dist, dIdx) => {
      const isLast = dIdx === tpl.costDistribution.length - 1;
      let amount = Math.round(budget * dist.ratio);
      if (isLast) {
        amount = Math.max(100, budget - accumulated);
      } else {
        accumulated += amount;
      }
      return {
        item: dist.item,
        amount: Math.max(100, amount),
      };
    });

    const totalCost = breakdown.reduce((sum, item) => sum + item.amount, 0);

    // Dynamic daily & monthly profits with realistic margins
    const profitDaily = Math.max(100, Math.round(budget * tpl.dailyProfitRatio * (1 + (idx * 0.05))));
    const profitMonthly = Math.max(1500, Math.round(budget * tpl.monthlyProfitRatio * (1 + (idx * 0.04))));

    const reason = tpl.reasonTemplate(district, districtInfo.specialty);

    const tipsWithSourcing = [
      ...tpl.tips,
      `সোর্সিং পরামর্শ: ${districtInfo.sourcingHub} থেকে সরাসরি যাচাই করে মালামাল সংগ্রহ করুন।`,
    ];

    return {
      id: `adv-${tpl.id}-${idx + 1}-${Date.now()}`,
      name: tpl.name,
      category: tpl.category,
      costBreakdown: breakdown,
      totalCost,
      profitDaily,
      profitMonthly,
      riskPercent: tpl.riskPercent,
      reason,
      tips: tipsWithSourcing,
    };
  });

  return { suggestions };
}

