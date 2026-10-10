import { NextResponse } from "next/server";
import { MOCK_POSTS } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";
import { deleteUserPost, findUserPost, getUserPosts, saveUserPost } from "@/lib/user-posts-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  // 0. Search in locally submitted user posts first
  const userPost = findUserPost(id);
  if (userPost) {
    const districtName = (userPost.district ? getDistrictLabel(userPost.district) : undefined) || userPost.district || "ঢাকা";
    const exactLoc = userPost.exactLocation || (userPost.area ? `${userPost.area}, ${districtName}` : `${districtName}, Bangladesh`);

    return NextResponse.json({
      ...userPost,
      id: String(userPost.id),
      _id: String(userPost.id),
      district: districtName,
      exactLocation: exactLoc,
      description: userPost.description || "সোর্সিং ও পয়েন্ট সংক্রান্ত বিস্তারিত বিবরণ।",
      tags: userPost.tags || ["ব্যবসা", "উদ্যোক্তা", "পাইকারি_দাম", "বাংলাদেশ"],
      author: {
        id: userPost.author?.id || "u-me",
        name: userPost.author?.name || "উদ্যোক্তা ব্যবহারকারী",
        avatar: userPost.author?.avatar || "/images/avatars/default.jpg",
      },
    });
  }

  // 1. Search in local MOCK_POSTS next
  const mockFound = MOCK_POSTS.find((p) => String(p.id) === id || String((p as any)._id) === id);
  if (mockFound) {
    const districtName = getDistrictLabel(mockFound.district) || mockFound.district;
    const exactLoc = mockFound.exactLocation || (mockFound.area ? `${mockFound.area}, ${districtName}` : `${districtName}, Bangladesh`);

    return NextResponse.json({
      ...mockFound,
      id: String(mockFound.id),
      _id: String(mockFound.id),
      district: districtName,
      exactLocation: exactLoc,
      description: mockFound.description || "উৎপাদন ও সোর্সিং সংক্রান্ত সকল বিস্তারিত তথ্য।",
      tags: mockFound.tags || ["ব্যবসা", "উদ্যোক্তা", "পাইকারি_দাম", "বাংলাদেশ"],
      author: {
        id: mockFound.author?.id || "u-admin",
        name: typeof mockFound.author === "string" ? mockFound.author : mockFound.author?.name || "সোর্সিং প্রতিনিধি",
        avatar: "/images/avatars/default.jpg",
      },
    });
  }

  // 2. Fetch from backend admin API for dynamic posts created by admin
  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const item = result.data.find((i: any) => String(i._id) === id || String(i.id) === id);
        if (item) {
          const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
          const exactLoc =
            item.exactLocation ||
            (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);
          const wholesalePrice = Number(item.wholesalePrice || 0);
          const wholesalePriceMax = item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined;
          const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);
          const retailPriceMax = item.retailPriceMax ? Number(item.retailPriceMax) : undefined;

          return NextResponse.json({
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
            wholesalePriceMax,
            wholesalePriceText: item.wholesalePriceText,
            retailPrice,
            retailPriceMax,
            retailPriceText: item.retailPriceText,
            retailSellPrice: retailPrice,
            profitPotential: item.profitPotential || (retailPrice - wholesalePrice > 100 ? "high" : "medium"),
            description: item.description || "পাইকারি সোর্সিং ও পয়েন্ট সংক্রান্ত বিস্তারিত বিবরণ।",
            image: item.image || "/images/ideas/default.jpg",
            tags: item.tags || [`#${districtName}`, `#${item.category}`],
            author: {
              id: "u-admin",
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
          });
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch post detail from backend:", err);
  }

  return NextResponse.json({ message: "Post not found" }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = decodeURIComponent(params.id);
    const body = await request.json();
    const existing = findUserPost(id);
    if (!existing) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const wMin = Number(body.wholesalePrice || 0);
    const wMax = body.wholesalePriceMax !== undefined && body.wholesalePriceMax !== null && String(body.wholesalePriceMax).trim() !== ""
      ? Number(body.wholesalePriceMax)
      : undefined;
    const rMin = Number(body.retailPrice || body.retailSellPrice || 0);
    const rMax = body.retailPriceMax !== undefined && body.retailPriceMax !== null && String(body.retailPriceMax).trim() !== ""
      ? Number(body.retailPriceMax)
      : undefined;

    const wholesalePriceText = (wMax && wMax > wMin) ? `${wMin}-${wMax}` : String(wMin);
    const retailPriceText = (rMax && rMax > rMin) ? `${rMin}-${rMax}` : String(rMin);

    const updated = saveUserPost({
      ...existing,
      ...body,
      wholesalePrice: wMin,
      wholesalePriceMax: wMax,
      wholesalePriceText,
      retailPrice: rMin,
      retailPriceMax: rMax,
      retailPriceText,
      retailSellPrice: rMin,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  deleteUserPost(id);
  return NextResponse.json({ success: true, message: "Deleted" });
}
