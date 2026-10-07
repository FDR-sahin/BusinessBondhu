import { z } from "zod";
import { parseAmount } from "@/lib/advisor";
import type { MyPostDetail } from "@/types";

const price = (label: string) =>
  z
    .string()
    .min(1, `${label} লিখুন`)
    .refine((v) => parseAmount(v) > 0, "সঠিক দাম লিখুন")
    .refine((v) => !(parseAmount(v) > 10_000_000), "দাম অনেক বেশি হয়ে গেছে");

export const postSchema = z.object({
  title: z.string().trim().min(5, "শিরোনাম কমপক্ষে ৫ অক্ষরের হতে হবে").max(120, "শিরোনাম সর্বোচ্চ ১২০ অক্ষরের হতে পারবে"),
  category: z.string().min(1, "ক্যাটাগরি নির্বাচন করুন"),
  division: z.string().min(1, "বিভাগ নির্বাচন করুন"),
  district: z.string().min(1, "জেলা নির্বাচন করুন"),
  area: z.string().trim().max(80, "এলাকার নাম সর্বোচ্চ ৮০ অক্ষরের হতে পারবে"),
  wholesalePrice: price("পাইকারি দাম"),
  retailPrice: price("খুচরা দাম"),
  retailSellPrice: z.string().refine((v) => v.trim() === "" || parseAmount(v) > 0, "সঠিক দাম লিখুন"),
  profitPotential: z.enum(["low", "medium", "high"], { errorMap: () => ({ message: "লাভের সম্ভাবনা নির্বাচন করুন" }) }),
  description: z.string().trim().min(50, "বিবরণ কমপক্ষে ৫০ অক্ষরের হতে হবে").max(5000, "বিবরণ সর্বোচ্চ ৫০০০ অক্ষরের হতে পারবে"),
  image: z.string().optional(),
  tags: z.array(z.string()).max(8, "সর্বোচ্চ ৮টি ট্যাগ দেওয়া যাবে"),
});
export type PostFormValues = z.infer<typeof postSchema>;

export const EMPTY_POST: PostFormValues = {
  title: "", category: "", division: "", district: "", area: "",
  wholesalePrice: "", retailPrice: "", retailSellPrice: "",
  profitPotential: "medium", description: "", image: undefined, tags: [],
};

const num = (v: string) => {
  const n = parseAmount(v);
  return Number.isFinite(n) ? n : undefined;
};

/** Form strings -> API body. Drafts may be incomplete, so every field can be undefined. */
export function toPostRequest(v: PostFormValues, status: "draft" | "pending") {
  return {
    status,
    title: v.title.trim(),
    category: v.category || undefined,
    division: v.division || undefined,
    district: v.district || undefined,
    area: v.area.trim() || undefined,
    wholesalePrice: num(v.wholesalePrice),
    retailPrice: num(v.retailPrice),
    retailSellPrice: num(v.retailSellPrice),
    profitPotential: v.profitPotential,
    description: v.description.trim() || undefined,
    image: v.image || undefined,
    tags: v.tags,
  };
}

/** Saved post -> form values (for the edit page). */
export function fromPost(p: MyPostDetail): PostFormValues {
  return {
    title: p.title, category: p.category, division: p.division, district: p.district, area: p.area ?? "",
    wholesalePrice: String(p.wholesalePrice ?? ""), retailPrice: String(p.retailPrice ?? ""),
    retailSellPrice: p.retailSellPrice != null ? String(p.retailSellPrice) : "",
    profitPotential: p.profitPotential, description: p.description ?? "", image: p.image, tags: p.tags ?? [],
  };
}
