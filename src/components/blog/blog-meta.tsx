import { Clock } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { formatDateBn, toBanglaNumber } from "@/lib/utils";
import type { PostAuthor } from "@/types";

export function BlogMeta({ author, date, readingTime }: { author: PostAuthor; date: string; readingTime?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-secondary">
      <span className="flex items-center gap-2">
        <UserAvatar name={author.name} src={author.avatar} className="h-7 w-7" />
        <span className="font-medium text-foreground">{author.name}</span>
      </span>
      <time dateTime={date} suppressHydrationWarning>{formatDateBn(date)}</time>
      {readingTime ? (
        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden />পড়তে {toBanglaNumber(readingTime)} মিনিট</span>
      ) : null}
    </div>
  );
}
