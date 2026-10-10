import { NextResponse } from "next/server";
import { getCookieValue, getUserProfile, saveUserProfile } from "@/lib/user-profile-store";

export async function handleAuthSignup(request: Request) {
  try {
    const body = await request.json();
    const rawName = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const fallbackName = email ? email.split("@")[0] : "ব্যবহারকারী";
    const name = rawName && rawName !== "উদ্যোক্তা" ? rawName : fallbackName;

    const savedUser = saveUserProfile({
      name,
      email,
      division: body.division || "",
      district: body.district || "",
      area: body.area || "",
      role: "user",
    });

    const res = NextResponse.json({
      user: savedUser,
      accessToken: `token-${Date.now()}`,
      refreshToken: `rtoken-${Date.now()}`,
    });

    res.cookies.set("bhbd_user_name", encodeURIComponent(savedUser.name), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    if (email) {
      res.cookies.set("bhbd_user_email", email, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
    }

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।" },
      { status: 400 }
    );
  }
}

export async function handleAuthLogin(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const inputName = (body.name || "").trim();
    const rawHeaderName = request.headers.get("x-user-name");
    const headerName = rawHeaderName ? decodeURIComponent(rawHeaderName).trim() : "";
    const cookieName = (getCookieValue(request, "bhbd_user_name") || "").trim();

    // Look up existing profile by email first
    let user = getUserProfile(email);

    const emailPrefix = email ? email.split("@")[0] : "ব্যবহারকারী";

    // Priority for resolving name:
    // 1. Explicit body.name if provided and not "উদ্যোক্তা" and not the email prefix
    // 2. Existing profile name if not "উদ্যোক্তা" and not the email prefix
    // 3. Header/Cookie name if not "উদ্যোক্তা" and not the email prefix
    // 4. Any other non-empty inputName / user.name / headerName / cookieName
    // 5. Fallback to emailPrefix only as last resort
    let resolvedName = emailPrefix;
    if (inputName && inputName !== "উদ্যোক্তা" && inputName !== emailPrefix) {
      resolvedName = inputName;
    } else if (user?.name && user.name !== "উদ্যোক্তা" && user.name !== emailPrefix) {
      resolvedName = user.name;
    } else if (headerName && headerName !== "উদ্যোক্তা" && headerName !== emailPrefix) {
      resolvedName = headerName;
    } else if (cookieName && cookieName !== "উদ্যোক্তা" && cookieName !== emailPrefix) {
      resolvedName = cookieName;
    } else if (inputName && inputName !== "উদ্যোক্তা") {
      resolvedName = inputName;
    } else if (user?.name && user.name !== "উদ্যোক্তা") {
      resolvedName = user.name;
    } else if (headerName && headerName !== "উদ্যোক্তা") {
      resolvedName = headerName;
    } else if (cookieName && cookieName !== "উদ্যোক্তা") {
      resolvedName = cookieName;
    }

    user = saveUserProfile({
      ...user,
      email,
      name: resolvedName,
      role: user?.role || "user",
    });

    const res = NextResponse.json({
      user,
      accessToken: `token-${Date.now()}`,
      refreshToken: `rtoken-${Date.now()}`,
    });

    res.cookies.set("bhbd_user_name", encodeURIComponent(resolvedName), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    if (email) {
      res.cookies.set("bhbd_user_email", email, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
    }

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "লগইন করতে সমস্যা হয়েছে।" },
      { status: 400 }
    );
  }
}

export async function handleAuthMeGet(request: Request) {
  const emailHeader = request.headers.get("x-user-email");
  const cookieEmail = getCookieValue(request, "bhbd_user_email");
  const email = (emailHeader || cookieEmail || "").toLowerCase().trim() || undefined;
  const id = request.headers.get("x-user-id") || undefined;

  const rawHeaderName = request.headers.get("x-user-name");
  const headerName = rawHeaderName ? decodeURIComponent(rawHeaderName).trim() : "";
  const cookieName = (getCookieValue(request, "bhbd_user_name") || "").trim();

  const existing = getUserProfile(email) || getUserProfile(id) || getUserProfile();
  const emailPrefix = email ? email.split("@")[0] : "ব্যবহারকারী";

  // Resolve best custom name
  let resolvedName = emailPrefix;
  if (existing?.name && existing.name !== "উদ্যোক্তা" && existing.name !== emailPrefix) {
    resolvedName = existing.name;
  } else if (headerName && headerName !== "উদ্যোক্তা" && headerName !== emailPrefix) {
    resolvedName = headerName;
  } else if (cookieName && cookieName !== "উদ্যোক্তা" && cookieName !== emailPrefix) {
    resolvedName = cookieName;
  } else if (existing?.name && existing.name !== "উদ্যোক্তা") {
    resolvedName = existing.name;
  } else if (headerName && headerName !== "উদ্যোক্তা") {
    resolvedName = headerName;
  } else if (cookieName && cookieName !== "উদ্যোক্তা") {
    resolvedName = cookieName;
  }

  const user = {
    id: existing?.id || id || `u-${Date.now()}`,
    name: resolvedName,
    email: existing?.email || email || "user@example.com",
    role: (existing?.role || "user") as "user" | "admin",
    createdAt: existing?.createdAt || new Date().toISOString(),
    avatar: existing?.avatar || "",
    bio: existing?.bio || "",
    division: existing?.division || "",
    district: existing?.district || "",
    area: existing?.area || "",
  };

  // Re-save to warm the in-memory cache on this lambda instance
  if (email) {
    saveUserProfile(user);
  }

  const res = NextResponse.json({ user });
  if (resolvedName && resolvedName !== emailPrefix) {
    res.cookies.set("bhbd_user_name", encodeURIComponent(resolvedName), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }
  return res;
}

export async function handleAuthMePut(request: Request) {
  try {
    const body = await request.json();
    const emailHeader = request.headers.get("x-user-email");
    const cookieEmail = getCookieValue(request, "bhbd_user_email");
    const idHeader = request.headers.get("x-user-id");

    const email = (body.email || emailHeader || cookieEmail || "user@example.com").toLowerCase().trim();
    const id = body.id || idHeader;

    const rawName = (body.name || "").trim();
    const emailPrefix = email.includes("@") ? email.split("@")[0] : "ব্যবহারকারী";
    const name = rawName && rawName !== "উদ্যোক্তা" ? rawName : emailPrefix;

    const saved = saveUserProfile({
      ...body,
      id,
      email,
      name,
    });

    const res = NextResponse.json({ user: saved });
    res.cookies.set("bhbd_user_name", encodeURIComponent(saved.name), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    if (email && email !== "user@example.com") {
      res.cookies.set("bhbd_user_email", email, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
    }

    return res;
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "ত্রুটি হয়েছে।" }, { status: 400 });
  }
}

export async function handleAuthForgotPassword() {
  return NextResponse.json({
    success: true,
    message: "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।",
  });
}

export async function handleAuthResetPassword() {
  return NextResponse.json({
    success: true,
    message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।",
  });
}
