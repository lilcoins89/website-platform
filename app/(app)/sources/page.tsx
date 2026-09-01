"use client";

import { useState } from "react";
import { Plug, RefreshCw, Unplug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sources as demoSources } from "@/lib/demo/data";
import { relativeTime, formatNumber } from "@/lib/utils";
import type { Source } from "@/types";

export default function SourcesPage() {
  const [items, setItems] = useState<Source[]>(demoSources);
  const [busy, setBusy] = useState<string | null>(null);

  async function sync(id: string) {
    setBusy(id);
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "syncing" as const } : s))
    );
    await new Promise((r) => setTimeout(r, 900));
    setItems((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "connected",
              lastSyncAt: new Date().toISOString(),
              dataFreshness: "just now",
            }
          : s
      )
    );
    setBusy(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sources</h1>
        <p className="text-sm text-muted-foreground">
          V1 connectors: Meta Ads, TikTok Ads, Shopify. Demo mode uses synthetic data until OAuth is
          configured.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="capitalize">{s.provider}</CardTitle>
                  <CardDescription>{s.accountName ?? s.name}</CardDescription>
                </div>
                <Badge
                  variant={
                    s.status === "connected"
                      ? "success"
                      : s.status === "syncing"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {s.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>Records</span>
                <span className="text-right tabular-nums text-foreground">
                  {formatNumber(s.recordsImported)}
                </span>
                <span>Last sync</span>
                <span className="text-right text-foreground">
                  {s.lastSyncAt ? relativeTime(s.lastSyncAt) : "\u2014"}
                </span>
                <span>Freshness</span>
                <span className="text-right text-foreground">{s.dataFreshness ?? "\u2014"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy === s.id}
                  onClick={() => sync(s.id)}
                  className="gap-1.5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${busy === s.id ? "animate-spin" : ""}`} />
                  Sync now
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5">
                  <Plug className="h-3.5 w-3.5" />
                  Reconnect
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground">
                  <Unplug className="h-3.5 w-3.5" />
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
