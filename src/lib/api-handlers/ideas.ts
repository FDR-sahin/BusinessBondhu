import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { BusinessIdeaModel } from "@/lib/models";
import { MOCK_POSTS } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";

export async function handleIdeasGet() {
  let dbItems: any[] = [];

  try {
    await connectToDatabase();
    const ideas = await BusinessIdeaModel.find({
      status: "approved",
    }).sort({ _id: -1 }).lean();

    if (Array.isArray(ideas) && ideas.length > 0) {
      dbItems = ideas
        .filter(
          (item: any) =>
            !item.isBlog &&
            !item.isUserAccount &&
            item.status !== "user_account" &&
            !(typeof item.title === "string" && item.title.startsWith("[ইউজার]"))
        )
        .map((item: any) => {
          const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
          const exactLoc =
            item.exactLocation ||
            (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);
          const wholesalePrice = Number(item.wholesalePrice || 0);
          const wholesalePriceMax = item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined;
          const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);
          const retailPriceMax = item.retailPriceMax ? Number(item.retailPriceMax) : undefined;
          const profit = Math.max(0, retailPrice - wholesalePrice);

          const ideaId = String(item._id || item.id || item.customId);

          return {
            _id: ideaId,
            id: ideaId,
            customId: item.customId || ideaId,
            title: item.title,
            category: item.category || "agriculture-livestock",
            division: item.division || "Dhaka",
            district: districtName,
            area: item.upazilaOrArea || item.area || districtName,
            exactLocation: exactLoc,
            wholesalePrice,
            wholesalePriceMax,
            wholesalePriceText: item.wholesalePriceText,
            retailPrice,
            retailPriceMax,
            retailPriceText: item.retailPriceText,
            retailSellPrice: retailPrice,
            profit,
            profitPotential: item.profitPotential || (profit > 100 ? "high" : profit > 30 ? "medium" : "low"),
            description: item.description || "",
            image: item.image || "/images/ideas/default.jpg",
            tags: item.tags || [`#${districtName}`, `#${item.category}`],
            author: typeof item.author === "string" ? item.author : item.author?.name || item.postedBy?.name || "উদ্যোক্তা অ্যাডমিন",
            likesCount: item.likesCount ?? item.likes ?? 0,
            viewsCount: item.viewsCount ?? 15,
            status: item.status || "approved",
            createdAt: item.createdAt || new Date().toISOString(),
          };
        });
    }
  } catch (err) {
    console.error("Failed to fetch ideas directly from MongoDB:", err);
  }

  // Merge dbItems with any non-overlapping MOCK_POSTS
  const existingIds = new Set(dbItems.map((i) => String(i.id)));
  const existingTitles = new Set(dbItems.map((i) => (i.title || "").trim().toLowerCase()));

  const fallbackFormatted = MOCK_POSTS.filter((post) => !existingIds.has(String(post.id)) && !existingTitles.has((post.title || "").trim().toLowerCase())).map((post) => {
    const districtName = getDistrictLabel(post.district) || post.district;
    const exactLoc = post.exactLocation || (post.area ? `${post.area}, ${districtName}` : `${districtName}, Bangladesh`);
    const profit = Math.max(0, (post.retailSellPrice ?? post.retailPrice) - post.wholesalePrice);

    return {
      _id: post.id,
      id: post.id,
      customId: post.id,
      title: post.title,
      category: post.category,
      division: post.division,
      district: districtName,
      area: post.area,
      exactLocation: exactLoc,
      wholesalePrice: post.wholesalePrice,
      wholesalePriceMax: post.wholesalePriceMax,
      wholesalePriceText: post.wholesalePriceText,
      retailPrice: post.retailPrice,
      retailPriceMax: post.retailPriceMax,
      retailPriceText: post.retailPriceText,
      retailSellPrice: post.retailSellPrice ?? post.retailPrice,
      profit,
      profitPotential: post.profitPotential,
      description: post.description,
      image: post.image,
      tags: post.tags,
      author: typeof post.author === "string" ? post.author : post.author?.name || "সোর্সিং প্রতিনিধি",
      likesCount: post.likesCount,
      viewsCount: post.viewsCount,
      status: "approved",
      createdAt: post.createdAt,
    };
  });

  const combined = dbItems.length > 0 ? dbItems : fallbackFormatted;

  return NextResponse.json({
    success: true,
    count: combined.length,
    data: combined,
  });
}
