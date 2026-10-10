import { NextResponse } from "next/server";
import {
  getCookieValue,
  getUserProfile,
  saveUserProfile,
  verifyPassword,
  sanitizeUser,
} from "@/lib/user-profile-store";
import { generateOtp, verifyOtp, clearOtp } from "@/lib/otp-store";

export async function handleAuthSignup(request: Request) {
  try {
    const body = await request.json();
    const rawName = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";

    if (!email) {
      return NextResponse.json({ message: "ইমেইল ঠিকানা দিন।" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ message: "পাসওয়ার্ড দিন।" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }, { status: 400 });
    }
    if (body.confirmPassword !== undefined && body.confirmPassword !== password) {
      return NextResponse.json({ message: "পাসওয়ার্ড দুটি মিলছে না।" }, { status: 400 });
    }

    // Check if account already exists with this email
    const existingUser = getUserProfile(email);
    if (existingUser && existingUser.email && existingUser.email.toLowerCase() === email) {
      return NextResponse.json(
        {
          message: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন।",
          errors: { email: ["এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন।"] },
        },
        { status: 409 }
      );
    }

    const fallbackName = email ? email.split("@")[0] : "ব্যবহারকারী";
    const name = rawName && rawName !== "উদ্যোক্তা" ? rawName : fallbackName;

    const savedUser = saveUserProfile({
      name,
      email,
      password,
      division: body.division || "",
      district: body.district || "",
      area: body.area || "",
      role: "user",
    });

    const res = NextResponse.json({
      user: sanitizeUser(savedUser),
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
    const password = typeof body.password === "string" ? body.password : "";
    const inputName = (body.name || "").trim();
    const rawHeaderName = request.headers.get("x-user-name");
    const headerName = rawHeaderName ? decodeURIComponent(rawHeaderName).trim() : "";
    const cookieName = (getCookieValue(request, "bhbd_user_name") || "").trim();

    if (!email) {
      return NextResponse.json(
        { message: "ইমেইল ঠিকানা দিন।" },
        { status: 400 }
      );
    }

    // Look up existing profile by email first
    const existingUser = getUserProfile(email);
    if (!existingUser) {
      return NextResponse.json(
        { message: "এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।" },
        { status: 401 }
      );
    }

    if (!password || !verifyPassword(password, existingUser)) {
      return NextResponse.json(
        { message: "ইমেইল বা পাসওয়ার্ড সঠিক নয়।" },
        { status: 401 }
      );
    }

    const emailPrefix = email ? email.split("@")[0] : "ব্যবহারকারী";

    // Priority for resolving name:
    // 1. Explicit body.name if provided and not "উদ্যোক্তা" and not the email prefix
    // 2. Existing profile name if not "উদ্যোক্তা" and not the email prefix
    // 3. Header/Cookie name if not "উদ্যোক্তা" and not the email prefix
    // 4. Any other non-empty inputName / existingUser.name / headerName / cookieName
    // 5. Fallback to emailPrefix only as last resort
    let resolvedName = emailPrefix;
    if (inputName && inputName !== "উদ্যোক্তা" && inputName !== emailPrefix) {
      resolvedName = inputName;
    } else if (existingUser?.name && existingUser.name !== "উদ্যোক্তা" && existingUser.name !== emailPrefix) {
      resolvedName = existingUser.name;
    } else if (headerName && headerName !== "উদ্যোক্তা" && headerName !== emailPrefix) {
      resolvedName = headerName;
    } else if (cookieName && cookieName !== "উদ্যোক্তা" && cookieName !== emailPrefix) {
      resolvedName = cookieName;
    } else if (inputName && inputName !== "উদ্যোক্তা") {
      resolvedName = inputName;
    } else if (existingUser?.name && existingUser.name !== "উদ্যোক্তা") {
      resolvedName = existingUser.name;
    } else if (headerName && headerName !== "উদ্যোক্তা") {
      resolvedName = headerName;
    } else if (cookieName && cookieName !== "উদ্যোক্তা") {
      resolvedName = cookieName;
    }

    const updatedUser = saveUserProfile({
      ...existingUser,
      email,
      name: resolvedName,
      role: existingUser?.role || "user",
    });

    const res = NextResponse.json({
      user: sanitizeUser(updatedUser),
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

  const cookieDivision = (getCookieValue(request, "bhbd_user_division") || "").trim();
  const cookieDistrict = (getCookieValue(request, "bhbd_user_district") || "").trim();
  const cookieArea = (getCookieValue(request, "bhbd_user_area") || "").trim();
  const cookieBio = (getCookieValue(request, "bhbd_user_bio") || "").trim();

  const rawHeaderDivision = request.headers.get("x-user-division");
  const headerDivision = rawHeaderDivision ? decodeURIComponent(rawHeaderDivision).trim() : "";
  const rawHeaderDistrict = request.headers.get("x-user-district");
  const headerDistrict = rawHeaderDistrict ? decodeURIComponent(rawHeaderDistrict).trim() : "";
  const rawHeaderArea = request.headers.get("x-user-area");
  const headerArea = rawHeaderArea ? decodeURIComponent(rawHeaderArea).trim() : "";

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

  const division = existing?.division || headerDivision || cookieDivision || "";
  const district = existing?.district || headerDistrict || cookieDistrict || "";
  const area = existing?.area || headerArea || cookieArea || "";
  const bio = existing?.bio || cookieBio || "";

  const user = {
    id: existing?.id || id || `u-${Date.now()}`,
    name: resolvedName,
    email: existing?.email || email || "user@example.com",
    role: (existing?.role || "user") as "user" | "admin",
    createdAt: existing?.createdAt || new Date().toISOString(),
    avatar: existing?.avatar || "",
    bio,
    division,
    district,
    area,
  };

  // Re-save to warm the in-memory cache on this lambda instance
  if (email) {
    saveUserProfile(user);
  }

  const res = NextResponse.json({ user: sanitizeUser(user as any) });
  const maxAge = 60 * 60 * 24 * 30;
  if (resolvedName && resolvedName !== emailPrefix) {
    res.cookies.set("bhbd_user_name", encodeURIComponent(resolvedName), {
      path: "/",
      maxAge,
      sameSite: "lax",
    });
  }
  if (division) {
    res.cookies.set("bhbd_user_division", encodeURIComponent(division), { path: "/", maxAge, sameSite: "lax" });
  }
  if (district) {
    res.cookies.set("bhbd_user_district", encodeURIComponent(district), { path: "/", maxAge, sameSite: "lax" });
  }
  if (area) {
    res.cookies.set("bhbd_user_area", encodeURIComponent(area), { path: "/", maxAge, sameSite: "lax" });
  }
  if (bio) {
    res.cookies.set("bhbd_user_bio", encodeURIComponent(bio), { path: "/", maxAge, sameSite: "lax" });
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

    const cookieDivision = (getCookieValue(request, "bhbd_user_division") || "").trim();
    const cookieDistrict = (getCookieValue(request, "bhbd_user_district") || "").trim();
    const cookieArea = (getCookieValue(request, "bhbd_user_area") || "").trim();
    const cookieBio = (getCookieValue(request, "bhbd_user_bio") || "").trim();

    const rawName = (body.name || "").trim();
    const emailPrefix = email.includes("@") ? email.split("@")[0] : "ব্যবহারকারী";
    const name = rawName && rawName !== "উদ্যোক্তা" ? rawName : emailPrefix;

    const existing = getUserProfile(email) || getUserProfile(id);

    const division = body.division !== undefined ? body.division : (existing?.division || cookieDivision || "");
    const district = body.district !== undefined ? body.district : (existing?.district || cookieDistrict || "");
    const area = body.area !== undefined ? body.area : (existing?.area || cookieArea || "");
    const bio = body.bio !== undefined ? body.bio : (existing?.bio || cookieBio || "");
    const avatar = body.avatar !== undefined ? body.avatar : (existing?.avatar || "");

    const saved = saveUserProfile({
      ...existing,
      ...body,
      id,
      email,
      name,
      division,
      district,
      area,
      bio,
      avatar,
    });

    const res = NextResponse.json({ user: sanitizeUser(saved) });
    const maxAge = 60 * 60 * 24 * 30;
    res.cookies.set("bhbd_user_name", encodeURIComponent(saved.name), {
      path: "/",
      maxAge,
      sameSite: "lax",
    });
    if (email && email !== "user@example.com") {
      res.cookies.set("bhbd_user_email", email, {
        path: "/",
        maxAge,
        sameSite: "lax",
      });
    }
    res.cookies.set("bhbd_user_division", encodeURIComponent(saved.division || ""), { path: "/", maxAge, sameSite: "lax" });
    res.cookies.set("bhbd_user_district", encodeURIComponent(saved.district || ""), { path: "/", maxAge, sameSite: "lax" });
    res.cookies.set("bhbd_user_area", encodeURIComponent(saved.area || ""), { path: "/", maxAge, sameSite: "lax" });
    res.cookies.set("bhbd_user_bio", encodeURIComponent(saved.bio || ""), { path: "/", maxAge, sameSite: "lax" });

    return res;
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "ত্রুটি হয়েছে।" }, { status: 400 });
  }
}

export async function handleMePasswordPut(request: Request) {
  try {
    const body = await request.json();
    const emailHeader = request.headers.get("x-user-email");
    const cookieEmail = getCookieValue(request, "bhbd_user_email");
    const idHeader = request.headers.get("x-user-id");

    const email = (body.email || emailHeader || cookieEmail || "").toLowerCase().trim();
    const id = body.id || idHeader;

    const user = (email ? getUserProfile(email) : null) || (id ? getUserProfile(id) : null) || getUserProfile();
    if (!user) {
      return NextResponse.json(
        { message: "ব্যবহারকারী পাওয়া যায়নি। অনুগ্রহ করে লগইন করুন।" },
        { status: 401 }
      );
    }

    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string"
      ? body.newPassword
      : typeof body.password === "string"
        ? body.password
        : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    // a) currentPassword must match the user's existing stored password. If it does not match, return status 400 with { message: "বর্তমান পাসওয়ার্ড সঠিক নয়।" }.
    if (!currentPassword || !verifyPassword(currentPassword, user)) {
      return NextResponse.json(
        { message: "বর্তমান পাসওয়ার্ড সঠিক নয়।" },
        { status: 400 }
      );
    }

    // b) newPassword and confirmPassword: check that newPassword exists, is at least 6-8 characters, and confirmPassword matches newPassword.
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { message: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    if (body.confirmPassword !== undefined && confirmPassword !== newPassword) {
      return NextResponse.json(
        { message: "পাসওয়ার্ড দুটি মিলছে না।" },
        { status: 400 }
      );
    }

    // c) newPassword cannot be the same as currentPassword.
    if (newPassword === currentPassword) {
      return NextResponse.json(
        { message: "নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ডের মতো হতে পারবে না।" },
        { status: 400 }
      );
    }

    // d) Update the stored user's password with the new password. Return 200 with { success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।" }.
    saveUserProfile({
      ...user,
      password: newPassword,
    });

    return NextResponse.json({
      success: true,
      message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।",
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" },
      { status: 400 }
    );
  }
}

export async function handleAuthForgotPassword(request?: Request) {
  try {
    if (!request) {
      return NextResponse.json({ message: "ইমেইল প্রদান করুন।" }, { status: 400 });
    }
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ message: "ইমেইল ঠিকানা দিন।" }, { status: 400 });
    }

    const user = getUserProfile(email);
    if (!user || !user.email || user.email.toLowerCase() !== email) {
      return NextResponse.json(
        { message: "এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে সঠিক ইমেইল দিন বা সাইন-আপ করুন।" },
        { status: 404 }
      );
    }

    const otp = generateOtp(email);
    console.log(`[OTP GENERATED] Email: ${email}, OTP: ${otp}`);

    return NextResponse.json({
      success: true,
      message: "আপনার ইমেইলে ৬ ডিজিটের ওটিপি (OTP) পাঠানো হয়েছে।",
      email,
      otp, // Provided for client notification and testing verification
      expiresIn: 600,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "ওটিপি পাঠাতে সমস্যা হয়েছে।" }, { status: 400 });
  }
}

export async function handleAuthVerifyOtp(request?: Request) {
  try {
    if (!request) {
      return NextResponse.json({ message: "তথ্য প্রদান করুন।" }, { status: 400 });
    }
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const otp = (body.otp || "").trim();

    if (!email || !otp) {
      return NextResponse.json({ message: "ইমেইল এবং ওটিপি কোড দিন।" }, { status: 400 });
    }

    const verification = verifyOtp(email, otp);
    if (!verification.valid) {
      return NextResponse.json({ message: verification.reason || "ভুল বা মেয়াদোত্তীর্ণ ওটিপি।" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "ওটিপি সফলভাবে যাচাই করা হয়েছে।",
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "যাচাই করতে সমস্যা হয়েছে।" }, { status: 400 });
  }
}

export async function handleAuthResetPassword(request?: Request) {
  try {
    if (!request) {
      return NextResponse.json({ message: "তথ্য প্রদান করুন।" }, { status: 400 });
    }
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const otp = (body.otp || body.token || "").trim();
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : password;

    if (!email) {
      return NextResponse.json({ message: "ইমেইল ঠিকানা দিন।" }, { status: 400 });
    }
    if (!otp) {
      return NextResponse.json({ message: "৬ ডিজিটের ওটিপি (OTP) কোড দিন।" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ message: "নতুন পাসওয়ার্ড দিন।" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }, { status: 400 });
    }
    if (confirmPassword !== password) {
      return NextResponse.json({ message: "পাসওয়ার্ড দুটি মিলছে না।" }, { status: 400 });
    }

    const user = getUserProfile(email);
    if (!user || !user.email || user.email.toLowerCase() !== email) {
      return NextResponse.json({ message: "ব্যবহারকারী অ্যাকাউন্ট পাওয়া যায়নি।" }, { status: 404 });
    }

    const verification = verifyOtp(email, otp);
    if (!verification.valid) {
      return NextResponse.json({ message: verification.reason || "ভুল বা মেয়াদোত্তীর্ণ ওটিপি।" }, { status: 400 });
    }

    // Update password
    saveUserProfile({
      ...user,
      password,
    });

    // Clear used OTP
    clearOtp(email);

    return NextResponse.json({
      success: true,
      message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।",
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" }, { status: 400 });
  }
}

