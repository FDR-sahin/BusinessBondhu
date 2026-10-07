"use client";

import { Copy, Facebook, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ShareMenu({ title }: { title: string }) {
  const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
  const pageUrl = () => window.location.href;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl());
      toast.success("লিংক কপি হয়েছে");
    } catch {
      toast.error("লিংক কপি করা যায়নি");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"><Share2 aria-hidden /> শেয়ার</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => void copyLink()}><Copy />লিংক কপি করুন</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl())}`)}>
          <Facebook />ফেসবুকে শেয়ার
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => open(`https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl()}`)}`)}>
          <MessageCircle />হোয়াটসঅ্যাপে শেয়ার
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
