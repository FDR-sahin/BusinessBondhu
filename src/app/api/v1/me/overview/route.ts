import { NextResponse } from "next/server";
import { getUserPosts } from "@/lib/user-posts-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || request.headers.get("x-user-id") || "";
  const userEmail = (searchParams.get("userEmail") || searchParams.get("email") || request.headers.get("x-user-email") || "").toLowerCase().trim();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  if (!userId && !userEmail) {
    return NextResponse.json({
      totals: { posts: 0, likes: 0, views: 0, comments: 0 },
      weeklyLikes: [],
      postsByCategory: [],
      activity: [],
    });
  }

  let posts: any[] = [];
  try {
    const qParams = new URLSearchParams({ status: "all" });
    if (userId) qParams.set("userId", userId);
    if (userEmail) qParams.set("authorEmail", userEmail);

    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?${qParams.toString()}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        posts = data.data.filter((item: any) => {
          const matchesId = userId && (item.userId === userId || item.author?.id === userId);
          const itemEmail = (item.authorEmail || item.postedBy?.email || "").toLowerCase().trim();
          const matchesEmail = userEmail && itemEmail === userEmail;
          return Boolean(matchesId || matchesEmail);
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch overview posts from backend:", err);
  }

  const localItems = getUserPosts().filter((p) => {
    const matchesId = userId && (p.userId === userId || p.author?.id === userId);
    const postEmail = (p.authorEmail || "").toLowerCase().trim();
    const matchesEmail = userEmail && postEmail === userEmail;
    return Boolean(matchesId || matchesEmail);
  });

  const existingTitles = new Set(posts.map((i) => (i.title || "").trim().toLowerCase()));
  const allUserPosts = [...posts, ...localItems.filter((l) => !existingTitles.has(l.title.trim().toLowerCase()))];

  const totalPosts = allUserPosts.length;
  const totalLikes = allUserPosts.reduce((acc, p) => acc + (p.likes || p.likesCount || 0), 0);
  const totalViews = allUserPosts.reduce((acc, p) => acc + (p.viewsCount || 1), 0);
  const totalComments = allUserPosts.reduce((acc, p) => acc + (p.comments?.length || p.commentsCount || 0), 0);

  return NextResponse.json({
    totals: { posts: totalPosts, likes: totalLikes, views: totalViews, comments: totalComments },
    weeklyLikes: [],
    postsByCategory: [],
    activity: [],
  });
}
