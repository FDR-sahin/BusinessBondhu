"use client";

import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getBlogCategory } from "@/lib/blog";
import type { BlogPost } from "@/types";
import { BlogMeta } from "./blog-meta";

export function BlogCard({ post }: { post: BlogPost }) {
  const category = getBlogCategory(post.category);
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: "easeOut" }} className="group h-full">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {post.coverImage ? (
            <Image src={post.coverImage} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/15 text-primary/60 dark:text-foreground/50"><Newspaper className="h-10 w-10" aria-hidden /></div>
          )}
          {category && <Badge variant="overlay" className="absolute left-3 top-3">{category.label}</Badge>}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug md:text-xl">{post.title}</h3>
          <p className="line-clamp-2 text-ink-secondary">{post.excerpt}</p>
          <div className="mt-auto pt-2"><BlogMeta author={post.author} date={post.publishedAt} readingTime={post.readingTime} /></div>
        </div>
      </Link>
    </motion.div>
  );
}

/** Large card for the top of /blog. */
export function FeaturedBlogCard({ post }: { post: BlogPost }) {
  const category = getBlogCategory(post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md lg:grid-cols-2">
      <div className="relative aspect-video overflow-hidden bg-muted lg:aspect-auto lg:min-h-[340px]">
        {post.coverImage ? (
          <Image src={post.coverImage} alt="" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/15 text-primary/60 dark:text-foreground/50"><Newspaper className="h-14 w-14" aria-hidden /></div>
        )}
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="px-3 py-1">বিশেষ লেখা</Badge>
          {category && <Badge variant="default" className="px-3 py-1">{category.label}</Badge>}
        </div>
        <h2 className="text-2xl font-semibold leading-snug md:text-4xl md:leading-snug">{post.title}</h2>
        <p className="line-clamp-3 text-ink-secondary">{post.excerpt}</p>
        <BlogMeta author={post.author} date={post.publishedAt} readingTime={post.readingTime} />
        <span className="text-sm font-medium text-link group-hover:underline">পুরো লেখাটি পড়ুন →</span>
      </div>
    </Link>
  );
}
