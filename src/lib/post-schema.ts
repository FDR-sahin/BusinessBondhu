import { z } from "zod";
import { parseAmount } from "@/lib/advisor";
import type { MyPostDetail } from "@/types";

const optionalPrice = () =>
  z
    .string()
    .optional()
    .refine((v) => !v || v.trim() === "" || parseAmount(v) > 0, "সঠিক দাম লিখুন")
    .refine((v) => !v || !(parseAmount(v) > 10_000_000), "দাম অনেক বেশি হয়ে গেছে");

export const postSchema = z.object({
  title: z.string().trim().min(1, "শিরোনাম লিখুন").max(120, "শিরোনাম সর্বোচ্চ ১২০ অক্ষরের হতে পারবে"),
  category: z.string().optional().default(""),
  division: z.string().optional().default(""),
  district: z.string().optional().default(""),
  area: z.string().trim().max(80, "এলাকার নাম সর্বোচ্চ ৮০ অক্ষরের হতে পারবে").optional().default(""),
  exactLocation: z.string().trim().max(160, "সোর্সিং ঠিকানা সর্বোচ্চ ১৬০ অক্ষরের হতে পারবে").optional().default(""),
  wholesalePrice: optionalPrice().default(""),
  wholesalePriceMax: optionalPrice().default(""),
  retailPrice: optionalPrice().default(""),
  retailPriceMax: optionalPrice().default(""),
  retailSellPrice: optionalPrice().default(""),
  profitPotential: z.enum(["low", "medium", "high"]).optional().default("medium"),
  description: z.string().trim().max(5000, "বিবরণ সর্বোচ্চ ৫০০০ অক্ষরের হতে পারবে").optional().default(""),
  image: z.string().optional(),
  tags: z.array(z.string()).max(8, "সর্বোচ্চ ৮টি ট্যাগ দেওয়া যাবে").optional().default([]),
});
export type PostFormValues = z.infer<typeof postSchema>;

export const EMPTY_POST: PostFormValues = {
  title: "", category: "", division: "", district: "", area: "", exactLocation: "",
  wholesalePrice: "", wholesalePriceMax: "", retailPrice: "", retailPriceMax: "", retailSellPrice: "",
  profitPotential: "medium", description: "", image: undefined, tags: [],
};

const num = (v?: string) => {
  if (!v || v.trim() === "") return undefined;
  const n = parseAmount(v);
  return Number.isFinite(n) ? n : undefined;
};

/** Form strings -> API body. Drafts may be incomplete, so every field can be undefined. */
export function toPostRequest(v: PostFormValues, status: "draft" | "pending") {
  const wsMin = num(v.wholesalePrice);
  const wsMax = num(v.wholesalePriceMax);
  const retMin = num(v.retailPrice);
  const retMax = num(v.retailPriceMax);
  return {
    status,
    title: (v.title || "").trim(),
    category: v.category || undefined,
    division: v.division || undefined,
    district: v.district || undefined,
    area: v.area?.trim() || undefined,
    exactLocation: v.exactLocation?.trim() || undefined,
    wholesalePrice: wsMin,
    wholesalePriceMax: wsMax,
    retailPrice: retMin,
    retailPriceMax: retMax,
    retailSellPrice: num(v.retailSellPrice) ?? retMin,
    profitPotential: v.profitPotential,
    description: v.description?.trim() || undefined,
    image: v.image || undefined,
    tags: v.tags ?? [],
  };
}

/** Saved post -> form values (for the edit page). */
export function fromPost(p: MyPostDetail): PostFormValues {
  return {
    title: p.title, category: p.category, division: p.division, district: p.district, area: p.area ?? "",
    exactLocation: p.exactLocation ?? "",
    wholesalePrice: p.wholesalePrice != null ? String(p.wholesalePrice) : "",
    wholesalePriceMax: p.wholesalePriceMax != null ? String(p.wholesalePriceMax) : "",
    retailPrice: p.retailPrice != null ? String(p.retailPrice) : "",
    retailPriceMax: p.retailPriceMax != null ? String(p.retailPriceMax) : "",
    retailSellPrice: p.retailSellPrice != null ? String(p.retailSellPrice) : "",
    profitPotential: p.profitPotential, description: p.description ?? "", image: p.image, tags: p.tags ?? [],
  };
}
