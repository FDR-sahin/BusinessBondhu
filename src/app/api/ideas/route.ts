import { NextResponse } from "next/server";
import { MOCK_POSTS } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";

export const dynamic = "force-dynamic";

export async function GET() {
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
          const profit = Math.max(0, retailPrice - wholesalePrice);

          return {
            _id: String(item._id || item.id),
            id: String(item.id || item._id),
            title: item.title,
            category: item.category || "agriculture-livestock",
            division: item.division || "Dhaka",
            district: districtName,
            area: item.upazilaOrArea || item.area || districtName,
            exactLocation: exactLoc,
            wholesalePrice,
            retailPrice,
            retailSellPrice: retailPrice,
            profit,
            profitPotential: item.profitPotential || (profit > 100 ? "high" : profit > 30 ? "medium" : "low"),
            description: item.description || "",
            image: item.image || "/images/ideas/default.jpg",
            tags: item.tags || [`#${districtName}`, `#${item.category}`],
            author: typeof item.author === "string" ? item.author : item.author?.name || item.postedBy?.name || "উদ্যোক্তা অ্যাডমিন",
            likesCount: item.likesCount ?? item.likes ?? 0,
            viewsCount: item.viewsCount ?? 15,
            createdAt: item.createdAt || new Date().toISOString(),
          };
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch ideas from admin backend, using fallback:", err);
  }

  // Merge admin posts with all 57 MOCK_POSTS (preventing duplicate IDs)
  const existingIds = new Set(adminItems.map((i) => String(i.id)));
  const fallbackFormatted = MOCK_POSTS.filter((post) => !existingIds.has(String(post.id))).map((post) => {
    const districtName = getDistrictLabel(post.district) || post.district;
    const exactLoc = post.exactLocation || (post.area ? `${post.area}, ${districtName}` : `${districtName}, Bangladesh`);
    const profit = Math.max(0, (post.retailSellPrice ?? post.retailPrice) - post.wholesalePrice);

    return {
      _id: post.id,
      id: post.id,
      title: post.title,
      category: post.category,
      division: post.division,
      district: districtName,
      area: post.area,
      exactLocation: exactLoc,
      wholesalePrice: post.wholesalePrice,
      retailPrice: post.retailPrice,
      retailSellPrice: post.retailSellPrice ?? post.retailPrice,
      profit,
      profitPotential: post.profitPotential,
      description: post.description,
      image: post.image,
      tags: post.tags,
      author: typeof post.author === "string" ? post.author : post.author?.name || "সোর্সিং প্রতিনিধি",
      likesCount: post.likesCount,
      viewsCount: post.viewsCount,
      createdAt: post.createdAt,
    };
  });

  const combined = [...adminItems, ...fallbackFormatted];

  return NextResponse.json({
    success: true,
    count: combined.length,
    data: combined,
  });
}
