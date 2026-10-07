"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { IMAGE_TYPES, MAX_IMAGE_MB, uploadImage } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange: (url?: string) => void;
  onBusyChange?: (busy: boolean) => void;
}

/** Drag & drop (or click / keyboard) -> instant preview -> uploads to Cloudinary with a progress bar. */
export function ImageUploader({ value, onChange, onBusyChange }: ImageUploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Free the temporary preview URL when it changes / on unmount.
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  async function handleFile(file?: File) {
    if (!file) return;
    setError(null);
    if (!IMAGE_TYPES.includes(file.type)) return setError("শুধু JPG, PNG বা WebP ছবি দেওয়া যাবে।");
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return setError(`ছবির আকার সর্বোচ্চ ${MAX_IMAGE_MB} এমবি হতে পারবে।`);

    setPreview(URL.createObjectURL(file));
    setProgress(0);
    onBusyChange?.(true);
    try {
      onChange(await uploadImage(file, setProgress));
      setPreview(null); // the uploaded URL takes over
    } catch (e) {
      setError(e instanceof Error ? e.message : "ছবি আপলোড করা যায়নি।");
      setPreview(null);
    } finally {
      setProgress(null);
      onBusyChange?.(false);
      if (input.current) input.current.value = ""; // allow picking the same file again
    }
  }

  const shown = preview ?? value;
  const uploading = progress !== null;

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    void handleFile(e.dataTransfer.files[0]);
  }
  const onKey = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.current?.click(); } };

  return (
    <div className="space-y-2">
      <input ref={input} type="file" accept={IMAGE_TYPES.join(",")} className="sr-only" tabIndex={-1} onChange={(e) => void handleFile(e.target.files?.[0])} aria-label="ছবি বেছে নিন" />

      {shown ? (
        <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shown} alt="নির্বাচিত ছবির প্রিভিউ" className="h-full w-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-sm" role="status">
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
              <div className="h-2 w-2/3 overflow-hidden rounded-full bg-border" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress ?? 0} aria-label="আপলোড হচ্ছে">
                <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          {!uploading && (
            <Button type="button" variant="secondary" size="sm" className="absolute right-3 top-3" onClick={() => onChange(undefined)}><Trash2 aria-hidden /> সরান</Button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => input.current?.click()}
          onKeyDown={onKey}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn("flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 text-center transition-colors", dragging ? "border-primary bg-primary-soft" : "border-border bg-surface hover:bg-muted")}
        >
          <ImagePlus className="h-8 w-8 text-ink-secondary" aria-hidden />
          <p className="font-medium">ছবি এখানে টেনে আনুন অথবা ক্লিক করুন</p>
          <p className="text-sm text-ink-secondary">JPG, PNG বা WebP · সর্বোচ্চ {MAX_IMAGE_MB} এমবি</p>
        </div>
      )}

      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    </div>
  );
}
