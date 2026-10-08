export const BLOG_CATEGORIES = [
  { slug: "success-stories", label: "সাকসেস স্টোরি", labelEn: "Success Stories" },
  { slug: "failure-stories", label: "ব্যর্থতার গল্প", labelEn: "Failure Stories" },
  { slug: "area-guides", label: "এলাকাভিত্তিক গাইড", labelEn: "Area Guides" },
  { slug: "wholesale-markets", label: "পাইকারি বাজার", labelEn: "Wholesale Markets" },
  { slug: "govt-benefits", label: "সরকারি সুবিধা", labelEn: "Govt Schemes" },
] as const;

export const getBlogCategory = (slug: string) => BLOG_CATEGORIES.find((c) => c.slug === slug);

/** ~200 words per minute. Works on HTML or plain text. */
export function estimateReadingMinutes(html: string): number {
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
