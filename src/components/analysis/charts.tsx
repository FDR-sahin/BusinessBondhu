"use client";

import { useReducedMotion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { useT } from "@/lib/i18n";
import { formatBDT, toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

/* ---------- shared bits ---------- */
export const TICK = { fill: "rgb(var(--foreground))", fontSize: 13 };
export const GRID = "rgb(var(--border))";

/** Entrance animation <= 0.4s; disabled for prefers-reduced-motion. */
export function useChartAnimation() {
  const reduce = useReducedMotion();
  return { isAnimationActive: !reduce, animationDuration: 400, animationEasing: "ease-out" as const };
}

interface TooltipEntry {
  name?: string | number;
  value?: number | string;
  color?: string;
  payload?: { fill?: string };
}

export function ChartTooltip({ active, payload, label, unit, formatValue }: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  unit?: string;
  formatValue?: (v: number, lang?: "bn" | "en") => string;
}) {
  const lang = useLangStore((s) => s.lang);
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-sm shadow-md">
      {label !== undefined && label !== "" && <p className="mb-1 font-semibold text-ink">{label}</p>}
      <ul className="space-y-0.5">
        {payload.map((p, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color ?? p.payload?.fill }} />
            <span className="text-muted">{p.name}</span>
            <span className="ml-auto pl-3 font-semibold text-ink tabular-nums">
              {formatValue ? formatValue(Number(p.value), lang) : `${toFormattedNumber(Number(p.value), lang)}${unit ? ` ${unit}` : ""}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface NamedCount { name: string; count: number }

/* ---------- 1. Posts by division (columns) ---------- */
export function DivisionChart({ data }: { data: NamedCount[] }) {
  const anim = useChartAnimation();
  const lang = useLangStore((s) => s.lang);
  const t = useT();
  const numFormatter = (v: number) => toFormattedNumber(v, lang);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} interval={0} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={48} allowDecimals={false} tickFormatter={numFormatter} />
        <Tooltip content={<ChartTooltip unit={t("postsUnitText")} />} cursor={{ fill: "rgb(var(--line) / 0.4)" }} />
        <Bar dataKey="count" name={lang === "bn" ? "পোস্ট" : "Posts"} fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]} maxBarSize={48} {...anim} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- 2. Posts by category (donut) ---------- */
export function CategoryChart({ data }: { data: NamedCount[] }) {
  const anim = useChartAnimation();
  const t = useT();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<ChartTooltip unit={t("postsUnitText")} />} />
        <Pie data={data} dataKey="count" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="rgb(var(--surface))" strokeWidth={2} {...anim}>
          {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ---------- 3. Growth (last 6 months) ---------- */
export function GrowthChart({ data }: { data: { name: string; posts: number }[] }) {
  const anim = useChartAnimation();
  const lang = useLangStore((s) => s.lang);
  const t = useT();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={48} allowDecimals={false} tickFormatter={(v) => toFormattedNumber(v, lang)} />
        <Tooltip content={<ChartTooltip unit={t("postsUnitText")} />} />
        <Line type="monotone" dataKey="posts" name={t("newPostsLabel")} stroke={CHART_COLORS[0]} strokeWidth={3}
          dot={{ r: 4, fill: "rgb(var(--surface))", stroke: CHART_COLORS[0], strokeWidth: 2 }} activeDot={{ r: 6 }} {...anim} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ---------- 4. Top 10 districts (horizontal bars) ---------- */
export function DistrictsChart({ data }: { data: NamedCount[] }) {
  const anim = useChartAnimation();
  const lang = useLangStore((s) => s.lang);
  const t = useT();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" tick={TICK} tickLine={false} axisLine={false} width={96} interval={0} />
        <Tooltip content={<ChartTooltip unit={t("postsUnitText")} />} cursor={{ fill: "rgb(var(--line) / 0.4)" }} />
        <Bar dataKey="count" name={lang === "bn" ? "পোস্ট" : "Posts"} fill={CHART_COLORS[0]} radius={[0, 8, 8, 0]} barSize={22} {...anim}>
          <LabelList dataKey="count" position="right" formatter={(v: unknown) => toFormattedNumber(Number(v), lang)} style={{ fill: "rgb(var(--foreground))", fontSize: 13 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- 5. Price trends: wholesale vs retail ---------- */
export function PriceTrendChart({ data }: { data: { name: string; wholesale: number; retail: number }[] }) {
  const anim = useChartAnimation();
  const lang = useLangStore((s) => s.lang);
  const t = useT();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={64} tickFormatter={(v) => toFormattedNumber(v, lang)} />
        <Tooltip content={<ChartTooltip formatValue={formatBDT} />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 13, color: "rgb(var(--foreground))" }} />
        <Line type="monotone" dataKey="wholesale" name={t("avgWholesaleLabel")} stroke={CHART_COLORS[0]} strokeWidth={3}
          dot={{ r: 4, fill: "rgb(var(--surface))", stroke: CHART_COLORS[0], strokeWidth: 2 }} activeDot={{ r: 6 }} {...anim} />
        <Line type="monotone" dataKey="retail" name={t("avgRetailLabel")} stroke={CHART_COLORS[1]} strokeWidth={3}
          dot={{ r: 4, fill: "rgb(var(--surface))", stroke: CHART_COLORS[1], strokeWidth: 2 }} activeDot={{ r: 6 }} {...anim} />
      </LineChart>
    </ResponsiveContainer>
  );
}
