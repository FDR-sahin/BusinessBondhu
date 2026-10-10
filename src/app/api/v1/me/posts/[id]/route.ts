import { NextResponse } from "next/server";
import { findUserPost } from "@/lib/user-posts-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const localPost = findUserPost(id);
  if (localPost) {
    return NextResponse.json(localPost);
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?status=all`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const item = data.data.find((i: any) => String(i._id) === id || String(i.id) === id);
        if (item) {
          return NextResponse.json({
            id: String(item._id || item.id),
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
          });
        }
      }
    }
  } catch (e) {
    console.error("Error looking up post in backend:", e);
  }

  return NextResponse.json({ message: "Post not found" }, { status: 404 });
}
