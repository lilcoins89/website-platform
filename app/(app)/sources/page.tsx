"use client";

import { useState } from "react";
import { Plug, RefreshCw, Unplug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sources as initialSources } from "@/lib/demo/data";
import { formatNumber, formatDuration, relativeTime } from "@/lib/utils";
import type { Source, SourceProvider } from "@/types";

const providerMeta: Record<
  SourceProvider,
  { title: string; description: string; badge: "meta" | "tiktok" | "shopify" }
> = {
  meta: {
    title: "Meta Ads",
    description: "Facebook / Meta advertising — campaigns, ad sets, ads, and insights.",
    badge: "meta",
  },
  tiktok: {
    title: "TikTok Ads",
    description: "TikTok advertising — advertisers, campaigns, ad groups, and reports.",
    badge: "tiktok",
  },
  shopify: {
    title: "Shopify",
    description: "Shopify commerce — orders, customers, products, and revenue.",
    badge: "shopify",
  },
};

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [syncing, setSyncing] = useState<string | null>(null);

  async function runSync(id: string) {
    setSyncing(id);
    await new Promise((r) => setTimeout(r, 900));
    setSources((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              lastSyncAt: new Date().toISOString(),
              status: "connected",
              lastSyncDurationMs: 900 + Math.floor(Math.random() * 800),
              dataFreshness: "just now",
            }
          : s
      )
    );
    setSyncing(null);
  }

  function toggle(id: string) {
    setSources((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === "connected" ? "disconnected" : "connected",
            }
          : s
      )
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sources</h1>
        <p className="text-sm text-muted-foreground">
          Connect Meta Ads, TikTok Ads, and Shopify. Demo mode uses synthetic data until OAuth is configured.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {sources.map((s) => {
          const meta = providerMeta[s.provider];
          const busy = syncing === s.id;
          return (
            <Card key={s.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {meta.title}
                      <Badge variant={meta.badge}>{s.provider}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">{meta.description}</CardDescription>
                  </div>
                  <Badge variant={s.status === "connected" ? "success" : "secondary"}>{s.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1 text-muted-foreground">
                  <p>Account: {s.accountName ?? "\u2014"}</p>
                  <p>Records: {formatNumber(s.recordsImported)}</p>
                  <p>
                    Last sync:{" "}
                    {s.lastSyncAt
                      ? `${relativeTime(s.lastSyncAt)}${s.lastSyncDurationMs ? ` \u00b7 ${formatDuration(s.lastSyncDurationMs)}` : ""}`
                      : "\u2014"}
                  </p>
                  <p>Freshness: {s.dataFreshness ?? "\u2014"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" disabled={busy || s.status !== "connected"} onClick={() => runSync(s.id)}>
                    <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${busy ? "animate-spin" : ""}`} />
                    {busy ? "Syncing\u2026" : "Sync now"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggle(s.id)}>
                    {s.status === "connected" ? (
                      <><Unplug className="h-3.5 w-3.5 mr-1.5" /> Disconnect</>
                    ) : (
                      <><Plug className="h-3.5 w-3.5 mr-1.5" /> Connect</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
