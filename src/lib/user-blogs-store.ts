import fs from "fs";
import path from "path";

export interface UserStoredBlog {
  id: string;
  _id?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  readingTime?: number;
  readTime?: string;
  author: {
    id?: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  authorTitle?: string;
  userId?: string;
  authorEmail?: string;
  adminIdeaId?: string;
  status: "draft" | "pending" | "approved" | "rejected";
  rejectionReason?: string;
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_USER_BLOGS__: UserStoredBlog[] | undefined;
}

const STORAGE_FILE = process.env.VERCEL
  ? path.join("/tmp", "user_blogs_cache.json")
  : path.join(process.cwd(), ".next", "user_blogs_cache.json");

function loadFromDisk(): UserStoredBlog[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading user_blogs_cache.json:", e);
  }
  return [];
}

function saveToDisk(blogs: UserStoredBlog[]) {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(blogs, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving user_blogs_cache.json:", e);
  }
}

if (!global.__GLOBAL_USER_BLOGS__) {
  global.__GLOBAL_USER_BLOGS__ = loadFromDisk();
}

export function getUserBlogs(): UserStoredBlog[] {
  return global.__GLOBAL_USER_BLOGS__ || [];
}

export function saveUserBlog(blog: UserStoredBlog): UserStoredBlog {
  if (!global.__GLOBAL_USER_BLOGS__) {
    global.__GLOBAL_USER_BLOGS__ = [];
  }
  const idx = global.__GLOBAL_USER_BLOGS__.findIndex((b) => b.id === blog.id || b._id === blog.id);
  if (idx !== -1) {
    global.__GLOBAL_USER_BLOGS__[idx] = {
      ...global.__GLOBAL_USER_BLOGS__[idx],
      ...blog,
      updatedAt: new Date().toISOString(),
    };
  } else {
    global.__GLOBAL_USER_BLOGS__.unshift(blog);
  }
  saveToDisk(global.__GLOBAL_USER_BLOGS__);
  return blog;
}

export function deleteUserBlog(id: string): boolean {
  if (!global.__GLOBAL_USER_BLOGS__) return false;
  const initialLen = global.__GLOBAL_USER_BLOGS__.length;
  global.__GLOBAL_USER_BLOGS__ = global.__GLOBAL_USER_BLOGS__.filter((b) => b.id !== id && b._id !== id);
  if (global.__GLOBAL_USER_BLOGS__.length !== initialLen) {
    saveToDisk(global.__GLOBAL_USER_BLOGS__);
    return true;
  }
  return false;
}

export function findUserBlog(idOrSlug: string): UserStoredBlog | undefined {
  const decoded = decodeURIComponent(idOrSlug);
  return getUserBlogs().find(
    (b) =>
      b.id === idOrSlug ||
      b._id === idOrSlug ||
      b.slug === idOrSlug ||
      b.slug === decoded ||
      b.id === decoded ||
      b.title.trim().toLowerCase() === decoded.trim().toLowerCase()
  );
}
