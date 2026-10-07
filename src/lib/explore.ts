import type { PostFilters } from "@/hooks/use-posts";
import type { ProfitPotential } from "@/types";

/** Slider bounds (BDT). The top end means "no upper limit". */
export const PRICE_MAX = 100_000;
export const PRICE_STEP = 500;
export const PAGE_SIZE = 12;

export type SortKey = NonNullable<PostFilters["sort"]>;
export type PriceRange = [number, number];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "নতুন" },
  { value: "popular", label: "জনপ্রিয়" },
  { value: "most_liked", label: "সবচেয়ে বেশি লাইক" },
  { value: "most_commented", label: "সবচেয়ে বেশি মন্তব্য" },
  { value: "price_asc", label: "দাম: কম থেকে বেশি" },
];

export const PROFIT_OPTIONS: { value: ProfitPotential; label: string }[] = [
  { value: "low", label: "কম" },
  { value: "medium", label: "মাঝারি" },
  { value: "high", label: "বেশি" },
];

export interface ExploreFilters {
  division: string[];
  district: string[];
  category: string[];
  profit: ProfitPotential[];
  area: string;
  wholesale: PriceRange;
  retail: PriceRange;
  sort: SortKey;
  page: number;
}

export const DEFAULT_RANGE: PriceRange = [0, PRICE_MAX];
export const DEFAULT_FILTERS: ExploreFilters = {
  division: [],
  district: [],
  category: [],
  profit: [],
  area: "",
  wholesale: DEFAULT_RANGE,
  retail: DEFAULT_RANGE,
  sort: "newest",
  page: 1,
};

/* ------------------------- URL <-> filters ------------------------- */

type ParamReader = { get(name: string): string | null };

const csv = (v: string | null) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);

function num(v: string | null, fallback: number) {
  if (v === null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), PRICE_MAX) : fallback;
}

function range(sp: ParamReader, minKey: string, maxKey: string): PriceRange {
  const min = num(sp.get(minKey), 0);
  const max = num(sp.get(maxKey), PRICE_MAX);
  return min <= max ? [min, max] : [max, min];
}

/** Anything in the URL is untrusted: validate before it reaches state or the API. */
export function parseFilters(sp: ParamReader): ExploreFilters {
  const sort = sp.get("sort");
  const page = Number(sp.get("page"));
  return {
    division: csv(sp.get("division")),
    district: csv(sp.get("district")),
    category: csv(sp.get("category")),
    profit: csv(sp.get("profit")).filter((v): v is ProfitPotential => PROFIT_OPTIONS.some((o) => o.value === v)),
    area: (sp.get("area") ?? "").slice(0, 80),
    wholesale: range(sp, "wholesaleMin", "wholesaleMax"),
    retail: range(sp, "retailMin", "retailMax"),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : "newest",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** Only non-default values are written, so shared links stay short and clean. */
export function serializeFilters(f: ExploreFilters): string {
  const p = new URLSearchParams();
  if (f.division.length) p.set("division", f.division.join(","));
  if (f.district.length) p.set("district", f.district.join(","));
  if (f.category.length) p.set("category", f.category.join(","));
  if (f.profit.length) p.set("profit", f.profit.join(","));
  if (f.area.trim()) p.set("area", f.area.trim());
  if (f.wholesale[0] > 0) p.set("wholesaleMin", String(f.wholesale[0]));
  if (f.wholesale[1] < PRICE_MAX) p.set("wholesaleMax", String(f.wholesale[1]));
  if (f.retail[0] > 0) p.set("retailMin", String(f.retail[0]));
  if (f.retail[1] < PRICE_MAX) p.set("retailMax", String(f.retail[1]));
  if (f.sort !== "newest") p.set("sort", f.sort);
  if (f.page > 1) p.set("page", String(f.page));
  return p.toString();
}

/** Filters -> API query params (omit anything unset). */
export function toApiParams(f: ExploreFilters): PostFilters {
  return {
    page: f.page,
    limit: PAGE_SIZE,
    sort: f.sort,
    division: f.division.join(",") || undefined,
    district: f.district.join(",") || undefined,
    category: f.category.join(",") || undefined,
    profit: f.profit.join(",") || undefined,
    area: f.area.trim() || undefined,
    wholesaleMin: f.wholesale[0] > 0 ? f.wholesale[0] : undefined,
    wholesaleMax: f.wholesale[1] < PRICE_MAX ? f.wholesale[1] : undefined,
    retailMin: f.retail[0] > 0 ? f.retail[0] : undefined,
    retailMax: f.retail[1] < PRICE_MAX ? f.retail[1] : undefined,
  };
}

const isRangeSet = (r: PriceRange) => r[0] > 0 || r[1] < PRICE_MAX;

/** Number of active filters (sort and page don't count). */
export function countActiveFilters(f: ExploreFilters): number {
  return (
    f.division.length + f.district.length + f.category.length + f.profit.length +
    (f.area.trim() ? 1 : 0) + (isRangeSet(f.wholesale) ? 1 : 0) + (isRangeSet(f.retail) ? 1 : 0)
  );
}
