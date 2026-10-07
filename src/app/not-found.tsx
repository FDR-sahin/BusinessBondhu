import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-medium text-secondary">৪০৪</p>
      <h1 className="text-2xl font-semibold md:text-4xl">পেজটি খুঁজে পাওয়া যায়নি</h1>
      <p className="max-w-md text-ink-secondary">
        আপনি যে লিংকটি খুঁজছেন সেটি সরানো হয়েছে অথবা ঠিকানাটি ভুল।
      </p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        হোমে ফিরে যান
      </Link>
    </div>
  );
}
