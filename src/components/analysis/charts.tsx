"use client";

import { useReducedMotion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { formatBDT, toBanglaNumber } from "@/lib/utils";

/* ---------- shared bits ---------- */
// 14px minimum text everywhere (spec). Colors are CSS variables, so dark mode just works.
export const TICK = { fill: "rgb(var(--foreground-secondary))", fontSize: 14 };
export const GRID = "rgb(var(--border))";
const bn = (v: number) => toBanglaNumber(v);

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
  formatValue?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 text-sm shadow-md">
      {label !== undefined && label !== "" && <p className="mb-1 font-medium">{label}</p>}
      <ul className="space-y-0.5">
        {payload.map((p, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color ?? p.payload?.fill }} />
            <span className="text-ink-secondary">{p.name}</span>
            <span className="ml-auto pl-3 font-semibold tabular-nums">
              {formatValue ? formatValue(Number(p.value)) : `${bn(Number(p.value))}${unit ? ` ${unit}` : ""}`}
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
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} interval={0} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={48} allowDecimals={false} tickFormatter={bn} />
        <Tooltip content={<ChartTooltip unit="টি পোস্ট" />} cursor={{ fill: "rgb(var(--muted))" }} />
        <Bar dataKey="count" name="পোস্ট" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]} maxBarSize={48} {...anim} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- 2. Posts by category (donut) ---------- */
export function CategoryChart({ data }: { data: NamedCount[] }) {
  const anim = useChartAnimation();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<ChartTooltip unit="টি পোস্ট" />} />
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
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={48} allowDecimals={false} tickFormatter={bn} />
        <Tooltip content={<ChartTooltip unit="টি পোস্ট" />} />
        <Line type="monotone" dataKey="posts" name="নতুন পোস্ট" stroke={CHART_COLORS[0]} strokeWidth={3}
          dot={{ r: 4, fill: "rgb(var(--surface))", stroke: CHART_COLORS[0], strokeWidth: 2 }} activeDot={{ r: 6 }} {...anim} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ---------- 4. Top 10 districts (horizontal bars) ---------- */
export function DistrictsChart({ data }: { data: NamedCount[] }) {
  const anim = useChartAnimation();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" tick={TICK} tickLine={false} axisLine={false} width={96} interval={0} />
        <Tooltip content={<ChartTooltip unit="টি পোস্ট" />} cursor={{ fill: "rgb(var(--muted))" }} />
        <Bar dataKey="count" name="পোস্ট" fill={CHART_COLORS[0]} radius={[0, 8, 8, 0]} barSize={22} {...anim}>
          <LabelList dataKey="count" position="right" formatter={(v: unknown) => bn(Number(v))} style={{ fill: "rgb(var(--foreground))", fontSize: 14 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- 5. Price trends: wholesale vs retail ---------- */
export function PriceTrendChart({ data }: { data: { name: string; wholesale: number; retail: number }[] }) {
  const anim = useChartAnimation();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={64} tickFormatter={bn} />
        <Tooltip content={<ChartTooltip formatValue={formatBDT} />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 14 }} />
        <Line type="monotone" dataKey="wholesale" name="গড় পাইকারি দাম" stroke={CHART_COLORS[0]} strokeWidth={3}
          dot={{ r: 4, fill: "rgb(var(--surface))", stroke: CHART_COLORS[0], strokeWidth: 2 }} activeDot={{ r: 6 }} {...anim} />
        <Line type="monotone" dataKey="retail" name="গড় খুচরা দাম" stroke={CHART_COLORS[1]} strokeWidth={3}
          dot={{ r: 4, fill: "rgb(var(--surface))", stroke: CHART_COLORS[1], strokeWidth: 2 }} activeDot={{ r: 6 }} {...anim} />
      </LineChart>
    </ResponsiveContainer>
  );
}
