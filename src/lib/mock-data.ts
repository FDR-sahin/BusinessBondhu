import type {
  AnalysisData,
  AdvisorResponse,
  BlogPost,
  BlogPostDetail,
  Comment,
  DashboardComment,
  DashboardOverview,
  DistrictStat,
  MyPost,
  MyPostDetail,
  Paginated,
  Post,
  PostDetail,
  AppNotification,
} from "@/types";

export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    title: "গাজীপুরে পরিবেশবান্ধব কাগজের কাপ তৈরির লাভজনক ব্যবসা",
    category: "food-beverage",
    division: "Dhaka",
    district: "Gazipur",
    area: "কৌলতিয়া",
    wholesalePrice: 0.65,
    retailPrice: 1.2,
    retailSellPrice: 1.5,
    profitPotential: "high",
    author: {
      id: "u-1",
      name: "মহসিন হোসেন",
    },
    likesCount: 142,
    dislikesCount: 3,
    commentsCount: 28,
    viewsCount: 1850,
    createdAt: "2026-10-01T10:30:00Z",
  },
  {
    id: "post-2",
    title: "বগুড়ার বিখ্যাত দই ও দুগ্ধজাত সামগ্রীর অনলাইন রিটেইল",
    category: "food-beverage",
    division: "Rajshahi",
    district: "Bogura",
    area: "শেরপুর",
    wholesalePrice: 180,
    retailPrice: 260,
    retailSellPrice: 280,
    profitPotential: "high",
    author: {
      id: "u-2",
      name: "তানভীর আহমেদ",
    },
    likesCount: 215,
    dislikesCount: 5,
    commentsCount: 42,
    viewsCount: 3100,
    createdAt: "2026-10-02T14:15:00Z",
  },
  {
    id: "post-3",
    title: "চট্টগ্রামে অর্গানিক ড্রাই ফিশ (শুঁটকি) প্যাকেজিং ও ব্র্যান্ডিং",
    category: "food-beverage",
    division: "Chattogram",
    district: "Chattogram",
    area: "আছাদগঞ্জ",
    wholesalePrice: 450,
    retailPrice: 750,
    retailSellPrice: 850,
    profitPotential: "medium",
    author: {
      id: "u-3",
      name: "নাজমুন নাহার",
    },
    likesCount: 98,
    dislikesCount: 2,
    commentsCount: 19,
    viewsCount: 1420,
    createdAt: "2026-10-03T09:00:00Z",
  },
  {
    id: "post-4",
    title: "নারায়ণগঞ্জে হোসিয়ারি ও রেডিমেড টি-শার্ট পাইকারি সরবরাহ",
    category: "clothing",
    division: "Dhaka",
    district: "Narayanganj",
    area: "নয়নপুর",
    wholesalePrice: 110,
    retailPrice: 220,
    retailSellPrice: 250,
    profitPotential: "high",
    author: {
      id: "u-4",
      name: "আরিফ হাসান",
    },
    likesCount: 310,
    dislikesCount: 8,
    commentsCount: 65,
    viewsCount: 4200,
    createdAt: "2026-10-04T11:45:00Z",
  },
  {
    id: "post-5",
    title: "যশোরে নার্সারি ও হাইব্রিড ফলের চারা উৎপাদন ব্যবসা",
    category: "agriculture-livestock",
    division: "Khulna",
    district: "Jashore",
    area: "ঝিকরগাছা",
    wholesalePrice: 35,
    retailPrice: 90,
    retailSellPrice: 110,
    profitPotential: "medium",
    author: {
      id: "u-5",
      name: "সাদিয়া রহমান",
    },
    likesCount: 176,
    dislikesCount: 1,
    commentsCount: 31,
    viewsCount: 2100,
    createdAt: "2026-10-05T08:20:00Z",
  },
  {
    id: "post-6",
    title: "সিলেটে অর্গানিক গ্রিন টি ও ভেষজ চায়ের স্মল-স্কেল প্যাকেজিং",
    category: "food-beverage",
    division: "Sylhet",
    district: "Sylhet",
    area: "শ্রীমঙ্গল রোড",
    wholesalePrice: 120,
    retailPrice: 240,
    retailSellPrice: 270,
    profitPotential: "high",
    author: {
      id: "u-6",
      name: "কামরুল ইসলাম",
    },
    likesCount: 189,
    dislikesCount: 4,
    commentsCount: 22,
    viewsCount: 2350,
    createdAt: "2026-10-05T16:10:00Z",
  },
  {
    id: "post-7",
    title: "ঢাকার প্রাণকেন্দ্রে মোবাইল রিপ্রেয়ারিং ও এক্সেসরিজ পয়েন্ট",
    category: "electronics",
    division: "Dhaka",
    district: "Dhaka",
    area: "মোতালেব প্লাজা, হাতিরপুল",
    wholesalePrice: 40,
    retailPrice: 150,
    retailSellPrice: 180,
    profitPotential: "medium",
    author: {
      id: "u-7",
      name: "রাশেদুল করিম",
    },
    likesCount: 260,
    dislikesCount: 6,
    commentsCount: 49,
    viewsCount: 3800,
    createdAt: "2026-10-06T12:00:00Z",
  },
  {
    id: "post-8",
    title: "রংপুরে হোমমেড ভেষজ রূপচর্চা সামগ্রী ও স্কিনকেয়ার ব্র্যান্ড",
    category: "cosmetics",
    division: "Rangpur",
    district: "Rangpur",
    area: "ধাপ",
    wholesalePrice: 150,
    retailPrice: 350,
    retailSellPrice: 390,
    profitPotential: "high",
    author: {
      id: "u-8",
      name: "ফারজানা ইয়াসমিন",
    },
    likesCount: 145,
    dislikesCount: 2,
    commentsCount: 27,
    viewsCount: 1950,
    createdAt: "2026-10-06T15:30:00Z",
  },
];

export const MOCK_TOP_DISTRICTS: DistrictStat[] = [
  { district: "Dhaka", division: "Dhaka", count: 184 },
  { district: "Chattogram", division: "Chattogram", count: 122 },
  { district: "Bogura", division: "Rajshahi", count: 95 },
  { district: "Narayanganj", division: "Dhaka", count: 88 },
  { district: "Gazipur", division: "Dhaka", count: 81 },
  { district: "Jashore", division: "Khulna", count: 74 },
  { district: "Sylhet", division: "Sylhet", count: 69 },
  { district: "Rangpur", division: "Rangpur", count: 62 },
  { district: "Cumilla", division: "Chattogram", count: 58 },
  { district: "Barishal", division: "Barishal", count: 45 },
  { district: "Mymensingh", division: "Mymensingh", count: 41 },
  { district: "Pabna", division: "Rajshahi", count: 39 },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "small-business-registration-bangladesh",
    title: "বাংলাদেশে ক্ষুদ্র ব্যবসার ট্রেড লাইসেন্স ও ই-টিন নেওয়ার সহজ গাইড",
    excerpt: "আইনি জটিলতা এড়িয়ে মাত্র ৩ দিনে ইউনিয়ন পরিষদ বা সিটি কর্পোরেশন থেকে ট্রেড লাইসেন্স সংগ্রহের ধাপসমূহ।",
    category: "govt-benefits",
    author: { id: "u-admin", name: "কমিউনিটি অ্যাডমিন" },
    publishedAt: "2026-09-28T09:00:00Z",
    readingTime: 4,
  },
  {
    id: "blog-2",
    slug: "wholesale-market-sourcing-dhaka",
    title: "ঢাকার চকবাজার ও ইসলামপুরের পাইকারি বাজার থেকে পণ্য কেনার সিক্রেট টিপস",
    excerpt: "সঠিক কোয়ালিটি চেনা, দাম কমানো এবং ধোঁকাবাজি থেকে বাঁচার বাস্তব অভিজ্ঞতা।",
    category: "wholesale-markets",
    author: { id: "u-1", name: "মহসিন হোসেন" },
    publishedAt: "2026-10-01T11:20:00Z",
    readingTime: 6,
  },
  {
    id: "blog-3",
    slug: "facebook-f-commerce-growth-hacks",
    title: "কম খরচে এফ-কমার্স ব্যবসা বাড়ানোর ৫টি পরীক্ষিত মেথড",
    excerpt: "অর্গানিক রিচ বাড়ানো, কাস্টমার ট্রাস্ট গঠন এবং দ্রুত ডেলিভারি নিশ্চিত করার কৌশল।",
    category: "success-stories",
    author: { id: "u-2", name: "তানভীর আহমেদ" },
    publishedAt: "2026-10-03T14:40:00Z",
    readingTime: 5,
  },
];

export const MOCK_ANALYSIS_DATA: AnalysisData = {
  totals: { posts: 850, users: 3420, comments: 4190, districts: 64 },
  postsByDivision: [
    { division: "Dhaka", count: 320 },
    { division: "Chattogram", count: 180 },
    { division: "Rajshahi", count: 110 },
    { division: "Khulna", count: 85 },
    { division: "Sylhet", count: 55 },
    { division: "Rangpur", count: 45 },
    { division: "Barishal", count: 35 },
    { division: "Mymensingh", count: 20 },
  ],
  postsByCategory: [
    { category: "food-beverage", count: 260 },
    { category: "clothing", count: 210 },
    { category: "services", count: 120 },
    { category: "electronics", count: 95 },
    { category: "agriculture-livestock", count: 80 },
    { category: "cosmetics", count: 50 },
    { category: "pharmacy-health", count: 35 },
  ],
  growth: [
    { month: "2026-05", posts: 65 },
    { month: "2026-06", posts: 98 },
    { month: "2026-07", posts: 140 },
    { month: "2026-08", posts: 185 },
    { month: "2026-09", posts: 240 },
    { month: "2026-10", posts: 310 },
  ],
  topDistricts: MOCK_TOP_DISTRICTS,
  topContributors: [
    { id: "u-4", name: "আরিফ হাসান", postCount: 24 },
    { id: "u-2", name: "তানভীর আহমেদ", postCount: 18 },
    { id: "u-1", name: "মহসিন হোসেন", postCount: 15 },
  ],
  priceTrends: [
    { month: "2026-05", avgWholesale: 120, avgRetail: 210 },
    { month: "2026-06", avgWholesale: 125, avgRetail: 220 },
    { month: "2026-07", avgWholesale: 130, avgRetail: 235 },
    { month: "2026-08", avgWholesale: 128, avgRetail: 240 },
    { month: "2026-09", avgWholesale: 135, avgRetail: 250 },
    { month: "2026-10", avgWholesale: 138, avgRetail: 260 },
  ],
};

export const MOCK_DASHBOARD_OVERVIEW: DashboardOverview = {
  totals: { posts: 12, likes: 348, views: 4250, comments: 86 },
  weeklyLikes: [
    { date: "2026-10-01", likes: 24 },
    { date: "2026-10-02", likes: 38 },
    { date: "2026-10-03", likes: 45 },
    { date: "2026-10-04", likes: 62 },
    { date: "2026-10-05", likes: 55 },
    { date: "2026-10-06", likes: 70 },
    { date: "2026-10-07", likes: 54 },
  ],
  postsByCategory: [
    { category: "food-beverage", count: 6 },
    { category: "clothing", count: 4 },
    { category: "electronics", count: 2 },
  ],
  activity: [
    {
      id: "act-1",
      type: "like",
      actor: { name: "সাদিয়া রহমান" },
      postId: "post-1",
      postTitle: "গাজীপুরে পরিবেশবান্ধব কাগজের কাপ তৈরির লাভজনক ব্যবসা",
      createdAt: "2026-10-07T14:20:00Z",
    },
    {
      id: "act-2",
      type: "comment",
      actor: { name: "তানভীর আহমেদ" },
      postId: "post-1",
      postTitle: "গাজীপুরে পরিবেশবান্ধব কাগজের কাপ তৈরির লাভজনক ব্যবসা",
      message: "মেশিনটি কোথা থেকে কিনেছেন জানালে উপকৃত হতাম।",
      createdAt: "2026-10-07T12:00:00Z",
    },
    {
      id: "act-3",
      type: "post_approved",
      postId: "post-4",
      postTitle: "নারায়ণগঞ্জে হোসিয়ারি ও রেডিমেড টি-শার্ট পাইকারি সরবরাহ",
      createdAt: "2026-10-06T18:00:00Z",
    },
  ],
};

export function getMockPaginatedPosts(params: any = {}): Paginated<Post> {
  let items = [...MOCK_POSTS];
  if (params.category) {
    items = items.filter((p) => p.category === params.category);
  }
  if (params.division) {
    items = items.filter((p) => p.division.toLowerCase() === params.division.toLowerCase());
  }
  if (params.district) {
    items = items.filter((p) => p.district.toLowerCase() === params.district.toLowerCase());
  }
  if (params.q) {
    const query = params.q.toLowerCase();
    items = items.filter(
      (p) => p.title.toLowerCase().includes(query) || p.district.toLowerCase().includes(query)
    );
  }

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 8;
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const paginatedItems = items.slice(start, start + limit);

  return {
    items: paginatedItems,
    total,
    page,
    limit,
    totalPages,
  };
}

export function getMockPostDetail(id: string): PostDetail {
  const base = MOCK_POSTS.find((p) => p.id === id) || MOCK_POSTS[0];
  return {
    ...base,
    description: `এই ব্যবসাটি শুরু করার জন্য প্রাথমিক বিনিয়োগের প্রয়োজন তুলনামূলক কম। এলাকায় প্রচুর চাহিদা রয়েছে। আধুনিক প্রযুক্তির সঠিক ব্যবহারে পাইকারি খরচে পণ্য উৎপাদন করে খুচরা বাজারে ভালো লাভে বিক্রি করা সম্ভব। বিস্তারিত তথ্যের জন্য মন্তব্যে প্রশ্ন করতে পারেন।`,
    tags: ["ব্যবসা", "উদ্যোক্তা", "পাইকারি_দাম", "বাংলাদেশ"],
  };
}

export function getMockComments(postId: string): Comment[] {
  return [
    {
      id: "c-1",
      postId,
      author: {
        id: "u-2",
        name: "তানভীর আহমেদ",
      },
      content: "খুবই দরকারী তথ্য শেয়ার করার জন্য ধন্যবাদ! কাঁচামাল সরবরাহের ঠিকানা থাকলে শেয়ার করবেন দয়া করে।",
      createdAt: "2026-10-06T14:30:00Z",
      likesCount: 12,
      likedByMe: false,
      replies: [
        {
          id: "c-1-1",
          postId,
          parentId: "c-1",
          author: {
            id: "u-1",
            name: "মহসিন হোসেন (লেখক)",
          },
          content: "ইনবক্সে কন্টাক্ট নম্বর পাঠিয়েছি ভাই, দেখে নিন।",
          createdAt: "2026-10-06T15:10:00Z",
          likesCount: 5,
        },
      ],
    },
    {
      id: "c-2",
      postId,
      author: {
        id: "u-3",
        name: "নাজমুন নাহার",
      },
      content: "ঢাকার বাইরে ডেলিভারি পাওয়ার ব্যবস্থা আছে কি?",
      createdAt: "2026-10-07T09:15:00Z",
      likesCount: 4,
    },
  ];
}

export function getMockAdvisorSuggestions(budget: number, category?: string): AdvisorResponse {
  return {
    suggestions: [
      {
        id: "adv-1",
        name: "অনলাইন স্ন্যাকস ও ফ্রোজেন ফুড হোম ডেলিভারি",
        category: category || "food-beverage",
        costBreakdown: [
          { item: "কাঁচামাল ও প্যাকেজিং", amount: Math.round(budget * 0.45) },
          { item: "মার্কেটিং ও অনলাইন পেজ প্রমোট", amount: Math.round(budget * 0.25) },
          { item: "ডেলিভারি সার্ভিস ও জরুরি ফান্ড", amount: Math.round(budget * 0.3) },
        ],
        totalCost: budget,
        profitDaily: Math.round(budget * 0.04),
        profitMonthly: Math.round(budget * 0.35),
        riskPercent: 22,
        reason: "আপনার নির্বাচিত এলাকায় স্বল্প বাজেটে ঘরে তৈরি ফ্রোজেন খাবারের অনলাইন চাহিদা দ্রুত বাড়ছে।",
        tips: [
          "ফেসবুক ও স্থানীয় হোয়াটসঅ্যাপ গ্রুপে প্রচারণা শুরু করুন।",
          "প্রথম ১০০ জন কাস্টমারকে ফ্রি স্যাম্পল বা বিশেষ ছাড় দিন।",
          "প্যাকেজিং পরিষ্কার ও আকর্ষণীয় রাখুন।",
        ],
      },
      {
        id: "adv-2",
        name: "রেডিমেড পোশাকের ফেসবুক ভিত্তিক পপ-আপ শপ",
        category: "clothing",
        costBreakdown: [
          { item: "পাইকারি বাজার থেকে টি-শার্ট ও ড্রেস সোর্সিং", amount: Math.round(budget * 0.6) },
          { item: "প্যাকেজিং ও স্টিকার", amount: Math.round(budget * 0.15) },
          { item: "ফেসবুক বুস্টিং ও ভিডিও রিভিউ", amount: Math.round(budget * 0.25) },
        ],
        totalCost: budget,
        profitDaily: Math.round(budget * 0.05),
        profitMonthly: Math.round(budget * 0.4),
        riskPercent: 35,
        reason: "উৎসব কেন্দ্রিক কাপড়ের চাহিদা বেশি থাকে এবং স্টক দ্রুত ক্লিয়ার হয়।",
        tips: [
          "ইসলামপুর বা নারায়ণগঞ্জের পাইকারি বাজার থেকে সরাসরি সংগ্রহ করুন।",
          "সুন্দর ছবি ও রিলস তৈরি করে সোশ্যাল মিডিয়ায় পোস্ট করুন।",
        ],
      },
    ],
  };
}
