import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PostDetailView } from "@/components/post/post-detail-view";
import { MOCK_POSTS } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";
import { findUserPost } from "@/lib/user-posts-store";
import { connectToDatabase } from "@/lib/db";
import { BusinessIdeaModel } from "@/lib/models";
import { getQueryForId } from "@/lib/api-handlers/posts";
import type { PostDetail } from "@/types";

interface PageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

/**
 * Server-side fetch (cached 60s). Direct query from MongoDB database
 * with fallback to local MOCK_POSTS.
 */
const getPost = cache(async (id: string): Promise<{ post: PostDetail | null; missing: boolean }> => {
  const decodedId = decodeURIComponent(id);

  // 1. Direct MongoDB Database query
  try {
    await connectToDatabase();
    const query = getQueryForId(decodedId);
    const item = await BusinessIdeaModel.findOne(query).lean();
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

      return {
        post: {
          id: String(item._id || item.id || item.customId),
          _id: String(item._id || item.id || item.customId),
          customId: item.customId,
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
            avatar: item.author?.avatar || "/images/avatars/default.jpg",
          },
          likesCount: typeof item.likes === "number" ? item.likes : item.likesCount || 0,
          dislikesCount: typeof item.dislikes === "number" ? item.dislikes : item.dislikesCount || 0,
          viewsCount: item.viewsCount || 15,
          commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
          createdAt: item.createdAt || new Date().toISOString(),
        } as PostDetail,
        missing: false,
      };
    }
  } catch (err) {
    console.error("Direct MongoDB query error in getPost:", err);
  }

  // 2. Check local user store
  const localPost = findUserPost(decodedId);
  if (localPost) {
    const districtName = (localPost.district ? getDistrictLabel(localPost.district) : undefined) || localPost.district || "ঢাকা";
    const exactLoc = localPost.exactLocation || `${districtName}, Bangladesh`;
    return {
      post: {
        ...localPost,
        id: String(localPost.id),
        _id: String(localPost.id),
        district: districtName,
        exactLocation: exactLoc,
        retailSellPrice: localPost.retailSellPrice ?? localPost.retailPrice,
        profitPotential: (localPost.profitPotential || "medium") as any,
        tags: localPost.tags || [],
        author: {
          id: localPost.author?.id || "user",
          name: localPost.author?.name || "উদ্যোক্তা",
          avatar: "/images/avatars/default.jpg",
        },
        likesCount: localPost.likesCount || 0,
        dislikesCount: localPost.dislikesCount || 0,
        viewsCount: localPost.viewsCount || 1,
        commentsCount: localPost.commentsCount || 0,
      } as PostDetail,
      missing: false,
    };
  }

  // 3. Fallback to local MOCK_POSTS if backend doesn't have it
  const localFound = MOCK_POSTS.find((p) => String(p.id) === decodedId || String((p as any)._id) === decodedId);
  if (localFound) {
    const districtName = getDistrictLabel(localFound.district) || localFound.district;
    const exactLoc = localFound.exactLocation || (localFound.area ? `${localFound.area}, ${districtName}` : `${districtName}, Bangladesh`);

    return {
      post: {
        ...localFound,
        id: String(localFound.id),
        _id: String(localFound.id),
        district: districtName,
        exactLocation: exactLoc,
        wholesalePrice: localFound.wholesalePrice,
        wholesalePriceMax: localFound.wholesalePriceMax,
        wholesalePriceText: localFound.wholesalePriceText,
        retailPrice: localFound.retailSellPrice ?? localFound.retailPrice,
        retailPriceMax: localFound.retailPriceMax,
        retailPriceText: localFound.retailPriceText,
        description: localFound.description || "উৎপাদন ও সোর্সিং সংক্রান্ত বিস্তারিত তথ্য।",
        tags: localFound.tags || ["ব্যবসা", "উদ্যোক্তা", "পাইকারি_দাম"],
        author: {
          id: localFound.author?.id || "u-admin",
          name: typeof localFound.author === "string" ? localFound.author : localFound.author?.name || "সোর্সিং প্রতিনিধি",
          avatar: "/images/avatars/default.jpg",
        },
      } as PostDetail,
      missing: false,
    };
  }

  return { post: null, missing: true };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { post } = await getPost(params.id);
  if (!post) return { title: "পোস্ট | বিজনেস বন্ধু" };

  const description = post.description.replace(/\s+/g, " ").slice(0, 160);
  return {
    title: `${post.title} | বিজনেস বন্ধু`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { post, missing } = await getPost(params.id);
  if (missing || !post) notFound();
  return <PostDetailView id={params.id} initialPost={post} />;
}
