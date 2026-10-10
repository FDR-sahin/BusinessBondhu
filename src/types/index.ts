/**
 * Shared API types. Adjust field names to match the Express backend;
 * every other file imports from here so changes stay in one place.
 */

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  division?: string;
  district?: string;
  area?: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Shape we expect on error responses: { message, errors? } */
export interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

/* ---------------- Posts ---------------- */
export type ProfitPotential = "low" | "medium" | "high";

export interface PostAuthor {
  id: string;
  name: string;
  avatar?: string;
}

/** Adjust to your API. Location is flat; `category` is a slug from CATEGORIES. */
export interface Post {
  id: string;
  title: string;
  image?: string;
  category: string;
  division: string;
  district: string;
  area?: string;
  exactLocation?: string;
  wholesalePrice: number;
  wholesalePriceMax?: number;
  wholesalePriceText?: string;
  retailPrice: number;
  retailPriceMax?: number;
  retailPriceText?: string;
  retailSellPrice?: number;
  profitPotential: ProfitPotential;
  author: PostAuthor;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  description?: string;
  tags?: string[];
}

export interface DistrictStat {
  district: string;
  division?: string;
  count: number;
}

/* ---------------- Post details & comments ---------------- */
export interface PostDetail extends Post {
  description: string;
  tags?: string[];
}

/** What the logged-in viewer did on a post: GET /posts/:id/me */
export interface PostViewerState {
  reaction: "like" | "dislike" | null;
  saved: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string | null;
  author: PostAuthor;
  content: string;
  createdAt: string;
  likesCount: number;
  likedByMe?: boolean;
  /** Replies are one level deep and arrive nested inside the parent. */
  replies?: Comment[];
}

/* ---------------- AI Advisor ---------------- */
export interface AdvisorRequest {
  budget: number;
  division?: string;
  district?: string;
  area?: string;
  /** category slug (optional interest) */
  category?: string;
}

export interface AdvisorSuggestion {
  id?: string;
  name: string;
  category?: string;
  costBreakdown: { item: string; amount: number }[];
  /** Optional: if missing we sum the breakdown. */
  totalCost?: number;
  profitDaily: number;
  profitMonthly: number;
  /** 0–100 */
  riskPercent: number;
  /** "কেন এই এলাকায় ভালো হবে" */
  reason: string;
  tips: string[];
}

export interface AdvisorResponse {
  suggestions: AdvisorSuggestion[];
}

/* ---------------- Analysis ---------------- */
export interface AnalysisData {
  totals: { posts: number; users: number; comments: number; districts: number };
  postsByDivision: { division: string; count: number }[];
  postsByCategory: { category: string; count: number }[];
  /** last 6 months, month as "YYYY-MM" */
  growth: { month: string; posts: number }[];
  topDistricts: { district: string; count: number }[];
  topContributors: { id: string; name: string; avatar?: string; postCount: number }[];
  /** Optional. If missing, the page derives it from postsByCategory. */
  activeCategories?: { category: string; count: number }[];
  priceTrends: { month: string; avgWholesale: number; avgRetail: number }[];
}

/* ---------------- Blog ---------------- */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  /** slug from BLOG_CATEGORIES */
  category: string;
  author: PostAuthor;
  publishedAt: string;
  /** minutes; computed from content if the API doesn't send it */
  readingTime?: number;
  content?: string;
}

export interface BlogPostDetail extends BlogPost {
  /** Rich HTML from the admin editor. Always sanitized before rendering. */
  content: string;
  commentsEnabled?: boolean;
}

/* ---------------- Dashboard ---------------- */
export type PostStatus = "draft" | "pending" | "approved" | "rejected";

export interface MyPost extends Post {
  status: PostStatus;
  rejectionReason?: string;
}

/** Owner view of a post (GET /me/posts/:id): includes drafts and pending posts. */
export interface MyPostDetail extends PostDetail {
  status: PostStatus;
}

export type ActivityType = "like" | "comment" | "reply" | "post_approved" | "post_rejected" | "system";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  actor?: { name: string; avatar?: string };
  postId?: string;
  postTitle?: string;
  message?: string;
  createdAt: string;
}

export interface DashboardOverview {
  totals: { posts: number; likes: number; views: number; comments: number };
  /** last 7 days, date as "YYYY-MM-DD" */
  weeklyLikes: { date: string; likes: number }[];
  postsByCategory: { category: string; count: number }[];
  activity: ActivityEvent[];
}

/* ---------------- Dashboard (part B) ---------------- */
/** A comment on one of MY posts, with my replies nested. GET /me/comments */
export interface DashboardComment {
  id: string;
  content: string;
  createdAt: string;
  author: PostAuthor;
  post: { id: string; title: string };
  likesCount: number;
  /** true once the post owner has replied */
  replied: boolean;
  replies: Comment[];
}

export type NotificationType = "like" | "comment" | "reply" | "admin" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  postId?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationPrefs {
  likes: boolean;
  comments: boolean;
  replies: boolean;
  system: boolean;
  email: boolean;
}

export interface UserSettings {
  notifications: NotificationPrefs;
}
