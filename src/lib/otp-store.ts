import fs from "fs";
import path from "path";

export interface StoredOtp {
  email: string;
  code: string;
  createdAt: number;
  expiresAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_OTPS__: Record<string, StoredOtp> | undefined;
}

const STORAGE_FILE = process.env.VERCEL
  ? path.join("/tmp", "otp_cache.json")
  : path.join(process.cwd(), ".next", "otp_cache.json");

function loadFromDisk(): Record<string, StoredOtp> {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading otp_cache.json:", e);
  }
  return {};
}

function saveToDisk(otps: Record<string, StoredOtp>) {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(otps, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving otp_cache.json:", e);
  }
}

if (!global.__GLOBAL_OTPS__) {
  global.__GLOBAL_OTPS__ = loadFromDisk();
}

/**
 * Generate a 6-digit OTP for the given email, valid for 10 minutes (600,000 ms).
 */
export function generateOtp(email: string): string {
  if (!global.__GLOBAL_OTPS__) {
    global.__GLOBAL_OTPS__ = loadFromDisk();
  }

  const normalizedEmail = email.toLowerCase().trim();
  // Generate random 6-digit number between 100000 and 999999
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes

  const entry: StoredOtp = {
    email: normalizedEmail,
    code,
    createdAt: now,
    expiresAt,
  };

  global.__GLOBAL_OTPS__[normalizedEmail] = entry;
  saveToDisk(global.__GLOBAL_OTPS__);

  return code;
}

/**
 * Verify if the provided OTP matches and has not expired.
 */
export function verifyOtp(email: string, code: string): { valid: boolean; reason?: string } {
  if (!global.__GLOBAL_OTPS__ || Object.keys(global.__GLOBAL_OTPS__).length === 0) {
    global.__GLOBAL_OTPS__ = loadFromDisk();
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedCode = code.trim();

  let entry = global.__GLOBAL_OTPS__[normalizedEmail];
  if (!entry) {
    const fromDisk = loadFromDisk();
    global.__GLOBAL_OTPS__ = { ...global.__GLOBAL_OTPS__, ...fromDisk };
    entry = global.__GLOBAL_OTPS__[normalizedEmail];
  }

  if (!entry) {
    return { valid: false, reason: "কোনো ওটিপি (OTP) অনুরোধ পাওয়া যায়নি। নতুন ওটিপি পাঠান।" };
  }

  if (Date.now() > entry.expiresAt) {
    delete global.__GLOBAL_OTPS__[normalizedEmail];
    saveToDisk(global.__GLOBAL_OTPS__);
    return { valid: false, reason: "ওটিপির (OTP) মেয়াদ শেষ হয়ে গেছে। নতুন কোড অনুরোধ করুন।" };
  }

  if (entry.code !== normalizedCode) {
    return { valid: false, reason: "ভুল ওটিপি (OTP) কোড। আবার চেষ্টা করুন।" };
  }

  return { valid: true };
}

/**
 * Invalidate/clear the OTP after successful verification and password reset.
 */
export function clearOtp(email: string): void {
  if (!global.__GLOBAL_OTPS__) {
    global.__GLOBAL_OTPS__ = loadFromDisk();
  }

  const normalizedEmail = email.toLowerCase().trim();
  delete global.__GLOBAL_OTPS__[normalizedEmail];
  saveToDisk(global.__GLOBAL_OTPS__);
}

export function getOtp(email: string): string | null {
  if (!global.__GLOBAL_OTPS__ || Object.keys(global.__GLOBAL_OTPS__).length === 0) {
    global.__GLOBAL_OTPS__ = loadFromDisk();
  }
  const normalizedEmail = email.toLowerCase().trim();
  const entry = global.__GLOBAL_OTPS__[normalizedEmail];
  if (entry && Date.now() <= entry.expiresAt) {
    return entry.code;
  }
  return null;
}
