import { NextResponse } from "next/server";
import { MOCK_POSTS } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const data = result.data.map((item: any) => {
          const districtName = getDistrictLabel(item.district) || item.district;
          const exactLoc =
            item.exactLocation ||
            (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);
          const wholesalePrice = Number(item.wholesalePrice || 0);
          const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);
          const profit = Math.max(0, retailPrice - wholesalePrice);

          return {
            _id: item._id || item.id,
            id: item.id || item._id,
            title: item.title,
            category: item.category,
            division: item.division || "Dhaka",
            district: districtName,
            area: item.upazilaOrArea || item.area,
            exactLocation: exactLoc,
            wholesalePrice,
            retailPrice,
            retailSellPrice: retailPrice,
            profit,
            profitPotential: item.profitPotential || `৳${profit} লাভ / unit`,
            description: item.description || "",
            image: item.image || "/images/ideas/default.jpg",
            tags: item.tags || [`#${districtName}`, `#${item.category}`],
            author: item.author || "উদ্যোক্তা অ্যাডমিন",
            likesCount: item.likesCount ?? item.likes ?? 0,
            viewsCount: item.viewsCount ?? 15,
            createdAt: item.createdAt || new Date().toISOString(),
          };
        });

        return NextResponse.json({
          success: true,
          count: data.length,
          data,
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch ideas from admin backend, falling back to mock:", err);
  }

  // Fallback if backend server is not running
  const fallbackData = MOCK_POSTS.map((post) => {
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
      author: post.author,
      likesCount: post.likesCount,
      viewsCount: post.viewsCount,
      createdAt: post.createdAt,
    };
  });

  return NextResponse.json({
    success: true,
    count: fallbackData.length,
    data: fallbackData,
  });
}
