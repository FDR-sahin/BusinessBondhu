import { NextResponse } from "next/server";
import { getMockPaginatedPosts, MOCK_POSTS } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";
import { getUserPosts, saveUserPost, type UserStoredPost } from "@/lib/user-posts-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  let adminItems: any[] = [];

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?status=approved`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        adminItems = result.data
          .filter((item: any) => !item.status || item.status === "approved")
          .map((item: any) => {
          const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
          const exactLoc =
            item.exactLocation ||
            (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);
          const wholesalePrice = Number(item.wholesalePrice || 0);
          const wholesalePriceMax = item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined;
          const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);
          const retailPriceMax = item.retailPriceMax ? Number(item.retailPriceMax) : undefined;

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
            wholesalePriceMax,
            wholesalePriceText: item.wholesalePriceText,
            retailPrice,
            retailPriceMax,
            retailPriceText: item.retailPriceText,
            retailSellPrice: retailPrice,
            profitPotential: item.profitPotential || (retailPrice - wholesalePrice > 100 ? "high" : "medium"),
            description: item.description || "",
            image: item.image || "/images/ideas/default.jpg",
            tags: item.tags || [`#${districtName}`, `#${item.category}`],
            author: {
              name: typeof item.author === "string" ? item.author : item.author?.name || item.postedBy?.name || "ব্যবসা বন্ধু",
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
      wholesalePriceMax: post.wholesalePriceMax,
      wholesalePriceText: post.wholesalePriceText,
      retailPrice,
      retailPriceMax: post.retailPriceMax,
      retailPriceText: post.retailPriceText,
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

  // Merge with locally stored user posts if approved
  const userStored = getUserPosts()
    .filter((p) => p.status === "approved")
    .map((p) => ({
      id: String(p.id),
      _id: String(p.id),
      title: p.title,
      slug: (p.title || "").toLowerCase().replace(/\s+/g, "-"),
      category: p.category || "general",
      division: p.division || "Dhaka",
      district: (p.district ? getDistrictLabel(p.district) : undefined) || p.district || "ঢাকা",
      area: p.area || "",
      exactLocation: p.exactLocation || `${p.district || "ঢাকা"}, Bangladesh`,
      wholesalePrice: Number(p.wholesalePrice || 0),
      wholesalePriceMax: p.wholesalePriceMax ? Number(p.wholesalePriceMax) : undefined,
      wholesalePriceText: p.wholesalePriceText,
      retailPrice: Number(p.retailPrice || 0),
      retailPriceMax: p.retailPriceMax ? Number(p.retailPriceMax) : undefined,
      retailPriceText: p.retailPriceText,
      retailSellPrice: Number(p.retailSellPrice || p.retailPrice || 0),
      profitPotential: p.profitPotential || "medium",
      description: p.description || "",
      image: p.image || "/images/ideas/default.jpg",
      tags: p.tags || [],
      author: {
        name: p.author?.name || "ব্যবহারকারী",
        avatar: p.author?.avatar || "/images/avatars/default.jpg",
      },
      likesCount: p.likesCount || 0,
      dislikesCount: p.dislikesCount || 0,
      viewsCount: p.viewsCount || 1,
      commentsCount: p.commentsCount || 0,
      createdAt: p.createdAt,
      status: p.status,
      isVerified: p.isVerified ?? false,
    }));

  let items = [...userStored, ...adminItems, ...fallbackItems];

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

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

    const postRecord: UserStoredPost = {
      id: `post-${Date.now()}`,
      title: body.title || "শিরোনামহীন খসড়া",
      category: body.category || "general",
      division: body.division || "Dhaka",
      district: body.district || "ঢাকা",
      area: body.area || "",
      exactLocation: body.exactLocation || `${body.district || "ঢাকা"}, Bangladesh`,
      wholesalePrice: wMin,
      wholesalePriceMax: wMax,
      wholesalePriceText,
      retailPrice: rMin,
      retailPriceMax: rMax,
      retailPriceText,
      retailSellPrice: rMin,
      profitPotential: body.profitPotential || "medium",
      description: body.description || "",
      image: body.image || "/images/ideas/default.jpg",
      tags: body.tags || [],
      status: body.status === "draft" ? "draft" : "pending",
      userId: body.userId || undefined,
      authorEmail: body.authorEmail || undefined,
      author: {
        id: body.userId || undefined,
        name: body.authorName || "ব্যবহারকারী",
        avatar: "/images/avatars/default.jpg",
      },
      likesCount: 0,
      dislikesCount: 0,
      viewsCount: 1,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      isVerified: false,
    };

    // Forward to uddok-admin backend /api/ideas if it's a published/pending post
    if (postRecord.status === "pending") {
      try {
        const backendRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: postRecord.title,
            category: postRecord.category,
            district: postRecord.district,
            exactLocation: postRecord.exactLocation,
            wholesalePrice: wMin,
            wholesalePriceMax: wMax,
            wholesalePriceText,
            retailPrice: rMin,
            retailPriceMax: rMax,
            retailPriceText,
            description: postRecord.description,
            status: "pending",
            userId: body.userId || "",
            authorEmail: body.authorEmail || "",
            isVerified: false,
            postedBy: {
              name: body.authorName || "ব্যবহারকারী",
              role: "ব্যবহারকারী",
              email: body.authorEmail || "",
              isVerifiedUser: false,
            },
          }),
        });
        if (backendRes.ok) {
          const backendData = await backendRes.json();
          if (backendData.data?._id || backendData.data?.id) {
            postRecord.id = String(backendData.data._id || backendData.data.id);
            postRecord._id = String(backendData.data._id || backendData.data.id);
          }
        }
      } catch (err) {
        console.warn("Could not forward to backend API, saved locally:", err);
      }
    }

    // Always persist in local user posts store (drafts + pending posts)
    saveUserPost(postRecord);

    return NextResponse.json({ success: true, post: postRecord, id: postRecord.id }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ success: false, message: error?.message || "পোস্ট তৈরি করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
