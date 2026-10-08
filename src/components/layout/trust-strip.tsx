"use client";

import { useT } from "@/lib/i18n";

export function TrustStrip() {
  const t = useT();

  return (
    <div className="h-[28px] w-full border-b border-line bg-transparent">
      <div className="container-page flex h-full items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted sm:gap-3">
        <span>{t("trustStripFree")}</span>
        <span className="text-muted/60 select-none">·</span>
        <span>{t("trustStripModerated")}</span>
        <span className="text-muted/60 select-none">·</span>
        <span>{t("trustStripDistricts")}</span>
      </div>
    </div>
  );
}
