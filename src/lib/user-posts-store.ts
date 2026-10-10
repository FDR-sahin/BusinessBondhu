// In-memory & file-based storage for user-submitted posts and drafts
import fs from "fs";
import path from "path";

export interface UserStoredPost {
  id: string;
  _id?: string;
  title: string;
  category?: string;
  division?: string;
  district?: string;
  area?: string;
  exactLocation?: string;
  wholesalePrice?: number;
  wholesalePriceMax?: number;
  wholesalePriceText?: string;
  retailPrice?: number;
  retailPriceMax?: number;
  retailPriceText?: string;
  retailSellPrice?: number;
  profitPotential?: string;
  description?: string;
  image?: string;
  tags?: string[];
  status: "draft" | "pending" | "approved" | "rejected";
  userId?: string;
  author?: {
    id?: string;
    name: string;
    avatar?: string;
  };
  viewsCount?: number;
  likesCount?: number;
  dislikesCount?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt?: string;
  isVerified?: boolean;
}

// Global variable across Next.js API route reloads in dev mode
declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_USER_POSTS__: UserStoredPost[] | undefined;
}

const STORAGE_FILE = path.join(process.cwd(), ".next", "user_posts_cache.json");

function loadFromDisk(): UserStoredPost[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading user_posts_cache.json:", e);
  }
  return [];
}

function saveToDisk(posts: UserStoredPost[]) {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(posts, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving user_posts_cache.json:", e);
  }
}

if (!global.__GLOBAL_USER_POSTS__) {
  global.__GLOBAL_USER_POSTS__ = loadFromDisk();
}

export function getUserPosts(): UserStoredPost[] {
  return global.__GLOBAL_USER_POSTS__ || [];
}

export function saveUserPost(post: UserStoredPost): UserStoredPost {
  if (!global.__GLOBAL_USER_POSTS__) {
    global.__GLOBAL_USER_POSTS__ = [];
  }
  const idx = global.__GLOBAL_USER_POSTS__.findIndex((p) => p.id === post.id);
  if (idx !== -1) {
    global.__GLOBAL_USER_POSTS__[idx] = { ...global.__GLOBAL_USER_POSTS__[idx], ...post, updatedAt: new Date().toISOString() };
  } else {
    global.__GLOBAL_USER_POSTS__.unshift(post);
  }
  saveToDisk(global.__GLOBAL_USER_POSTS__);
  return post;
}

export function deleteUserPost(id: string): boolean {
  if (!global.__GLOBAL_USER_POSTS__) return false;
  const initialLen = global.__GLOBAL_USER_POSTS__.length;
  global.__GLOBAL_USER_POSTS__ = global.__GLOBAL_USER_POSTS__.filter((p) => p.id !== id && p._id !== id);
  if (global.__GLOBAL_USER_POSTS__.length !== initialLen) {
    saveToDisk(global.__GLOBAL_USER_POSTS__);
    return true;
  }
  return false;
}

export function findUserPost(id: string): UserStoredPost | undefined {
  return getUserPosts().find((p) => p.id === id || p._id === id);
}
