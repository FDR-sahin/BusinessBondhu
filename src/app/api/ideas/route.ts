import { NextResponse } from "next/server";
import { MOCK_POSTS } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";

export async function GET() {
  const data = MOCK_POSTS.map((post) => {
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
    count: data.length,
    data,
  });
}
