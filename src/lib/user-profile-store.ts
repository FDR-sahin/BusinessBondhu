import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { User } from "@/types";

export interface StoredUserProfile extends User {
  password?: string;
  passwordHash?: string;
  updatedAt?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_USER_PROFILES__: Record<string, StoredUserProfile> | undefined;
}

const STORAGE_FILE = process.env.VERCEL
  ? path.join("/tmp", "user_profile_cache.json")
  : path.join(process.cwd(), ".next", "user_profile_cache.json");

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, user: StoredUserProfile): boolean {
  if (!password) return false;
  if (!user.password && !user.passwordHash) return false;
  const hash = hashPassword(password);
  if (user.passwordHash && user.passwordHash === hash) return true;
  if (user.password && user.password === password) return true;
  return false;
}

export function sanitizeUser(user: StoredUserProfile): User {
  const safeUser = { ...user };
  delete (safeUser as { password?: string }).password;
  delete (safeUser as { passwordHash?: string }).passwordHash;
  return safeUser;
}

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

export function getCookieValue(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

if (!global.__GLOBAL_USER_PROFILES__) {
  global.__GLOBAL_USER_PROFILES__ = loadFromDisk();
}

export function getUserProfile(identifier?: string | null): StoredUserProfile | null {
  if (!global.__GLOBAL_USER_PROFILES__ || Object.keys(global.__GLOBAL_USER_PROFILES__).length === 0) {
    global.__GLOBAL_USER_PROFILES__ = loadFromDisk();
  }
  if (identifier === undefined || identifier === null) {
    const keys = Object.keys(global.__GLOBAL_USER_PROFILES__);
    if (keys.length > 0) {
      return global.__GLOBAL_USER_PROFILES__[keys[keys.length - 1]];
    }
    return null;
  }
  const trimmed = identifier.trim();
  if (!trimmed) {
    return null;
  }
  const idLower = trimmed.toLowerCase();
  let match = global.__GLOBAL_USER_PROFILES__[idLower];
  if (match) return match;

  // Search by email or id in memory
  for (const key of Object.keys(global.__GLOBAL_USER_PROFILES__)) {
    const u = global.__GLOBAL_USER_PROFILES__[key];
    if (u.id === trimmed || u.email?.toLowerCase() === idLower) {
      return u;
    }
  }

  // Reload from disk in case updated by another worker/process
  const diskProfiles = loadFromDisk();
  global.__GLOBAL_USER_PROFILES__ = { ...global.__GLOBAL_USER_PROFILES__, ...diskProfiles };
  match = global.__GLOBAL_USER_PROFILES__[idLower];
  if (match) return match;

  for (const key of Object.keys(global.__GLOBAL_USER_PROFILES__)) {
    const u = global.__GLOBAL_USER_PROFILES__[key];
    if (u.id === trimmed || u.email?.toLowerCase() === idLower) {
      return u;
    }
  }

  return null;
}

export function saveUserProfile(
  userData: Partial<User> & {
    email?: string;
    id?: string;
    password?: string;
    passwordHash?: string;
  }
): StoredUserProfile {
  if (!global.__GLOBAL_USER_PROFILES__) {
    global.__GLOBAL_USER_PROFILES__ = {};
  }

  const emailKey = (userData.email || "user@example.com").toLowerCase().trim();
  const existing = getUserProfile(emailKey) || (userData.id ? getUserProfile(userData.id) : null);

  const fallbackName = emailKey.includes("@") && emailKey !== "user@example.com"
    ? emailKey.split("@")[0]
    : "ব্যবহারকারী";

  const rawName = (userData.name || "").trim();
  const existingName = (existing?.name || "").trim();

  // Resolution order:
  // 1. Explicit rawName if given and not "উদ্যোক্তা" and not the raw email prefix
  // 2. Existing name if valid and not "উদ্যোক্তা" and not the raw email prefix
  // 3. rawName if not empty and not "উদ্যোক্তা"
  // 4. existingName if not empty and not "উদ্যোক্তা"
  // 5. fallbackName (email prefix) only as last resort
  let resolvedName = fallbackName;
  if (rawName && rawName !== "উদ্যোক্তা" && rawName !== fallbackName) {
    resolvedName = rawName;
  } else if (existingName && existingName !== "উদ্যোক্তা" && existingName !== fallbackName) {
    resolvedName = existingName;
  } else if (rawName && rawName !== "উদ্যোক্তা") {
    resolvedName = rawName;
  } else if (existingName && existingName !== "উদ্যোক্তা") {
    resolvedName = existingName;
  }

  const now = new Date().toISOString();

  // Preserve existing password if not provided in this update
  const password = userData.password !== undefined
    ? userData.password
    : existing?.password;

  const passwordHash = userData.password !== undefined
    ? hashPassword(userData.password)
    : userData.passwordHash !== undefined
      ? userData.passwordHash
      : existing?.passwordHash;

  const updated: StoredUserProfile = {
    id: userData.id || existing?.id || `u-${Date.now()}`,
    name: resolvedName,
    email: userData.email || existing?.email || "user@example.com",
    avatar: (userData.avatar && userData.avatar.trim()) ? userData.avatar : (existing?.avatar || userData.avatar || ""),
    bio: (userData.bio && userData.bio.trim()) ? userData.bio : (existing?.bio || userData.bio || ""),
    division: (userData.division && userData.division.trim()) ? userData.division : (existing?.division || userData.division || ""),
    district: (userData.district && userData.district.trim()) ? userData.district : (existing?.district || userData.district || ""),
    area: (userData.area && userData.area.trim()) ? userData.area : (existing?.area || userData.area || ""),
    role: (userData.role || existing?.role || "user") as "user" | "admin",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    password,
    passwordHash,
  };

  global.__GLOBAL_USER_PROFILES__[emailKey] = updated;
  if (updated.id) {
    global.__GLOBAL_USER_PROFILES__[updated.id] = updated;
  }

  saveToDisk(global.__GLOBAL_USER_PROFILES__);
  return updated;
}
