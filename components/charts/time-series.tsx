"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyMetric } from "@/types";
import { formatCompact, formatCurrency } from "@/lib/utils";

interface TimeSeriesProps {
  data: DailyMetric[];
  series: { key: keyof DailyMetric; label: string; color: string }[];
  type?: "line" | "area";
  currency?: boolean;
}

export function TimeSeriesChart({ data, series, type = "line", currency }: TimeSeriesProps) {
  const Chart = type === "area" ? AreaChart : LineChart;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v) => String(v).slice(5)}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v) => formatCompact(Number(v))}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => [
              currency ? formatCurrency(value) : value.toLocaleString(),
              name,
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {series.map((s) =>
            type === "area" ? (
              <Area
                key={String(s.key)}
                type="monotone"
                dataKey={s.key as string}
                name={s.label}
                stroke={s.color}
                fill={s.color}
                fillOpacity={0.12}
                strokeWidth={2}
              />
            ) : (
              <Line
                key={String(s.key)}
                type="monotone"
                dataKey={s.key as string}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
              />
            )
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
