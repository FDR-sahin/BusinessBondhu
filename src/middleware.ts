import { NextResponse, type NextRequest } from "next/server";

// Keep in sync with AUTH_COOKIE in src/store/auth-store.ts
const AUTH_COOKIE = process.env.NEXT_PUBLIC_AUTH_COOKIE ?? "bhbd_token";
const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];

/** Only allow same-site relative redirects (blocks open-redirect attacks). */
function safeRedirect(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(AUTH_COOKIE)?.value);

  // 1) Guests can't open the dashboard -> /login?redirect=<where they wanted to go>
  if (pathname.startsWith("/dashboard") && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
  }

  // 2) Logged-in users don't need login/signup pages
  if (AUTH_PAGES.includes(pathname) && hasSession) {
    const target = safeRedirect(req.nextUrl.searchParams.get("redirect"));
    return NextResponse.redirect(new URL(target, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/forgot-password"],
};
