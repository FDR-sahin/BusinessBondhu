import { NextResponse } from "next/server";
import { getDistrictLabel } from "@/lib/bd-data";
import { MOCK_POSTS } from "@/lib/mock-data";
import { deleteUserPost, findUserPost, getUserPosts, saveUserPost } from "@/lib/user-posts-store";
import type { PostDetail } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const decodedId = decodeURIComponent(params.id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  // 1. Check uddok-admin backend first for live post data (real likes, dislikes, comments)
  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?id=${encodeURIComponent(decodedId)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const result = await res.json();
      const list = Array.isArray(result.data) ? result.data : [result.data];
      const item = list.find((i: any) => String(i.id || i._id) === decodedId);

      if (item) {
        const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
        const exactLoc =
          item.exactLocation ||
          (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);
        const wholesalePrice = Number(item.wholesalePrice || 0);
        const wholesalePriceMax = item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined;
        const wholesalePriceText = item.wholesalePriceText || (wholesalePriceMax ? `${wholesalePrice}-${wholesalePriceMax}` : undefined);
        const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);
        const retailPriceMax = item.retailPriceMax ? Number(item.retailPriceMax) : undefined;
        const retailPriceText = item.retailPriceText || (retailPriceMax ? `${retailPrice}-${retailPriceMax}` : undefined);

        const post: PostDetail = {
          id: String(item.id || item._id),
          title: item.title,
          category: item.category || "agriculture-livestock",
          division: item.division || "Dhaka",
          district: districtName,
          area: item.upazilaOrArea || item.area || districtName,
          exactLocation: exactLoc,
          wholesalePrice,
          wholesalePriceMax,
          wholesalePriceText,
          retailPrice,
          retailPriceMax,
          retailPriceText,
          retailSellPrice: retailPrice,
          profitPotential: item.profitPotential || (retailPrice - wholesalePrice > 100 ? "high" : "medium"),
          description: item.description || "উৎপাদন ও সোর্সিং সংক্রান্ত বিস্তারিত তথ্য।",
          image: item.image || "/images/ideas/default.jpg",
          tags: item.tags || [`#${districtName}`, `#${item.category}`],
          author: {
            id: item.userId || "u-admin",
            name: typeof item.author === "string" ? item.author : item.author?.name || item.postedBy?.name || "উদ্যোক্তা অ্যাডমিন",
            avatar: "/images/avatars/default.jpg",
          },
          likesCount: typeof item.likes === "number" ? item.likes : item.likesCount || 0,
          dislikesCount: typeof item.dislikes === "number" ? item.dislikes : item.dislikesCount || 0,
          viewsCount: item.viewsCount || 15,
          commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
          createdAt: item.createdAt || new Date().toISOString(),
        };

        return NextResponse.json(post);
      }
    }
  } catch (err) {
    console.error("Failed to fetch post detail from backend:", err);
  }

  // 2. Check local user store
  const localPost = findUserPost(decodedId);
  if (localPost) {
    return NextResponse.json(localPost);
  }

  // 3. Check MOCK_POSTS
  const mockFound = MOCK_POSTS.find((p) => String(p.id) === decodedId);
  if (mockFound) {
    const districtName = getDistrictLabel(mockFound.district) || mockFound.district;
    const exactLoc = mockFound.exactLocation || (mockFound.area ? `${mockFound.area}, ${districtName}` : `${districtName}, Bangladesh`);

    return NextResponse.json({
      ...mockFound,
      district: districtName,
      exactLocation: exactLoc,
    });
  }

  return NextResponse.json({ message: "Post not found" }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const decodedId = decodeURIComponent(params.id);
  const body = await request.json();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  try {
    await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?id=${encodeURIComponent(decodedId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.warn("Backend update error:", err);
  }

  const existing = findUserPost(decodedId);
  if (existing) {
    const updated = saveUserPost({ ...existing, ...body });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ success: true, message: "Post updated" });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const decodedId = decodeURIComponent(params.id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  try {
    await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?id=${encodeURIComponent(decodedId)}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Backend delete error:", err);
  }

  deleteUserPost(decodedId);
  return NextResponse.json({ success: true, message: "Post deleted" });
}
