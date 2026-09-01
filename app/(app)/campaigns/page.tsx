"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { campaigns as demoCampaigns } from "@/lib/demo/data";
import { formatCurrency, formatNumber, formatRoas } from "@/lib/utils";

export default function CampaignsPage() {
  const [q, setQ] = useState("");
  const [source, setSource] = useState<"all" | "meta" | "tiktok">("all");
  const [status, setStatus] = useState<"all" | "active" | "paused">("all");

  const rows = useMemo(() => {
    return demoCampaigns.filter((c) => {
      if (source !== "all" && c.source !== source) return false;
      if (status !== "all" && c.status !== status) return false;
      if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, source, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
        <p className="text-sm text-muted-foreground">
          Unified Meta and TikTok campaigns with shared metrics.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search campaigns\u2026"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
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
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
      </div>

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
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="p-3 font-medium max-w-[220px] truncate">{c.name}</td>
                  <td className="p-3">
                    <Badge variant={c.source === "meta" ? "meta" : "tiktok"}>{c.source}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant={c.status === "active" ? "success" : "secondary"}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(c.spend)}</td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(c.revenue)}</td>
                  <td className="p-3 text-right tabular-nums">{formatRoas(c.roas)}</td>
                  <td className="p-3 text-right tabular-nums">{formatNumber(c.conversions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
