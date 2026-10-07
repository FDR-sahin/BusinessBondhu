"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold md:text-4xl">কিছু একটা ভুল হয়েছে</h1>
      <p className="max-w-md text-ink-secondary">
        পেজটি লোড করতে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  );
}
