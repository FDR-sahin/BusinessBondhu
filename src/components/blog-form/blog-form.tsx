"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, Eye, FileText, Image as ImageIcon, Info, Layers, PenTool, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCreateBlog, type CreateBlogInput } from "@/hooks/use-blog";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { parseRichBlogText } from "@/lib/blog-formatter";
import { sanitizeContent } from "@/lib/sanitize";
import { useAuthStore } from "@/store/auth-store";
import { useLangStore } from "@/store/lang-store";

const PRESET_COVERS = [
  { label: "ব্যবসা ও ট্রেড", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" },
  { label: "খুচরা ও শপ", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80" },
  { label: "কৃষি ও খামার", url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80" },
  { label: "ডিজিটাল ও এফ-কমার্স", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" },
  { label: "স্টার্টআপ ও প্ল্যানিং", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" },
];

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card className="space-y-5 p-6 border-line bg-surface shadow-xs">
      <div>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {children}
    </Card>
  );
}

export function BlogForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const lang = useLangStore((s) => s.lang);
  const isEn = lang === "en";

  const createBlog = useCreateBlog();

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(BLOG_CATEGORIES[0]?.slug ?? "business-plan");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [authorTitle, setAuthorTitle] = useState("উদ্যোক্তা ও লেখক");
  const [customCoverUrl, setCustomCoverUrl] = useState("");

  // Reading time calculation: ~150 words per min
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const calculatedReadMins = Math.max(2, Math.ceil(wordCount / 120));

  async function handleSubmit(status: "pending" | "draft") {
    if (!title.trim()) {
      toast.error(isEn ? "Please enter a blog title." : "অনুগ্রহ করে ব্লগের শিরোনাম লিখুন।");
      return;
    }
    if (!content.trim()) {
      toast.error(isEn ? "Please write the blog content." : "অনুগ্রহ করে ব্লগের বিস্তারিত বিষয়বস্তু লিখুন।");
      return;
    }

    const effectiveCover = customCoverUrl.trim() || coverImage;
    const finalExcerpt = excerpt.trim() || content.trim().slice(0, 150) + "...";

    const payload: CreateBlogInput = {
      title: title.trim(),
      category,
      excerpt: finalExcerpt,
      content: content.trim(),
      coverImage: effectiveCover,
      readingTime: calculatedReadMins,
      readTime: `${calculatedReadMins} মিনিট`,
      authorName: user?.name || "লেখক",
      authorTitle: authorTitle.trim() || "উদ্যোক্তা ও লেখক",
      authorEmail: user?.email,
      userId: user?.id,
      status,
    };

    try {
      const res = await createBlog.mutateAsync(payload);
      toast.success(
        res.message ||
          (status === "pending"
            ? (isEn
                ? "Blog submitted! It will be live after admin approval."
                : "ব্লগটি সফলভাবে জমা দেওয়া হয়েছে! অ্যাডমিন অনুমোদনের পর তা পাবলিক ব্লগে প্রকাশিত হবে।")
            : (isEn ? "Draft saved successfully!" : "ব্লগের খসড়া সফলভাবে সংরক্ষণ করা হয়েছে।"))
      );
      router.push("/dashboard/my-blogs");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || (isEn ? "Failed to save blog." : "ব্লগ প্রকাশ করতে সমস্যা হয়েছে।"));
    }
  }

  // Preview HTML
  const previewHtml = sanitizeContent(parseRichBlogText(content, excerpt));
  const categoryLabel = BLOG_CATEGORIES.find((c) => c.slug === category)?.label || "সাধারণ";

  return (
    <div className="space-y-8">
      {/* Top Banner Alert regarding Admin Approval */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/30">
        <div className="flex items-start gap-3.5">
          <Sparkles className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
          <div className="space-y-1 text-sm text-ink leading-relaxed">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-200">
              {isEn ? "Admin Review & Approval Policy" : "ব্লগ প্রকাশনা ও অ্যাডমিন অনুমোদন নীতি"}
            </h3>
            <p className="text-muted">
              {isEn
                ? "Your blog will be submitted to the admin team for quality review. Once approved, it will be published live on the public Blog directory. You can track its status in the 'My Blogs' dashboard."
                : "পাঠক ও উদ্যোক্তাদের জন্য মানসম্মত ও বিশ্বস্ত তথ্য নিশ্চিত করতে আপনার লিখিত ব্লগটি প্রথমে অ্যাডমিন পর্যালোচনায় যাবে। অ্যাডমিন অনুমোদন প্রদান করার সাথে সাথে এটি মূল ব্লগে সবার জন্য উন্মুক্ত হবে। জমা দেওয়ার পর 'আমার ব্লগ' সেকশনে এর অবস্থা দেখতে পারবেন।"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Write vs Live Preview */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
        <div className="flex items-center justify-between gap-4 border-b border-line pb-2">
          <TabsList className="bg-surface border border-line">
            <TabsTrigger value="edit" className="gap-2">
              <PenTool className="h-4 w-4" />
              <span>{isEn ? "Write & Edit" : "ব্লগ লিখুন"}</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              <span>{isEn ? "Live Preview" : "লাইভ প্রিভিউ দেখুন"}</span>
            </TabsTrigger>
          </TabsList>

          <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
            <Clock className="h-3.5 w-3.5 text-green" />
            <span>আনুমানিক পড়ার সময়: ~{calculatedReadMins} মিনিট</span>
          </span>
        </div>

        {/* TAB 1: EDIT FORM */}
        <TabsContent value="edit" className="mt-6 space-y-6">
          {/* Section 1: Basic Info */}
          <Section
            title={isEn ? "Blog Overview" : "ব্লগের শিরোনাম ও ক্যাটাগরি"}
            description={isEn ? "Catchy title and proper category will attract more readers" : "একটি স্পষ্ট ও আকর্ষণীয় শিরোনাম নির্বাচন করুন"}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-ink font-semibold">
                  {isEn ? "Blog Title *" : "ব্লগের শিরোনাম *"}
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    isEn
                      ? "e.g., How to start an organic food business with 20k BDT"
                      : "যেমন: ২০,০০০ টাকায় অর্গানিক ফুড ব্যবসা শুরু করার প্র্যাকটিক্যাল গাইড"
                  }
                  className="mt-1.5 h-11 border-line bg-background text-ink font-medium"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="category" className="text-ink font-semibold">
                    {isEn ? "Category *" : "ক্যাটাগরি নির্বাচন করুন *"}
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="mt-1.5 h-11 border-line bg-background">
                      <SelectValue placeholder="ক্যাটাগরি সিলেক্ট করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOG_CATEGORIES.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="authorTitle" className="text-ink font-semibold">
                    {isEn ? "Author Designation / Role" : "লেখকের পরিচিতি / পদবি"}
                  </Label>
                  <Input
                    id="authorTitle"
                    value={authorTitle}
                    onChange={(e) => setAuthorTitle(e.target.value)}
                    placeholder="উদ্যোক্তা ও ক্ষুদ্র ব্যবসায়ী"
                    className="mt-1.5 h-11 border-line bg-background"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-ink font-semibold">
                  {isEn ? "Short Summary (Excerpt)" : "সংক্ষিপ্ত সারসংক্ষেপ (Excerpt)"}
                </Label>
                <Textarea
                  id="excerpt"
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="ব্লগের মূল পয়েন্ট বা এক/দুই লাইনের আকর্ষণীয় সারাংশ যা কার্ডে প্রদর্শিত হবে..."
                  className="mt-1.5 border-line bg-background"
                />
              </div>
            </div>
          </Section>

          {/* Section 2: Cover Image */}
          <Section
            title={isEn ? "Cover Image" : "কভার ছবি নির্বাচন"}
            description={isEn ? "Select a preset banner or paste an image URL" : "একটি প্রিভিউ ব্যানার বেছে নিন অথবা আপনার পছন্দের ছবির লিঙ্ক দিন"}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {PRESET_COVERS.map((preset) => {
                  const isSelected = coverImage === preset.url && !customCoverUrl.trim();
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setCoverImage(preset.url);
                        setCustomCoverUrl("");
                      }}
                      className={`group relative overflow-hidden rounded-lg border-2 text-left transition-all ${
                        isSelected ? "border-green ring-2 ring-green/20" : "border-line hover:border-ink/40"
                      }`}
                    >
                      <div className="relative aspect-video w-full bg-muted">
                        <Image src={preset.url} alt={preset.label} fill sizes="200px" className="object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-green/20 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-white drop-shadow" />
                          </div>
                        )}
                      </div>
                      <p className="p-1.5 text-center text-xs font-semibold text-ink truncate">{preset.label}</p>
                    </button>
                  );
                })}
              </div>

              <div>
                <Label htmlFor="customCoverUrl" className="text-ink font-semibold">
                  {isEn ? "Or Custom Image URL" : "অথবা নিজস্ব ছবির ইউআরএল (ঐচ্ছিক)"}
                </Label>
                <div className="relative mt-1.5">
                  <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="customCoverUrl"
                    value={customCoverUrl}
                    onChange={(e) => setCustomCoverUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="h-11 border-line bg-background pl-9 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Section 3: Article Content */}
          <Section
            title={isEn ? "Blog Content *" : "ব্লগের পূর্ণাঙ্গ আর্টিকেল *"}
            description={isEn ? "Share your insights, steps, and real advice" : "আপনার বাস্তব অভিজ্ঞতা, ধাপসমূহ এবং কার্যকর পরামর্শ বিস্তারিত লিখুন"}
          >
            <div className="space-y-3">
              <div className="rounded-lg border border-line bg-background/60 p-3 text-xs text-muted space-y-1">
                <p className="font-semibold text-ink">💡 ফরম্যাটিং টিপস:</p>
                <p>• উপ-শিরোনাম তৈরি করতে <code className="bg-surface px-1 py-0.5 rounded text-green font-mono">### আপনার শিরোনাম</code> লিখুন।</p>
                <p>• পয়েন্টের জন্য প্রতি লাইনের শুরুতে <code className="bg-surface px-1 py-0.5 rounded text-green font-mono">- বিষয়</code> বা <code className="bg-surface px-1 py-0.5 rounded text-green font-mono">1. বিষয়</code> লিখুন।</p>
                <p>• টেক্সট বোল্ড করার জন্য দুই পাশে দুটি স্টার দিন: <code className="bg-surface px-1 py-0.5 rounded text-green font-mono">**গুরুত্বপূর্ণ কথা**</code></p>
              </div>

              <Textarea
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="এখানে বিস্তারিত লিখুন...&#10;&#10;### ১. কীভাবে শুরু করবেন?&#10;প্রথমেই আপনার লোকাল বাজারের চাহিদা বুঝুন...&#10;&#10;### ২. প্রয়োজনীয় বাজেট ও খরচ&#10;- কাঁচামাল ক্রয়: ১০,০০০ টাকা&#10;- ডেলিভারি ব্যাকআপ: ২,০০০ টাকা&#10;&#10;### ৩. সফল হওয়ার বাস্তব পরামর্শ&#10;গ্রাহকের সন্তুষ্টিই দীর্ঘমেয়াদী ব্যবসার মূল চাবিকাঠি।"
                className="border-line bg-background text-ink leading-relaxed font-['Hind_Siliguri',sans-serif] text-base p-4"
              />
            </div>
          </Section>

          {/* Submission Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={createBlog.isPending}
              onClick={() => handleSubmit("draft")}
              className="h-12 border-line px-6 font-semibold"
            >
              <FileText className="mr-2 h-4 w-4" />
              {isEn ? "Save as Draft" : "খসড়া সংরক্ষণ করুন"}
            </Button>

            <Button
              type="button"
              disabled={createBlog.isPending}
              onClick={() => handleSubmit("pending")}
              className="h-12 bg-green px-8 font-bold text-white hover:bg-green/90 shadow-md"
            >
              <Send className="mr-2 h-4 w-4" />
              {createBlog.isPending
                ? (isEn ? "Submitting..." : "জমা হচ্ছে...")
                : (isEn ? "Submit for Admin Approval" : "অনুমোদনের জন্য জমা দিন")}
            </Button>
          </div>
        </TabsContent>

        {/* TAB 2: LIVE PREVIEW */}
        <TabsContent value="preview" className="mt-6">
          <Card className="p-6 md:p-10 border-line bg-surface max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <Badge variant="default">{categoryLabel}</Badge>
              <span className="text-xs font-mono text-muted">{calculatedReadMins} মিনিট পড়া</span>
            </div>

            <h1 className="font-display text-2xl font-bold leading-snug md:text-4xl text-ink">
              {title || "ব্লগের শিরোনাম এখানে প্রদর্শিত হবে"}
            </h1>

            <div className="flex items-center gap-3 text-xs text-muted border-y border-line/60 py-3">
              <div className="h-8 w-8 rounded-full bg-green/10 flex items-center justify-center font-bold text-green">
                {(user?.name || "লে")[0]}
              </div>
              <div>
                <p className="font-semibold text-ink">{user?.name || "আপনার নাম"}</p>
                <p className="text-[11px]">{authorTitle}</p>
              </div>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-muted">
              <Image
                src={customCoverUrl.trim() || coverImage}
                alt={title || "Preview"}
                fill
                className="object-cover"
              />
            </div>

            {/* Sanitized Content Preview */}
            <div
              className="prose-blog text-ink leading-relaxed font-['Hind_Siliguri',sans-serif] space-y-4 pt-2"
              dangerouslySetInnerHTML={{ __html: previewHtml || "<p className='text-muted'>ব্লগের মূল কনটেন্ট লিখলে এখানে সুন্দর প্রিভিউ দেখা যাবে...</p>" }}
            />

            <div className="border-t border-line pt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setActiveTab("edit")}>
                <PenTool className="mr-2 h-4 w-4" />
                সম্পাদনায় ফিরে যান
              </Button>
              <Button onClick={() => handleSubmit("pending")} disabled={createBlog.isPending} className="bg-green text-white">
                <Send className="mr-2 h-4 w-4" />
                অনুমোদনের জন্য জমা দিন
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
