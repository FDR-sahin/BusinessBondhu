"use client";

import { Copy, Facebook, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Inline share row for articles (Facebook, WhatsApp, copy link). */
export function ShareButtons({ title }: { title: string }) {
  const url = () => window.location.href;
  const open = (u: string) => window.open(u, "_blank", "noopener,noreferrer");

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      toast.success("লিংক কপি হয়েছে");
    } catch {
      toast.error("লিংক কপি করা যায়নি");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="শেয়ার করুন">
      <Button variant="outline" size="sm" onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`)}><Facebook aria-hidden /> ফেসবুক</Button>
      <Button variant="outline" size="sm" onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`)}><MessageCircle aria-hidden /> হোয়াটসঅ্যাপ</Button>
      <Button variant="outline" size="sm" onClick={() => void copy()}><Copy aria-hidden /> লিংক কপি</Button>
    </div>
  );
}
