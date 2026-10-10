import { NextResponse } from "next/server";
import { getMockPaginatedPosts, MOCK_POSTS } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  let adminItems: any[] = [];

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        adminItems = result.data.map((item: any) => {
          const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
          const exactLoc =
            item.exactLocation ||
            (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);
          const wholesalePrice = Number(item.wholesalePrice || 0);
          const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);

          return {
            id: String(item.id || item._id),
            _id: String(item._id || item.id),
            title: item.title,
            slug: (item.title || "").toLowerCase().replace(/\s+/g, "-"),
            category: item.category || "agriculture-livestock",
            division: item.division || "Dhaka",
            district: districtName,
            area: item.upazilaOrArea || item.area || districtName,
            exactLocation: exactLoc,
            wholesalePrice,
            retailPrice,
            retailSellPrice: retailPrice,
            profitPotential: item.profitPotential || (retailPrice - wholesalePrice > 100 ? "high" : "medium"),
            description: item.description || "",
            image: item.image || "/images/ideas/default.jpg",
            tags: item.tags || [`#${districtName}`, `#${item.category}`],
            author: {
              name: typeof item.author === "string" ? item.author : item.author?.name || item.postedBy?.name || "উদ্যোক্তা অ্যাডমিন",
              avatar: "/images/avatars/default.jpg",
            },
            likesCount: item.likesCount ?? item.likes ?? 0,
            dislikesCount: item.dislikesCount ?? item.dislikes ?? 0,
            viewsCount: item.viewsCount ?? 15,
            commentsCount: item.comments?.length || 0,
            createdAt: item.createdAt || new Date().toISOString(),
            status: "approved",
            isVerified: item.isVerified ?? true,
          };
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch posts from admin backend:", err);
  }

  // Merge admin posts with MOCK_POSTS
  const existingIds = new Set(adminItems.map((i) => String(i.id)));
  const fallbackItems = MOCK_POSTS.filter((post) => !existingIds.has(String(post.id))).map((post) => {
    const districtName = getDistrictLabel(post.district) || post.district;
    const exactLoc = post.exactLocation || (post.area ? `${post.area}, ${districtName}` : `${districtName}, Bangladesh`);
    const wholesalePrice = Number(post.wholesalePrice || 0);
    const retailPrice = Number(post.retailSellPrice ?? post.retailPrice ?? 0);

    return {
      id: String(post.id),
      _id: String(post.id),
      title: post.title,
      slug: (post.title || "").toLowerCase().replace(/\s+/g, "-"),
      category: post.category,
      division: post.division,
      district: districtName,
      area: post.area,
      exactLocation: exactLoc,
      wholesalePrice,
      retailPrice,
      retailSellPrice: retailPrice,
      profitPotential: post.profitPotential,
      description: post.description,
      image: post.image || "/images/ideas/default.jpg",
      tags: post.tags,
      author: {
        name: typeof post.author === "string" ? post.author : post.author?.name || "সোর্সিং প্রতিনিধি",
        avatar: "/images/avatars/default.jpg",
      },
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount,
      viewsCount: post.viewsCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
      status: "approved",
      isVerified: true,
    };
  });

  let items = [...adminItems, ...fallbackItems];

  // Search & Category Filtering
  if (params.q) {
    const q = params.q.toLowerCase();
    items = items.filter(
      (i: any) =>
        i.title.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }
  if (params.category && params.category !== "all") {
    items = items.filter((i: any) => i.category === params.category);
  }
  if (params.district) {
    items = items.filter((i: any) => i.district.toLowerCase() === params.district.toLowerCase());
  }

  const page = Number(params.page || 1);
  const limit = Number(params.limit || 12);
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
