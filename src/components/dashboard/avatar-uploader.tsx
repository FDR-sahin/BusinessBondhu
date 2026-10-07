"use client";

import { Camera, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IMAGE_TYPES, MAX_IMAGE_MB, uploadImage } from "@/lib/cloudinary";

interface AvatarUploaderProps {
  name?: string;
  value?: string;
  onChange: (url?: string) => void;
  onBusyChange?: (busy: boolean) => void;
}

export function AvatarUploader({ name, value, onChange, onBusyChange }: AvatarUploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pick(file?: File) {
    if (!file) return;
    setError(null);
    if (!IMAGE_TYPES.includes(file.type)) return setError("শুধু JPG, PNG বা WebP ছবি দেওয়া যাবে।");
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return setError(`ছবির আকার সর্বোচ্চ ${MAX_IMAGE_MB} এমবি হতে পারবে।`);

    setProgress(0);
    onBusyChange?.(true);
    try {
      onChange(await uploadImage(file, setProgress, "avatars"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "ছবি আপলোড করা যায়নি।");
    } finally {
      setProgress(null);
      onBusyChange?.(false);
      if (input.current) input.current.value = "";
    }
  }

  const busy = progress !== null;

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="relative">
        <UserAvatar name={name} src={value} className="h-24 w-24 text-2xl" />
        {busy && (
          <span role="status" className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70 backdrop-blur-sm">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden /><span className="sr-only">আপলোড হচ্ছে {progress}%</span>
          </span>
        )}
      </div>
      <div className="space-y-2">
        <input ref={input} type="file" accept={IMAGE_TYPES.join(",")} className="sr-only" tabIndex={-1} aria-label="প্রোফাইল ছবি বেছে নিন" onChange={(e) => void pick(e.target.files?.[0])} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => input.current?.click()}><Camera aria-hidden />{value ? "ছবি বদলান" : "ছবি আপলোড করুন"}</Button>
          {value && !busy && <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}><Trash2 aria-hidden />সরান</Button>}
        </div>
        <p className="text-sm text-ink-secondary">{busy ? `আপলোড হচ্ছে… ${progress}%` : `JPG, PNG বা WebP · সর্বোচ্চ ${MAX_IMAGE_MB} এমবি`}</p>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      </div>
    </div>
  );
}
