import fs from "fs";
import path from "path";
import type { User } from "@/types";

export interface StoredUserProfile extends User {
  updatedAt?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_USER_PROFILES__: Record<string, StoredUserProfile> | undefined;
}

const STORAGE_FILE = process.env.VERCEL
  ? path.join("/tmp", "user_profile_cache.json")
  : path.join(process.cwd(), ".next", "user_profile_cache.json");

function loadFromDisk(): Record<string, StoredUserProfile> {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(data);
      // Clean up any legacy entries that had hardcoded "উদ্যোক্তা"
      for (const k of Object.keys(parsed)) {
        if (parsed[k]?.name === "উদ্যোক্তা") {
          const email = parsed[k].email;
          parsed[k].name = email && email.includes("@") ? email.split("@")[0] : "ব্যবহারকারী";
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error("Error reading user_profile_cache.json:", e);
  }
  return {};
}

function saveToDisk(profiles: Record<string, StoredUserProfile>) {
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

export function getUserProfile(identifier?: string | null): StoredUserProfile | null {
  if (!global.__GLOBAL_USER_PROFILES__) {
    global.__GLOBAL_USER_PROFILES__ = {};
  }
  if (!identifier) {
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

export function saveUserProfile(userData: Partial<User> & { email?: string; id?: string }): StoredUserProfile {
  if (!global.__GLOBAL_USER_PROFILES__) {
    global.__GLOBAL_USER_PROFILES__ = {};
  }

  const emailKey = (userData.email || "user@example.com").toLowerCase().trim();
  const existing = getUserProfile(emailKey) || getUserProfile(userData.id);

  const fallbackName = emailKey.includes("@") && emailKey !== "user@example.com"
    ? emailKey.split("@")[0]
    : "ব্যবহারকারী";

  const resolvedName = (userData.name && userData.name !== "উদ্যোক্তা" ? userData.name.trim() : "") ||
    (existing?.name && existing.name !== "উদ্যোক্তা" ? existing.name.trim() : "") ||
    fallbackName;

  const now = new Date().toISOString();
  const updated: StoredUserProfile = {
    id: userData.id || existing?.id || `u-${Date.now()}`,
    name: resolvedName,
    email: userData.email || existing?.email || "user@example.com",
    avatar: userData.avatar !== undefined ? userData.avatar : existing?.avatar || "",
    bio: userData.bio !== undefined ? userData.bio : existing?.bio || "",
    division: userData.division !== undefined ? userData.division : existing?.division || "",
    district: userData.district !== undefined ? userData.district : existing?.district || "",
    area: userData.area !== undefined ? userData.area : existing?.area || "",
    role: (userData.role || existing?.role || "user") as "user" | "admin",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  global.__GLOBAL_USER_PROFILES__[emailKey] = updated;
  if (updated.id) {
    global.__GLOBAL_USER_PROFILES__[updated.id] = updated;
  }

  saveToDisk(global.__GLOBAL_USER_PROFILES__);
  return updated;
}
