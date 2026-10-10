import fs from "fs";
import path from "path";
import type { User } from "@/types";

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_USER_PROFILES__: Record<string, User> | undefined;
}

const STORAGE_FILE = process.env.VERCEL
  ? path.join("/tmp", "user_profile_cache.json")
  : path.join(process.cwd(), ".next", "user_profile_cache.json");

function loadFromDisk(): Record<string, User> {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading user_profile_cache.json:", e);
  }
  return {};
}

function saveToDisk(profiles: Record<string, User>) {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(profiles, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving user_profile_cache.json:", e);
  }
}

if (!global.__GLOBAL_USER_PROFILES__) {
  global.__GLOBAL_USER_PROFILES__ = loadFromDisk();
}

export function getUserProfile(identifier?: string | null): User | null {
  if (!global.__GLOBAL_USER_PROFILES__) {
    global.__GLOBAL_USER_PROFILES__ = {};
  }
  if (!identifier) {
    // Return last updated or default
    const keys = Object.keys(global.__GLOBAL_USER_PROFILES__);
    if (keys.length > 0) {
      return global.__GLOBAL_USER_PROFILES__[keys[keys.length - 1]];
    }
    return null;
  }
  const idLower = identifier.toLowerCase().trim();
  const directMatch = global.__GLOBAL_USER_PROFILES__[idLower];
  if (directMatch) return directMatch;

  // Search by email or id
  for (const key of Object.keys(global.__GLOBAL_USER_PROFILES__)) {
    const u = global.__GLOBAL_USER_PROFILES__[key];
    if (u.id === identifier || u.email?.toLowerCase() === idLower) {
      return u;
    }
  }
  return null;
}

export function saveUserProfile(userData: Partial<User> & { email?: string; id?: string }): User {
  if (!global.__GLOBAL_USER_PROFILES__) {
    global.__GLOBAL_USER_PROFILES__ = {};
  }

  const emailKey = (userData.email || "user@example.com").toLowerCase().trim();
  const existing = getUserProfile(emailKey) || getUserProfile(userData.id);

  const updated: User = {
    id: userData.id || existing?.id || `u-${Date.now()}`,
    name: userData.name || existing?.name || (emailKey.includes("@") ? emailKey.split("@")[0] : "উদ্যোক্তা"),
    email: userData.email || existing?.email || "user@example.com",
    avatar: userData.avatar !== undefined ? userData.avatar : existing?.avatar || "",
    bio: userData.bio !== undefined ? userData.bio : existing?.bio || "",
    division: userData.division !== undefined ? userData.division : existing?.division || "",
    district: userData.district !== undefined ? userData.district : existing?.district || "",
    area: userData.area !== undefined ? userData.area : existing?.area || "",
    role: (userData.role || existing?.role || "user") as "user" | "admin",
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  global.__GLOBAL_USER_PROFILES__[emailKey] = updated;
  if (updated.id) {
    global.__GLOBAL_USER_PROFILES__[updated.id] = updated;
  }

  saveToDisk(global.__GLOBAL_USER_PROFILES__);
  return updated;
}
