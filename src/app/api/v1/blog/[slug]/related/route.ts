import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const decodedSlug = decodeURIComponent(slug);

  const related = DETAILED_BLOG_POSTS.filter(
    (b) => b.slug !== slug && b.slug !== decodedSlug && b.id !== slug
  ).slice(0, 3);

  return NextResponse.json(related);
}
