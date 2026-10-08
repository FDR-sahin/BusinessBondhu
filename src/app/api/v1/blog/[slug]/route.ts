import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const decodedSlug = decodeURIComponent(slug);
  const blog = DETAILED_BLOG_POSTS.find(
    (b) => b.slug === slug || b.slug === decodedSlug || b.id === slug || b.id === decodedSlug
  );

  if (!blog) {
    return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...blog,
    content: blog.content || `<p>${blog.excerpt}</p>`,
    commentsEnabled: true,
  });
}
