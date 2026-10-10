import { NextResponse } from "next/server";
import { getUserPosts } from "@/lib/user-posts-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.toLowerCase();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  let adminIdeas: any[] = [];
  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?status=all`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        adminIdeas = data.data
          .filter((item: any) => item.postedBy?.role === "ব্যবহারকারী" || item.postedBy?.name === "উদ্যোক্তা ব্যবহারকারী" || item.status === "pending" || item.authorEmail)
          .map((item: any) => ({
            id: String(item.id || item._id),
            _id: String(item._id || item.id),
            title: item.title,
            category: item.category || "general",
            division: item.division || "Dhaka",
            district: item.district || "ঢাকা",
            area: item.upazilaOrArea || item.area || "",
            exactLocation: item.exactLocation || `${item.district || "ঢাকা"}, বাংলাদেশ`,
            wholesalePrice: Number(item.wholesalePrice || 0),
            wholesalePriceMax: item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined,
            wholesalePriceText: item.wholesalePriceText,
            retailPrice: Number(item.retailPrice || 0),
            retailPriceMax: item.retailPriceMax ? Number(item.retailPriceMax) : undefined,
            retailPriceText: item.retailPriceText,
            retailSellPrice: Number(item.retailPrice || 0),
            profitPotential: "medium",
            description: item.description || "",
            image: item.image || "/images/ideas/default.jpg",
            tags: item.tags || [],
            status: item.status || "approved",
            author: {
              name: item.postedBy?.name || "উদ্যোক্তা ব্যবহারকারী",
              avatar: "/images/avatars/default.jpg",
            },
            viewsCount: item.viewsCount || 1,
            likesCount: item.likesCount || item.likes || 0,
            dislikesCount: item.dislikesCount || item.dislikes || 0,
            commentsCount: item.comments?.length || 0,
            createdAt: item.createdAt || new Date().toISOString(),
          }));
      }
    }
  } catch (err) {
    console.error("Failed to fetch user posts from backend in me/posts:", err);
  }

  // Combine backend items with locally stored items (deduplicated by title/id)
  const localItems = getUserPosts();
  const existingTitles = new Set(adminIdeas.map((i) => i.title.trim().toLowerCase()));
  const filteredLocal = localItems.filter((l) => !existingTitles.has(l.title.trim().toLowerCase()));
  let items = [...adminIdeas, ...filteredLocal];

  if (status && status !== "all") {
    items = items.filter((p) => p.status === status);
  }

  if (q) {
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.district && p.district.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedItems = items.slice(start, start + limit);

  return NextResponse.json({
    items: paginatedItems,
    total,
    page,
    limit,
    totalPages,
  });
}
