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
    "id": "post-sheet-1",
    "title": "MILK",
    "category": "agriculture-livestock",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "Savar",
    "wholesalePrice": 65,
    "retailPrice": 100,
    "retailSellPrice": 100,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-1",
      "name": "সোর্সিং প্রতিনিধি #1"
    },
    "likesCount": 45,
    "dislikesCount": 0,
    "commentsCount": 6,
    "viewsCount": 420,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: MILK  সরাসরি সোর্সিং লোকেশন: Savar মূল সোর্সিং এলাকা / উৎপত্তি: Savaf  পাইকারি মূল্য / রেঞ্জ: ৳65 খুচরা বাজার মূল্য: ৳100 নূন্যতম অর্ডার পরিমাণ (MOQ): 50 litter তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-2",
    "title": "Coconut",
    "category": "agriculture-livestock",
    "division": "Chattogram",
    "district": "Lakshmipur",
    "area": "Division: Chattogram, District: Lakshmipur, Thana: Ramgoti",
    "wholesalePrice": 120,
    "retailPrice": 170,
    "retailSellPrice": 170,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-2",
      "name": "সোর্সিং প্রতিনিধি #2"
    },
    "likesCount": 56,
    "dislikesCount": 3,
    "commentsCount": 11,
    "viewsCount": 505,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: Coconut  সরাসরি সোর্সিং লোকেশন: Division: Chattogram, District: Lakshmipur, Thana: Ramgoti মূল সোর্সিং এলাকা / উৎপত্তি: Lakshmipur  পাইকারি মূল্য / রেঞ্জ: ৳120 খুচরা বাজার মূল্য: ৳170 নূন্যতম অর্ডার পরিমাণ (MOQ): 20 pair তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Lakshmipur",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-3",
    "title": "সুপারি",
    "category": "agriculture-livestock",
    "division": "Chattogram",
    "district": "Lakshmipur",
    "area": "Thana: Ramgoti",
    "wholesalePrice": 500,
    "retailPrice": 1000,
    "retailSellPrice": 1000,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-3",
      "name": "সোর্সিং প্রতিনিধি #3"
    },
    "likesCount": 67,
    "dislikesCount": 2,
    "commentsCount": 16,
    "viewsCount": 590,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: সুপারি  সরাসরি সোর্সিং লোকেশন: Thana: Ramgoti মূল সোর্সিং এলাকা / উৎপত্তি: Division: Chattogram, District: Lakshmipur  পাইকারি মূল্য / রেঞ্জ: ৳500 খুচরা বাজার মূল্য: ৳1000 নূন্যতম অর্ডার পরিমাণ (MOQ): ১,২৮০টি( ১ কাউন/১৬ পোন) তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Lakshmipur",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-4",
    "title": "ইলিশ মাছ",
    "category": "food-beverage",
    "division": "Barishal",
    "district": "Patuakhali",
    "area": "রনগোপালদী বাজার, দশমিনা, পটুয়াখালী",
    "wholesalePrice": 1,
    "retailPrice": 1,
    "retailSellPrice": 1,
    "profitPotential": "low",
    "author": {
      "id": "u-sheet-4",
      "name": "সোর্সিং প্রতিনিধি #4"
    },
    "likesCount": 78,
    "dislikesCount": 1,
    "commentsCount": 21,
    "viewsCount": 675,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: ইলিশ মাছ  সরাসরি সোর্সিং লোকেশন: রনগোপালদী বাজার, দশমিনা, পটুয়াখালী মূল সোর্সিং এলাকা / উৎপত্তি: তেতুলিয়া নদী  পাইকারি মূল্য / রেঞ্জ: ৳1 খুচরা বাজার মূল্য: ৳1 নূন্যতম অর্ডার পরিমাণ (MOQ): ২০ কেজি তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Patuakhali",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-5",
    "title": "থ্রি-পিস, থান কাপড় ও গজ কাপড়, শাড়ি ও লুঙ্গি",
    "category": "clothing",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "Islampur old Dhaka",
    "wholesalePrice": 450,
    "retailPrice": 750,
    "retailSellPrice": 750,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-5",
      "name": "সোর্সিং প্রতিনিধি #5"
    },
    "likesCount": 89,
    "dislikesCount": 0,
    "commentsCount": 26,
    "viewsCount": 760,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: থ্রি-পিস, থান কাপড় ও গজ কাপড়, শাড়ি ও লুঙ্গি  সরাসরি সোর্সিং লোকেশন: Islampur old Dhaka মূল সোর্সিং এলাকা / উৎপত্তি: Division: Dhaka  পাইকারি মূল্য / রেঞ্জ: ৳450 খুচরা বাজার মূল্য: ৳750 নূন্যতম অর্ডার পরিমাণ (MOQ): 4 pcs তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "clothing",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-6",
    "title": "Chawkbazar, Ladies Bag ",
    "category": "clothing",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "Chawkbazar, Old Dhaka",
    "wholesalePrice": 100,
    "retailPrice": 120,
    "retailSellPrice": 130,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-6",
      "name": "সোর্সিং প্রতিনিধি #6"
    },
    "likesCount": 100,
    "dislikesCount": 3,
    "commentsCount": 31,
    "viewsCount": 845,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: Ladies Bag  সরাসরি সোর্সিং লোকেশন: Chawkbazar, Old Dhaka মূল সোর্সিং এলাকা / উৎপত্তি: Division: Dhaka  পাইকারি মূল্য / রেঞ্জ: ৳100 খুচরা বাজার মূল্য: ৳130 নূন্যতম অর্ডার পরিমাণ (MOQ): 12 pcs তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "clothing",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-7",
    "title": "কসমেটিকস",
    "category": "cosmetics",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "চকবাজার",
    "wholesalePrice": 5,
    "retailPrice": 6,
    "retailSellPrice": 6,
    "profitPotential": "low",
    "author": {
      "id": "u-sheet-7",
      "name": "সোর্সিং প্রতিনিধি #7"
    },
    "likesCount": 111,
    "dislikesCount": 2,
    "commentsCount": 6,
    "viewsCount": 930,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: কসমেটিকস  সরাসরি সোর্সিং লোকেশন: চকবাজার মূল সোর্সিং এলাকা / উৎপত্তি: Division: Dhaka  পাইকারি মূল্য / রেঞ্জ: ৳5 খুচরা বাজার মূল্য: ৳6 নূন্যতম অর্ডার পরিমাণ (MOQ): লট বা ডজন তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "cosmetics",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-8",
    "title": "সরিষা",
    "category": "agriculture-livestock",
    "division": "Chattogram",
    "district": "Lakshmipur",
    "area": "দক্ষিণ টুমচর,চরগাজী,রামগতি, লক্ষীপুর",
    "wholesalePrice": 4000,
    "retailPrice": 3,
    "retailSellPrice": 5200,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-8",
      "name": "সোর্সিং প্রতিনিধি #8"
    },
    "likesCount": 122,
    "dislikesCount": 1,
    "commentsCount": 11,
    "viewsCount": 1015,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: সরিষা  সরাসরি সোর্সিং লোকেশন: দক্ষিণ টুমচর, চরগাজী, রামগতি, লক্ষীপুর মূল সোর্সিং এলাকা / উৎপত্তি: দক্ষিণ টুমচর  পাইকারি মূল্য / রেঞ্জ: ৳4000 খুচরা বাজার মূল্য: ৳5200 নূন্যতম অর্ডার পরিমাণ (MOQ): ২০০০মণ তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Lakshmipur",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-9",
    "title": "বঙ্গবাজার ও গুলিস্তান-এ রেডিমেড গার্মেন্টস, এক্সপোর্ট কোয়ালিটি ও স্টক লটের পোশাক পাইকারি সোর্সিং",
    "category": "clothing",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "বঙ্গবাজার ও গুলিস্তান",
    "wholesalePrice": 100,
    "retailPrice": 120,
    "retailSellPrice": 130,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-1",
      "name": "সোর্সিং প্রতিনিধি #1"
    },
    "likesCount": 133,
    "dislikesCount": 0,
    "commentsCount": 16,
    "viewsCount": 1100,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: রেডিমেড গার্মেন্টস, এক্সপোর্ট কোয়ালিটি ও স্টক লটের পোশাক  সরাসরি সোর্সিং লোকেশন: বঙ্গবাজার ও গুলিস্তান মূল সোর্সিং এলাকা / উৎপত্তি: Division: Dhaka  পাইকারি মূল্য / রেঞ্জ: ৳100 খুচরা বাজার মূল্য: ৳130 নূন্যতম অর্ডার পরিমাণ (MOQ): 12pcs তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "clothing",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-10",
    "title": "শাকসবজি ও নিত্যপ্রয়োজনীয় কৃষিপণ্য",
    "category": "agriculture-livestock",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "কারওয়ান বাজার",
    "wholesalePrice": 25,
    "retailPrice": 45,
    "retailSellPrice": 45,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-2",
      "name": "সোর্সিং প্রতিনিধি #2"
    },
    "likesCount": 144,
    "dislikesCount": 3,
    "commentsCount": 21,
    "viewsCount": 1185,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: শাকসবজি ও নিত্যপ্রয়োজনীয় কৃষিপণ্যে  সরাসরি সোর্সিং লোকেশন: কারওয়ান বাজার মূল সোর্সিং এলাকা / উৎপত্তি: Dhaka  পাইকারি মূল্য / রেঞ্জ: ৳25 খুচরা বাজার মূল্য: ৳45 নূন্যতম অর্ডার পরিমাণ (MOQ): 10 kg তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-11",
    "title": "সয়াবিন",
    "category": "agriculture-livestock",
    "division": "Chattogram",
    "district": "Lakshmipur",
    "area": "Lakshmipur",
    "wholesalePrice": 2000,
    "retailPrice": 2400,
    "retailSellPrice": 2600,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-3",
      "name": "সোর্সিং প্রতিনিধি #3"
    },
    "likesCount": 155,
    "dislikesCount": 2,
    "commentsCount": 26,
    "viewsCount": 1270,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: সয়াবিন  সরাসরি সোর্সিং লোকেশন: Lakshmipur মূল সোর্সিং এলাকা / উৎপত্তি: Division: Chattogram  পাইকারি মূল্য / রেঞ্জ: ৳2000 খুচরা বাজার মূল্য: ৳2600 নূন্যতম অর্ডার পরিমাণ (MOQ): আলোচনা সাপেক্ষে তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Lakshmipur",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-12",
    "title": "ইলিশ",
    "category": "food-beverage",
    "division": "Chattogram",
    "district": "Lakshmipur",
    "area": "Mojuchowdhuri hat, Ramgoti Mach Ghat",
    "wholesalePrice": 1100,
    "retailPrice": 1500,
    "retailSellPrice": 1500,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-4",
      "name": "সোর্সিং প্রতিনিধি #4"
    },
    "likesCount": 166,
    "dislikesCount": 1,
    "commentsCount": 31,
    "viewsCount": 1355,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: ইলিশ  সরাসরি সোর্সিং লোকেশন: Mojuchowdhuri hat, Ramgoti Mach Ghat মূল সোর্সিং এলাকা / উৎপত্তি: Lakshmipur  পাইকারি মূল্য / রেঞ্জ: ৳1100 খুচরা বাজার মূল্য: ৳1500 নূন্যতম অর্ডার পরিমাণ (MOQ): আলোচনা সাপেক্ষে তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Lakshmipur",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-13",
    "title": "ইলিশ",
    "category": "food-beverage",
    "division": "Chattogram",
    "district": "Chandpur",
    "area": "চাঁদপুর",
    "wholesalePrice": 1100,
    "retailPrice": 1500,
    "retailSellPrice": 1500,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-5",
      "name": "সোর্সিং প্রতিনিধি #5"
    },
    "likesCount": 177,
    "dislikesCount": 0,
    "commentsCount": 6,
    "viewsCount": 1440,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: ইলিশ  সরাসরি সোর্সিং লোকেশন: চাঁদপুর মূল সোর্সিং এলাকা / উৎপত্তি: Division: Chattogram  পাইকারি মূল্য / রেঞ্জ: ৳1100 খুচরা বাজার মূল্য: ৳1500 নূন্যতম অর্ডার পরিমাণ (MOQ): আলোচনা সাপেক্ষে তথ্য হালনাগাদ তারিখ: 10/7/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Chandpur",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-15",
    "title": "Chips",
    "category": "food-beverage",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "Dhaka",
    "wholesalePrice": 10,
    "retailPrice": 10,
    "retailSellPrice": 13,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-7",
      "name": "সোর্সিং প্রতিনিধি #7"
    },
    "likesCount": 49,
    "dislikesCount": 2,
    "commentsCount": 16,
    "viewsCount": 1610,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: Chips  সরাসরি সোর্সিং লোকেশন: মূল বাজার এলাকা মূল সোর্সিং এলাকা / উৎপত্তি: Dhaka  পাইকারি মূল্য / রেঞ্জ: ৳10 খুচরা বাজার মূল্য: ৳13 নূন্যতম অর্ডার পরিমাণ (MOQ): আলোচনা সাপেক্ষে তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-16",
    "title": "Orrange",
    "category": "food-beverage",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "Jatrabari",
    "wholesalePrice": 450,
    "retailPrice": 400,
    "retailSellPrice": 585,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-8",
      "name": "সোর্সিং প্রতিনিধি #8"
    },
    "likesCount": 60,
    "dislikesCount": 1,
    "commentsCount": 21,
    "viewsCount": 1695,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: Orrange  সরাসরি সোর্সিং লোকেশন: Jatrabari মূল সোর্সিং এলাকা / উৎপত্তি: Dhaka  পাইকারি মূল্য / রেঞ্জ: ৳450 খুচরা বাজার মূল্য: ৳585 নূন্যতম অর্ডার পরিমাণ (MOQ): 1/2 kg তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-17",
    "title": "গদখালী-এ ফুল",
    "category": "agriculture-livestock",
    "division": "Khulna",
    "district": "Jashore",
    "area": "গদখালী",
    "wholesalePrice": 4,
    "retailPrice": 12,
    "retailSellPrice": 12,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-1",
      "name": "সোর্সিং প্রতিনিধি #1"
    },
    "likesCount": 71,
    "dislikesCount": 0,
    "commentsCount": 26,
    "viewsCount": 1780,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: ফুল  সরাসরি সোর্সিং লোকেশন: গদখালী মূল সোর্সিং এলাকা / উৎপত্তি: যশোর  পাইকারি মূল্য / রেঞ্জ: ৳4 খুচরা বাজার মূল্য: ৳12 নূন্যতম অর্ডার পরিমাণ (MOQ): আলোচনা সাপেক্ষে তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Jashore",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-18",
    "title": "মেশিনারি, ইলেকট্রনিক্স এবং হার্ডওয়্যার",
    "category": "electronics",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "নবাবপুর রোড, স্টেডিয়াম মার্কেট ও এলিফ্যান্ট রোড",
    "wholesalePrice": 1500,
    "retailPrice": 2500,
    "retailSellPrice": 2500,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-2",
      "name": "সোর্সিং প্রতিনিধি #2"
    },
    "likesCount": 82,
    "dislikesCount": 3,
    "commentsCount": 31,
    "viewsCount": 1865,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: মেশিনারি, ইলেকট্রনিক্স এবং হার্ডওয়্যার  সরাসরি সোর্সিং লোকেশন: নবাবপুর রোড, স্টেডিয়াম মার্কেট ও এলিফ্যান্ট রোড মূল সোর্সিং এলাকা / উৎপত্তি: Dhaka  পাইকারি মূল্য / রেঞ্জ: ৳1500 খুচরা বাজার মূল্য: ৳2500 নূন্যতম অর্ডার পরিমাণ (MOQ): আলোচনা সাপেক্ষে তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "electronics",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-19",
    "title": "Noakhali-এ Speed",
    "category": "food-beverage",
    "division": "Chattogram",
    "district": "Noakhali",
    "area": "Noakhali",
    "wholesalePrice": 30,
    "retailPrice": 20,
    "retailSellPrice": 39,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-3",
      "name": "সোর্সিং প্রতিনিধি #3"
    },
    "likesCount": 93,
    "dislikesCount": 2,
    "commentsCount": 6,
    "viewsCount": 1950,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: Speed  সরাসরি সোর্সিং লোকেশন: Noakhali মূল সোর্সিং এলাকা / উৎপত্তি: ...  পাইকারি মূল্য / রেঞ্জ: ৳30 খুচরা বাজার মূল্য: ৳39 নূন্যতম অর্ডার পরিমাণ (MOQ): 2p তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Noakhali",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-20",
    "title": "কক্সবাজার-এ শুঁটকি, সামুদ্রিক মাছ",
    "category": "food-beverage",
    "division": "Chattogram",
    "district": "Cox's Bazar",
    "area": "কক্সবাজার",
    "wholesalePrice": 550,
    "retailPrice": 850,
    "retailSellPrice": 850,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-4",
      "name": "সোর্সিং প্রতিনিধি #4"
    },
    "likesCount": 104,
    "dislikesCount": 1,
    "commentsCount": 11,
    "viewsCount": 2035,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: শুঁটকি, সামুদ্রিক মাছ  সরাসরি সোর্সিং লোকেশন: কক্সবাজার মূল সোর্সিং এলাকা / উৎপত্তি: Chattogram  পাইকারি মূল্য / রেঞ্জ: ৳550 খুচরা বাজার মূল্য: ৳850 নূন্যতম অর্ডার পরিমাণ (MOQ): আলোচনা সাপেক্ষে তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Cox's Bazar",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-21",
    "title": "Birulia, Savar-এ গোলাপ",
    "category": "agriculture-livestock",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "Birulia, Savar",
    "wholesalePrice": 5,
    "retailPrice": 15,
    "retailSellPrice": 15,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-5",
      "name": "সোর্সিং প্রতিনিধি #5"
    },
    "likesCount": 115,
    "dislikesCount": 0,
    "commentsCount": 16,
    "viewsCount": 2120,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: গোলাপ ফুল  সরাসরি সোর্সিং লোকেশন: Birulia, Savar মূল সোর্সিং এলাকা / উৎপত্তি: Dhaka  পাইকারি মূল্য / রেঞ্জ: ৳5 খুচরা বাজার মূল্য: ৳15 নূন্যতম অর্ডার পরিমাণ (MOQ): 1বান্ডিল তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-22",
    "title": "গোলাপ গ্রাম, সাভার-এ গোলাপ ফুল",
    "category": "agriculture-livestock",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "গোলাপ গ্রাম, বিরুলিয়া , সাভার",
    "wholesalePrice": 5,
    "retailPrice": 15,
    "retailSellPrice": 15,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-6",
      "name": "সোর্সিং প্রতিনিধি #6"
    },
    "likesCount": 126,
    "dislikesCount": 3,
    "commentsCount": 21,
    "viewsCount": 2205,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: গোলাপ ফুল  সরাসরি সোর্সিং লোকেশন: গোলাপ গ্রাম, বিরুলিয়া , সাভার মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳5 খুচরা বাজার মূল্য: ৳15 নূন্যতম অর্ডার পরিমাণ (MOQ): ১বান্ডেল ( ১০০ পিস ) তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-23",
    "title": "ধান",
    "category": "agriculture-livestock",
    "division": "Chattogram",
    "district": "Lakshmipur",
    "area": "লক্ষ্মীপুর সদর, রামগঞ্জ, রায়পুর",
    "wholesalePrice": 1250,
    "retailPrice": 1550,
    "retailSellPrice": 1550,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-7",
      "name": "সোর্সিং প্রতিনিধি #7"
    },
    "likesCount": 137,
    "dislikesCount": 2,
    "commentsCount": 26,
    "viewsCount": 2290,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: ধান  সরাসরি সোর্সিং লোকেশন: লক্ষ্মীপুর সদর, রামগঞ্জ, রায়পুর মূল সোর্সিং এলাকা / উৎপত্তি: জেলা : লক্ষ্মীপুর, বিভাগ : চট্টগ্রাম  পাইকারি মূল্য / রেঞ্জ: ৳1250 খুচরা বাজার মূল্য: ৳1550 নূন্যতম অর্ডার পরিমাণ (MOQ): আলোচনা সাপেক্ষে তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Lakshmipur",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-24",
    "title": "মসলা পাইকারি সরবরাহ ও সরাসরি সোর্সিং",
    "category": "others",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "মৌলভীবাজার , চকবাজার, শ্যামবাজার (পুরান ঢাকা)",
    "wholesalePrice": 350,
    "retailPrice": 520,
    "retailSellPrice": 520,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-8",
      "name": "সোর্সিং প্রতিনিধি #8"
    },
    "likesCount": 148,
    "dislikesCount": 1,
    "commentsCount": 31,
    "viewsCount": 2375,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: মসলা  সরাসরি সোর্সিং লোকেশন: মৌলভীবাজার , চকবাজার, শ্যামবাজার (পুরান ঢাকা) মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳350 খুচরা বাজার মূল্য: ৳520 নূন্যতম অর্ডার পরিমাণ (MOQ): ৫ কেজি ( প্রতি আইটেম ) তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "others",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-25",
    "title": "খাতুনগঞ্জ-এ মসলা",
    "category": "others",
    "division": "Chattogram",
    "district": "Chattogram",
    "area": "খাতুনগঞ্জ",
    "wholesalePrice": 350,
    "retailPrice": 520,
    "retailSellPrice": 520,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-1",
      "name": "সোর্সিং প্রতিনিধি #1"
    },
    "likesCount": 159,
    "dislikesCount": 0,
    "commentsCount": 6,
    "viewsCount": 2460,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: মসলা  সরাসরি সোর্সিং লোকেশন: খাতুনগঞ্জ মূল সোর্সিং এলাকা / উৎপত্তি: চট্টগ্রাম বিভাগ  পাইকারি মূল্য / রেঞ্জ: ৳350 খুচরা বাজার মূল্য: ৳520 নূন্যতম অর্ডার পরিমাণ (MOQ): ৫ কেজি (প্রতি আইটেম) তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "others",
      "Chattogram",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-26",
    "title": "টাঙ্গাইল-এ পোড়াবাড়ির চমচম",
    "category": "food-beverage",
    "division": "Dhaka",
    "district": "Tangail",
    "area": "পাঁচআনী বাজার, টাঙ্গাইল",
    "wholesalePrice": 350,
    "retailPrice": 400,
    "retailSellPrice": 400,
    "profitPotential": "low",
    "author": {
      "id": "u-sheet-2",
      "name": "সোর্সিং প্রতিনিধি #2"
    },
    "likesCount": 170,
    "dislikesCount": 3,
    "commentsCount": 11,
    "viewsCount": 2545,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: পোড়াবাড়ির চমচম  সরাসরি সোর্সিং লোকেশন: পাঁচআনী বাজার, টাঙ্গাইল মূল সোর্সিং এলাকা / উৎপত্তি: টাঙ্গাইল  পাইকারি মূল্য / রেঞ্জ: ৳350 খুচরা বাজার মূল্য: ৳400 নূন্যতম অর্ডার পরিমাণ (MOQ): 5 তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Tangail",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-27",
    "title": "পাথরাইল ও বাজিতপুর-এ টাঙ্গাইল শাড়ি",
    "category": "clothing",
    "division": "Dhaka",
    "district": "Tangail",
    "area": "পাথরাইল ও বাজিতপুর",
    "wholesalePrice": 500,
    "retailPrice": 800,
    "retailSellPrice": 800,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-3",
      "name": "সোর্সিং প্রতিনিধি #3"
    },
    "likesCount": 181,
    "dislikesCount": 2,
    "commentsCount": 16,
    "viewsCount": 2630,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: টাঙ্গাইল শাড়ি  সরাসরি সোর্সিং লোকেশন: পাথরাইল ও বাজিতপুর মূল সোর্সিং এলাকা / উৎপত্তি: পাথরাইল ও বাজিতপুর , টাঙ্গাইল  পাইকারি মূল্য / রেঞ্জ: ৳500 খুচরা বাজার মূল্য: ৳800 নূন্যতম অর্ডার পরিমাণ (MOQ): 12 তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "clothing",
      "Tangail",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-28",
    "title": "মধুপুরের আনারস",
    "category": "food-beverage",
    "division": "Dhaka",
    "district": "Tangail",
    "area": "টাঙ্গাইলের মধুপুর উপজেলা",
    "wholesalePrice": 20,
    "retailPrice": 40,
    "retailSellPrice": 40,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-4",
      "name": "সোর্সিং প্রতিনিধি #4"
    },
    "likesCount": 192,
    "dislikesCount": 1,
    "commentsCount": 21,
    "viewsCount": 2715,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: মধুপুরের আনারস  সরাসরি সোর্সিং লোকেশন: টাঙ্গাইলের মধুপুর উপজেলা মূল সোর্সিং এলাকা / উৎপত্তি: টাঙ্গাইল  পাইকারি মূল্য / রেঞ্জ: ৳20 খুচরা বাজার মূল্য: ৳40 নূন্যতম অর্ডার পরিমাণ (MOQ): 100 তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Tangail",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-29",
    "title": "খেজুরের গুড় পাইকারি সরবরাহ ও সরাসরি সোর্সিং",
    "category": "food-beverage",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "বাদামতলী ও সোয়ারীঘাট, কারওয়ান বাজার",
    "wholesalePrice": 180,
    "retailPrice": 260,
    "retailSellPrice": 260,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-5",
      "name": "সোর্সিং প্রতিনিধি #5"
    },
    "likesCount": 53,
    "dislikesCount": 0,
    "commentsCount": 26,
    "viewsCount": 2800,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: খেজুরের গুড়  সরাসরি সোর্সিং লোকেশন: বাদামতলী ও সোয়ারীঘাট, কারওয়ান বাজার মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳180 খুচরা বাজার মূল্য: ৳260 নূন্যতম অর্ডার পরিমাণ (MOQ): ২০ থেকে ৪০ কেজি তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-30",
    "title": "খেজুরের গুড়",
    "category": "food-beverage",
    "division": "Khulna",
    "district": "Jashore",
    "area": "খাজুরা হাট ও চৌগাছা বাজার",
    "wholesalePrice": 180,
    "retailPrice": 260,
    "retailSellPrice": 260,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-6",
      "name": "সোর্সিং প্রতিনিধি #6"
    },
    "likesCount": 64,
    "dislikesCount": 3,
    "commentsCount": 31,
    "viewsCount": 2885,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: খেজুরের গুড়  সরাসরি সোর্সিং লোকেশন: খাজুরা হাট ও চৌগাছা বাজার মূল সোর্সিং এলাকা / উৎপত্তি: যশোর  পাইকারি মূল্য / রেঞ্জ: ৳180 খুচরা বাজার মূল্য: ৳260 নূন্যতম অর্ডার পরিমাণ (MOQ): ২০ থেকে ৪০ কেজি তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Jashore",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-31",
    "title": "লিচু",
    "category": "food-beverage",
    "division": "Rajshahi",
    "district": "Pabna",
    "area": "ঈশ্বরদী, পাবনা",
    "wholesalePrice": 2200,
    "retailPrice": 3200,
    "retailSellPrice": 3200,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-7",
      "name": "সোর্সিং প্রতিনিধি #7"
    },
    "likesCount": 75,
    "dislikesCount": 2,
    "commentsCount": 6,
    "viewsCount": 470,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: লিচু  সরাসরি সোর্সিং লোকেশন: ঈশ্বরদী, পাবনা মূল সোর্সিং এলাকা / উৎপত্তি: রাজশাহী  পাইকারি মূল্য / রেঞ্জ: ৳2200 খুচরা বাজার মূল্য: ৳3200 নূন্যতম অর্ডার পরিমাণ (MOQ): ২,০০০ থেকে ৫,০০০ পিস তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Pabna",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-32",
    "title": "বাঁশ-বেত",
    "category": "others",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "কারওয়ান বাজার , পান্থপথ, বিরুলিয়া ও ধামরাই, সাভার",
    "wholesalePrice": 50,
    "retailPrice": 60,
    "retailSellPrice": 65,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-8",
      "name": "সোর্সিং প্রতিনিধি #8"
    },
    "likesCount": 86,
    "dislikesCount": 1,
    "commentsCount": 11,
    "viewsCount": 555,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: বাঁশ-বেত পণ্য  সরাসরি সোর্সিং লোকেশন: কারওয়ান বাজার , পান্থপথ, বিরুলিয়া ও ধামরাই, সাভার মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳50 খুচরা বাজার মূল্য: ৳65 নূন্যতম অর্ডার পরিমাণ (MOQ): ২০ - ৫০ পিস তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "others",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-33",
    "title": "কমার্শিয়াল জামদানি শাড়ি",
    "category": "clothing",
    "division": "Dhaka",
    "district": "Narayanganj",
    "area": "রূপগঞ্জ জামদানি পল্লী, নোয়াপাড়া, নারায়ণগঞ্জ",
    "wholesalePrice": 650,
    "retailPrice": 1000,
    "retailSellPrice": 1000,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-1",
      "name": "সোর্সিং প্রতিনিধি #1"
    },
    "likesCount": 97,
    "dislikesCount": 0,
    "commentsCount": 16,
    "viewsCount": 640,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: লো-গ্রেড বা কমার্শিয়াল জামদানি শাড়ি  সরাসরি সোর্সিং লোকেশন: রূপগঞ্জ জামদানি পল্লী, নোয়াপাড়া, নারায়ণগঞ্জ মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳650 খুচরা বাজার মূল্য: ৳1000 নূন্যতম অর্ডার পরিমাণ (MOQ): ৫-১০ পিস তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "clothing",
      "Narayanganj",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-34",
    "title": "হাফ-সিল্ক জামদানি",
    "category": "clothing",
    "division": "Dhaka",
    "district": "Narayanganj",
    "area": "রূপগঞ্জ জামদানি পল্লী ও নোয়াপাড়া, নারায়ণগঞ্জ",
    "wholesalePrice": 1500,
    "retailPrice": 3500,
    "retailSellPrice": 3500,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-2",
      "name": "সোর্সিং প্রতিনিধি #2"
    },
    "likesCount": 108,
    "dislikesCount": 3,
    "commentsCount": 21,
    "viewsCount": 725,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: হাফ-সিল্ক জামদানি  সরাসরি সোর্সিং লোকেশন: রূপগঞ্জ জামদানি পল্লী ও নোয়াপাড়া, নারায়ণগঞ্জ মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳1500 খুচরা বাজার মূল্য: ৳3500 নূন্যতম অর্ডার পরিমাণ (MOQ): ৫-১০ পিস তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "clothing",
      "Narayanganj",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-35",
    "title": "পিওর কটন বা রেশম জামদানি",
    "category": "clothing",
    "division": "Dhaka",
    "district": "Narayanganj",
    "area": "রূপগঞ্জ জামদানি পল্লী ও নোয়াপাড়া, নারায়ণগঞ্জ",
    "wholesalePrice": 4500,
    "retailPrice": 10000,
    "retailSellPrice": 10000,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-3",
      "name": "সোর্সিং প্রতিনিধি #3"
    },
    "likesCount": 119,
    "dislikesCount": 2,
    "commentsCount": 26,
    "viewsCount": 810,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: পিওর কটন বা রেশম জামদানি  সরাসরি সোর্সিং লোকেশন: রূপগঞ্জ জামদানি পল্লী ও নোয়াপাড়া, নারায়ণগঞ্জ মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳4500 খুচরা বাজার মূল্য: ৳10000 নূন্যতম অর্ডার পরিমাণ (MOQ): ৫-১০ পিস তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "clothing",
      "Narayanganj",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-36",
    "title": "কাঁচা পাট (তোষা পাট)",
    "category": "agriculture-livestock",
    "division": "Dhaka",
    "district": "Faridpur",
    "area": "কানাইপুর হাট, ফরিদপুর",
    "wholesalePrice": 2500,
    "retailPrice": 3500,
    "retailSellPrice": 3500,
    "profitPotential": "medium",
    "author": {
      "id": "u-sheet-4",
      "name": "সোর্সিং প্রতিনিধি #4"
    },
    "likesCount": 130,
    "dislikesCount": 1,
    "commentsCount": 31,
    "viewsCount": 895,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: কাঁচা পাট (তোষা পাট)  সরাসরি সোর্সিং লোকেশন: কানাইপুর হাট, ফরিদপুর মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা বিভাগ  পাইকারি মূল্য / রেঞ্জ: ৳2500 খুচরা বাজার মূল্য: ৳3500 নূন্যতম অর্ডার পরিমাণ (MOQ): ১ বেল (প্রায় ১৮২ কেজি) / নুন্যতম ৫ থেকে ১০ মণ তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Faridpur",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-37",
    "title": "কাঁচা পাট",
    "category": "agriculture-livestock",
    "division": "Dhaka",
    "district": "Narayanganj",
    "area": "নিতাইগঞ্জ, বন্দর , নারায়ণগঞ্জ",
    "wholesalePrice": 2200,
    "retailPrice": 3500,
    "retailSellPrice": 3500,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-5",
      "name": "সোর্সিং প্রতিনিধি #5"
    },
    "likesCount": 141,
    "dislikesCount": 0,
    "commentsCount": 6,
    "viewsCount": 980,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: কাঁচা পাট  সরাসরি সোর্সিং লোকেশন: নিতাইগঞ্জ, বন্দর , নারায়ণগঞ্জ মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳2200 খুচরা বাজার মূল্য: ৳3500 নূন্যতম অর্ডার পরিমাণ (MOQ): ১ বেল (প্রায় ১৮২ কেজি) / নুন্যতম ৫ থেকে ১০ মণ তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Narayanganj",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-38",
    "title": "কাঁচা পাট পাইকারি সোর্সিং",
    "category": "agriculture-livestock",
    "division": "Dhaka",
    "district": "Rajbari",
    "area": "রাজবাড়ীর বালিয়াকান্দি",
    "wholesalePrice": 2200,
    "retailPrice": 3500,
    "retailSellPrice": 3500,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-6",
      "name": "সোর্সিং প্রতিনিধি #6"
    },
    "likesCount": 152,
    "dislikesCount": 3,
    "commentsCount": 11,
    "viewsCount": 1065,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: কাঁচা পাট  সরাসরি সোর্সিং লোকেশন: রাজবাড়ীর বালিয়াকান্দি মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳2200 খুচরা বাজার মূল্য: ৳3500 নূন্যতম অর্ডার পরিমাণ (MOQ): ১ বেল (প্রায় ১৮২ কেজি) / নুন্যতম ৫ থেকে ১০ মণ তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Rajbari",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-39",
    "title": "মাদারীপুরের টেকেরহাট-এ কাঁচা পাট পাইকারি সোর্সিং",
    "category": "agriculture-livestock",
    "division": "Dhaka",
    "district": "Madaripur",
    "area": "মাদারীপুরের টেকেরহাট",
    "wholesalePrice": 2200,
    "retailPrice": 3500,
    "retailSellPrice": 3500,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-7",
      "name": "সোর্সিং প্রতিনিধি #7"
    },
    "likesCount": 163,
    "dislikesCount": 2,
    "commentsCount": 16,
    "viewsCount": 1150,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: কাঁচা পাট  সরাসরি সোর্সিং লোকেশন: মাদারীপুরের টেকেরহাট মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳2200 খুচরা বাজার মূল্য: ৳3500 নূন্যতম অর্ডার পরিমাণ (MOQ): নুন্যতম ৫ থেকে ১০ মণ তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Madaripur",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-40",
    "title": "কাঁচা পাট",
    "category": "agriculture-livestock",
    "division": "Khulna",
    "district": "Kushtia",
    "area": "কুষ্টিয়ার কুমারখালী",
    "wholesalePrice": 2200,
    "retailPrice": 3500,
    "retailSellPrice": 3500,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-8",
      "name": "সোর্সিং প্রতিনিধি #8"
    },
    "likesCount": 174,
    "dislikesCount": 1,
    "commentsCount": 21,
    "viewsCount": 1235,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: কাঁচা পাট  সরাসরি সোর্সিং লোকেশন: কুষ্টিয়ার কুমারখালী মূল সোর্সিং এলাকা / উৎপত্তি: খুলনা  পাইকারি মূল্য / রেঞ্জ: ৳2200 খুচরা বাজার মূল্য: ৳3500 নূন্যতম অর্ডার পরিমাণ (MOQ): নুন্যতম ৫ থেকে ১০ মণ তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Kushtia",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-41",
    "title": "মৃৎশিল্পের পণ্য",
    "category": "others",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "কামারপট্টি, দোয়েল চত্বর",
    "wholesalePrice": 50,
    "retailPrice": 1000,
    "retailSellPrice": 1000,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-1",
      "name": "সোর্সিং প্রতিনিধি #1"
    },
    "likesCount": 185,
    "dislikesCount": 0,
    "commentsCount": 26,
    "viewsCount": 1320,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: মৃৎশিল্পের পণ্য  সরাসরি সোর্সিং লোকেশন: কারওয়ান বাজারের কামারপট্টি, দোয়েল চত্বর মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳50 খুচরা বাজার মূল্য: ৳1000 নূন্যতম অর্ডার পরিমাণ (MOQ): ১ ডজন (১২ পিস) - ১০০ পিস তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "others",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-42",
    "title": "কারওয়ান বাজার,  শ্যামবাজার-এ পান",
    "category": "agriculture-livestock",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "কারওয়ান বাজার,  শ্যামবাজার",
    "wholesalePrice": 40,
    "retailPrice": 300,
    "retailSellPrice": 300,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-2",
      "name": "সোর্সিং প্রতিনিধি #2"
    },
    "likesCount": 46,
    "dislikesCount": 3,
    "commentsCount": 31,
    "viewsCount": 1405,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: পান  সরাসরি সোর্সিং লোকেশন: কারওয়ান বাজার,  শ্যামবাজার মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳40 খুচরা বাজার মূল্য: ৳300 নূন্যতম অর্ডার পরিমাণ (MOQ): ১০ থেকে ৫০ বিড়া তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-43",
    "title": "মিষ্টি পান পাইকারি সোর্সিং",
    "category": "agriculture-livestock",
    "division": "Rajshahi",
    "district": "Rajshahi",
    "area": "মোহনপুর ও দুর্গাপুর হাট",
    "wholesalePrice": 40,
    "retailPrice": 300,
    "retailSellPrice": 300,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-3",
      "name": "সোর্সিং প্রতিনিধি #3"
    },
    "likesCount": 57,
    "dislikesCount": 2,
    "commentsCount": 6,
    "viewsCount": 1490,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: মিষ্টি পান  সরাসরি সোর্সিং লোকেশন: মোহনপুর ও দুর্গাপুর হাট মূল সোর্সিং এলাকা / উৎপত্তি: রাজশাহী  পাইকারি মূল্য / রেঞ্জ: ৳40 খুচরা বাজার মূল্য: ৳300 নূন্যতম অর্ডার পরিমাণ (MOQ): ১০ থেকে ৫০ বিড়া তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "agriculture-livestock",
      "Rajshahi",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-44",
    "title": "রসমালাই",
    "category": "food-beverage",
    "division": "Chattogram",
    "district": "Cumilla",
    "area": "মনোহরপুর ও কান্দিরপাড়,  কুমিল্লা জেলা",
    "wholesalePrice": 320,
    "retailPrice": 350,
    "retailSellPrice": 350,
    "profitPotential": "low",
    "author": {
      "id": "u-sheet-4",
      "name": "সোর্সিং প্রতিনিধি #4"
    },
    "likesCount": 68,
    "dislikesCount": 1,
    "commentsCount": 11,
    "viewsCount": 1575,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: রসমালাই  সরাসরি সোর্সিং লোকেশন: মনোহরপুর ও কান্দিরপাড়,  কুমিল্লা জেলা মূল সোর্সিং এলাকা / উৎপত্তি: চট্টগ্রাম  পাইকারি মূল্য / রেঞ্জ: ৳320 খুচরা বাজার মূল্য: ৳350 নূন্যতম অর্ডার পরিমাণ (MOQ): ১০ কেজি থেকে ২০ কেজি তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "food-beverage",
      "Cumilla",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-sheet-45",
    "title": "সানগ্লাস ও ঘড়ি পাইকারি সোর্সিং",
    "category": "cosmetics",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "পাটুয়াটুলী রোড, পুরান ঢাকা",
    "wholesalePrice": 50,
    "retailPrice": 1000,
    "retailSellPrice": 1000,
    "profitPotential": "high",
    "author": {
      "id": "u-sheet-5",
      "name": "সোর্সিং প্রতিনিধি #5"
    },
    "likesCount": 79,
    "dislikesCount": 0,
    "commentsCount": 16,
    "viewsCount": 1660,
    "createdAt": "2026-10-08T10:00:00Z",
    "description": "পণ্য: সানগ্লাস ও ঘড়ি  সরাসরি সোর্সিং লোকেশন: পাটুয়াটুলী রোড, পুরান ঢাকা মূল সোর্সিং এলাকা / উৎপত্তি: ঢাকা  পাইকারি মূল্য / রেঞ্জ: ৳50 খুচরা বাজার মূল্য: ৳1000 নূন্যতম অর্ডার পরিমাণ (MOQ): ১ ডজন (১২ পিস) তথ্য হালনাগাদ তারিখ: 10/8/2026  সংক্ষিপ্ত বিবরণ: স্থানীয় নিবন্ধিত পাইকারি হাব ও প্রকৃত সরবরাহকারীদের থেকে সরাসরি সংগৃহীত তথ্য। সঠিক মান ও সুলভ মূল্যে পাইকারি অর্ডারের জন্য গুগল ম্যাপস লোকেশন অনুযায়ী সরাসরি যোগাযোগ করুন।",
    "tags": [
      "cosmetics",
      "Dhaka",
      "সোর্সিং",
      "পাইকারি"
    ]
  },
  {
    "id": "post-1",
    "title": "গাজীপুরে পরিবেশবান্ধব কাগজের কাপ",
    "category": "food-beverage",
    "division": "Dhaka",
    "district": "Gazipur",
    "area": "কৌলতিয়া",
    "wholesalePrice": 0.65,
    "retailPrice": 1.2,
    "retailSellPrice": 1.5,
    "profitPotential": "high",
    "author": {
      "id": "u-1",
      "name": "মহসিন হোসেন"
    },
    "likesCount": 142,
    "dislikesCount": 3,
    "commentsCount": 28,
    "viewsCount": 1850,
    "createdAt": "2026-10-01T10:30:00Z"
  },
  {
    "id": "post-2",
    "title": "বগুড়ার বিখ্যাত দই ও দুগ্ধজাত",
    "category": "food-beverage",
    "division": "Rajshahi",
    "district": "Bogura",
    "area": "শেরপুর",
    "wholesalePrice": 180,
    "retailPrice": 260,
    "retailSellPrice": 280,
    "profitPotential": "high",
    "author": {
      "id": "u-2",
      "name": "তানভীর আহমেদ"
    },
    "likesCount": 215,
    "dislikesCount": 5,
    "commentsCount": 42,
    "viewsCount": 3100,
    "createdAt": "2026-10-02T14:15:00Z"
  },
  {
    "id": "post-3",
    "title": "অর্গানিক ড্রাই ফিশ (শুঁটকি)",
    "category": "food-beverage",
    "division": "Chattogram",
    "district": "Chattogram",
    "area": "আছাদগঞ্জ",
    "wholesalePrice": 450,
    "retailPrice": 750,
    "retailSellPrice": 850,
    "profitPotential": "medium",
    "author": {
      "id": "u-3",
      "name": "নাজমুন নাহার"
    },
    "likesCount": 98,
    "dislikesCount": 2,
    "commentsCount": 19,
    "viewsCount": 1420,
    "createdAt": "2026-10-03T09:00:00Z"
  },
  {
    "id": "post-4",
    "title": "টি-শার্ট",
    "category": "clothing",
    "division": "Dhaka",
    "district": "Narayanganj",
    "area": "নয়নপুর",
    "wholesalePrice": 110,
    "retailPrice": 220,
    "retailSellPrice": 250,
    "profitPotential": "high",
    "author": {
      "id": "u-4",
      "name": "আরিফ হাসান"
    },
    "likesCount": 310,
    "dislikesCount": 8,
    "commentsCount": 65,
    "viewsCount": 4200,
    "createdAt": "2026-10-04T11:45:00Z"
  },
  {
    "id": "post-5",
    "title": "যশোরে নার্সারি ও হাইব্রিড ফলের চারা",
    "category": "agriculture-livestock",
    "division": "Khulna",
    "district": "Jashore",
    "area": "ঝিকরগাছা",
    "wholesalePrice": 35,
    "retailPrice": 90,
    "retailSellPrice": 110,
    "profitPotential": "medium",
    "author": {
      "id": "u-5",
      "name": "সাদিয়া রহমান"
    },
    "likesCount": 176,
    "dislikesCount": 1,
    "commentsCount": 31,
    "viewsCount": 2100,
    "createdAt": "2026-10-05T08:20:00Z"
  },
  {
    "id": "post-6",
    "title": "অর্গানিক গ্রিন টি ও ভেষজ চায়ের স্মল-স্কেল প্যাকেজিং",
    "category": "food-beverage",
    "division": "Sylhet",
    "district": "Sylhet",
    "area": "শ্রীমঙ্গল রোড",
    "wholesalePrice": 120,
    "retailPrice": 240,
    "retailSellPrice": 270,
    "profitPotential": "high",
    "author": {
      "id": "u-6",
      "name": "কামরুল ইসলাম"
    },
    "likesCount": 189,
    "dislikesCount": 4,
    "commentsCount": 22,
    "viewsCount": 2350,
    "createdAt": "2026-10-05T16:10:00Z"
  },
  {
    "id": "post-7",
    "title": "মোবাইল রিপ্রেয়ারিং ও এক্সেসরিজ পয়েন্ট",
    "category": "electronics",
    "division": "Dhaka",
    "district": "Dhaka",
    "area": "মোতালেব প্লাজা, হাতিরপুল",
    "wholesalePrice": 40,
    "retailPrice": 150,
    "retailSellPrice": 180,
    "profitPotential": "medium",
    "author": {
      "id": "u-7",
      "name": "রাশেদুল করিম"
    },
    "likesCount": 260,
    "dislikesCount": 6,
    "commentsCount": 49,
    "viewsCount": 3800,
    "createdAt": "2026-10-06T12:00:00Z"
  },
  {
    "id": "post-8",
    "title": "রূপচর্চা সামগ্রী ও স্কিনকেয়ার ব্র্যান্ড",
    "category": "cosmetics",
    "division": "Rangpur",
    "district": "Rangpur",
    "area": "ধাপ",
    "wholesalePrice": 150,
    "retailPrice": 350,
    "retailSellPrice": 390,
    "profitPotential": "high",
    "author": {
      "id": "u-8",
      "name": "ফারজানা ইয়াসমিন"
    },
    "likesCount": 145,
    "dislikesCount": 2,
    "commentsCount": 27,
    "viewsCount": 1950,
    "createdAt": "2026-10-06T15:30:00Z"
  }
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

import { DETAILED_BLOG_POSTS } from "./blog-data";

export const MOCK_BLOG_POSTS: BlogPost[] = DETAILED_BLOG_POSTS;

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
    description: base.description || `এই ব্যবসাটি শুরু করার জন্য প্রাথমিক বিনিয়োগের প্রয়োজন তুলনামূলক কম। এলাকায় প্রচুর চাহিদা রয়েছে। আধুনিক প্রযুক্তির সঠিক ব্যবহারে পাইকারি খরচে পণ্য উৎপাদন করে খুচরা বাজারে ভালো লাভে বিক্রি করা সম্ভব। বিস্তারিত তথ্যের জন্য মন্তব্যে প্রশ্ন করতে পারেন।`,
    tags: base.tags || ["ব্যবসা", "উদ্যোক্তা", "পাইকারি_দাম", "বাংলাদেশ"],
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
