import { NextResponse } from "next/server";
import { getMockPaginatedPosts, MOCK_POSTS } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        let items = result.data.map((item: any) => {
          const districtName = getDistrictLabel(item.district) || item.district;
          const exactLoc =
            item.exactLocation ||
            (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);
          const wholesalePrice = Number(item.wholesalePrice || 0);
          const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);

          return {
            id: item.id || item._id,
            title: item.title,
            slug: (item.title || "").toLowerCase().replace(/\s+/g, "-"),
            category: item.category,
            division: item.division || "Dhaka",
            district: districtName,
            area: item.upazilaOrArea || item.area || "",
            exactLocation: exactLoc,
            wholesalePrice,
            retailPrice,
            retailSellPrice: retailPrice,
            profitPotential: item.profitPotential || `৳${Math.max(0, retailPrice - wholesalePrice)} লাভ / unit`,
            description: item.description || "",
            image: item.image || "/images/ideas/default.jpg",
            tags: item.tags || [`#${districtName}`, `#${item.category}`],
            author: {
              name: item.author || "উদ্যোক্তা অ্যাডমিন",
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

        // Search & Category Filtering if requested
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
          items = items.filter((i: any) => i.district === params.district);
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
    }
  } catch (err) {
    console.error("Failed to fetch posts from admin backend, using mock fallback:", err);
  }

  // Fallback to static mock data if backend server is unavailable
  const data = getMockPaginatedPosts(params);
  return NextResponse.json(data);
}
