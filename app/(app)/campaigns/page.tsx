"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { campaigns, anomalies } from "@/lib/demo/data";
import { formatCurrency, formatNumber, formatRoas } from "@/lib/utils";

export default function CampaignsPage() {
  const [q, setQ] = useState("");
  const [source, setSource] = useState<"all" | "meta" | "tiktok">("all");
  const [sort, setSort] = useState<"roas" | "spend" | "revenue">("roas");

  const rows = useMemo(() => {
    let list = [...campaigns];
    if (source !== "all") list = list.filter((c) => c.source === source);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(t));
    }
    list.sort((a, b) => b[sort] - a[sort]);
    return list;
  }, [q, source, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
        <p className="text-sm text-muted-foreground">
          Unified campaign view across Meta and TikTok with ROAS, CPA, and anomaly flags.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search campaigns\u2026" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select
          className="h-9 rounded-md border bg-card px-3 text-sm"
          value={source}
          onChange={(e) => setSource(e.target.value as typeof source)}
        >
          <option value="all">All sources</option>
          <option value="meta">Meta</option>
          <option value="tiktok">TikTok</option>
        </select>
        <select
          className="h-9 rounded-md border bg-card px-3 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="roas">Sort: ROAS</option>
          <option value="spend">Sort: Spend</option>
          <option value="revenue">Sort: Revenue</option>
        </select>
      </div>

      {anomalies.length > 0 ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {anomalies.length} anomaly flag(s) in the demo window \u2014 see Dashboard for details.
        </div>
      ) : null}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="p-3 font-medium">Campaign</th>
                <th className="p-3 font-medium">Source</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Spend</th>
                <th className="p-3 font-medium text-right">Revenue</th>
                <th className="p-3 font-medium text-right">ROAS</th>
                <th className="p-3 font-medium text-right">Conv.</th>
                <th className="p-3 font-medium text-right">CPA</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="p-3 font-medium max-w-[220px]">{c.name}</td>
                  <td className="p-3">
                    <Badge variant={c.source === "meta" ? "meta" : "tiktok"}>{c.source}</Badge>
                  </td>
                  <td className="p-3 capitalize">{c.status}</td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(c.spend)}</td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(c.revenue)}</td>
                  <td className="p-3 text-right tabular-nums">{formatRoas(c.roas)}</td>
                  <td className="p-3 text-right tabular-nums">{formatNumber(c.conversions)}</td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(c.cpa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
