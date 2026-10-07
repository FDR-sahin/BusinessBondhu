"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getDistrictLabel, getDivisionLabel } from "@/lib/bd-data";
import { getCategory } from "@/lib/constants";
import { formatBDT, timeAgoBn, toBanglaNumber } from "@/lib/utils";
import type { Post } from "@/types";

/**
 * Reusable everywhere (home, explore, likes, saved, related…).
 * NOTE: next/image only loads hosts whitelisted in next.config.js (images.remotePatterns).
 */
export function PostCard({ post }: { post: Post }) {
  const category = getCategory(post.category);
  const CategoryIcon = category?.icon;
  const location = [getDivisionLabel(post.division), getDistrictLabel(post.district), post.area].filter(Boolean).join(" → ");

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: "easeOut" }} className="group h-full">
      <Link
        href={`/post/${post.id}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md"
      >
        <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-muted">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
              className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/15 text-primary/60 dark:text-foreground/50">
              {CategoryIcon && <CategoryIcon className="h-10 w-10" aria-hidden />}
            </div>
          )}
          {category && (
            <Badge variant="overlay" className="absolute left-3 top-3">
              {category.nameBn}
            </Badge>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug md:text-xl">{post.title}</h3>

          <p className="flex items-start gap-1.5 text-sm text-ink-secondary">
            <MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden />
            <span className="line-clamp-1">{location}</span>
          </p>

          <p className="flex flex-wrap items-center gap-x-2 text-sm">
            <span>পাইকারি <strong className="font-semibold">{formatBDT(post.wholesalePrice)}</strong></span>
            <span aria-hidden className="text-border">|</span>
            <span>খুচরা <strong className="font-semibold">{formatBDT(post.retailPrice)}</strong></span>
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
            <div className="flex min-w-0 items-center gap-2">
              <UserAvatar name={post.author.name} src={post.author.avatar} className="h-8 w-8" />
              <div className="min-w-0 leading-tight">
                <p className="line-clamp-1 text-sm font-medium">{post.author.name}</p>
                <p className="text-sm text-ink-secondary">{timeAgoBn(post.createdAt)}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm text-ink-secondary">
              <span className="inline-flex items-center gap-1" aria-label={`${toBanglaNumber(post.likesCount)}টি লাইক`}>
                <Heart className="h-4 w-4" aria-hidden />{toBanglaNumber(post.likesCount)}
              </span>
              <span className="inline-flex items-center gap-1" aria-label={`${toBanglaNumber(post.commentsCount)}টি মন্তব্য`}>
                <MessageCircle className="h-4 w-4" aria-hidden />{toBanglaNumber(post.commentsCount)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
