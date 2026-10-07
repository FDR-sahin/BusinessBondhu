"use client";

import { useT } from "@/lib/i18n";

export function TrustStrip() {
  const t = useT();

  return (
    <div className="h-[28px] w-full border-b border-line bg-surface/90 text-center backdrop-blur-sm">
      <div className="container-page flex h-full items-center justify-center gap-2.5 text-[11px] font-mono uppercase tracking-widest text-ink/70 sm:gap-4">
        <span>{t("trustStripFree")}</span>
        <span className="text-pen select-none">•</span>
        <span>{t("trustStripModerated")}</span>
        <span className="text-pen select-none">•</span>
        <span>{t("trustStripDistricts")}</span>
      </div>
    </div>
  );
}
