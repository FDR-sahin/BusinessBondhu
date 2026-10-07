"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip, GRID, TICK, useChartAnimation } from "@/components/analysis/charts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { toBanglaNumber } from "@/lib/utils";

const bn = (v: number) => toBanglaNumber(v);

/** Likes received per day, last 7 days. */
export function WeeklyLikesChart({ data }: { data: { name: string; likes: number }[] }) {
  const anim = useChartAnimation();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={40} allowDecimals={false} tickFormatter={bn} />
        <Tooltip content={<ChartTooltip unit="টি লাইক" />} />
        <Line type="monotone" dataKey="likes" name="লাইক" stroke={CHART_COLORS[0]} strokeWidth={3}
          dot={{ r: 4, fill: "rgb(var(--surface))", stroke: CHART_COLORS[0], strokeWidth: 2 }} activeDot={{ r: 6 }} {...anim} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** My posts per category. */
export function MyCategoryChart({ data }: { data: { name: string; count: number }[] }) {
  const anim = useChartAnimation();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} interval={0} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={40} allowDecimals={false} tickFormatter={bn} />
        <Tooltip content={<ChartTooltip unit="টি পোস্ট" />} cursor={{ fill: "rgb(var(--muted))" }} />
        <Bar dataKey="count" name="পোস্ট" fill={CHART_COLORS[1]} radius={[8, 8, 0, 0]} maxBarSize={44} {...anim} />
      </BarChart>
    </ResponsiveContainer>
  );
}
