import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PostDetailView } from "@/components/post/post-detail-view";
import { MOCK_POSTS } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";
import type { PostDetail } from "@/types";

interface PageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

/**
 * Server-side fetch (cached 60s). Direct zero-latency resolution from MOCK_POSTS
 * with fallback to external API for admin created posts.
 */
const getPost = cache(async (id: string): Promise<{ post: PostDetail | null; missing: boolean }> => {
  const decodedId = decodeURIComponent(id);
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

  const base = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/ideas`, { cache: "no-store" });
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const item = result.data.find((i: any) => String(i._id) === decodedId || String(i.id) === decodedId);
        if (item) {
          const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
          const exactLoc =
            item.exactLocation ||
            (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);
          const wholesalePrice = Number(item.wholesalePrice || 0);
          const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);

          return {
            post: {
              id: String(item.id || item._id),
              _id: String(item._id || item.id),
              title: item.title,
              category: item.category || "agriculture-livestock",
              division: item.division || "Dhaka",
              district: districtName,
              area: item.upazilaOrArea || item.area || districtName,
              exactLocation: exactLoc,
              wholesalePrice,
              retailPrice,
              retailSellPrice: retailPrice,
              profitPotential: item.profitPotential || (retailPrice - wholesalePrice > 100 ? "high" : "medium"),
              description: item.description || "উৎপাদন ও সোর্সিং সংক্রান্ত বিস্তারিত তথ্য।",
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
            } as PostDetail,
            missing: false,
          };
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch post detail:", err);
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
