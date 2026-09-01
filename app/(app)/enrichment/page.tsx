"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Status = {
  configured: boolean;
  baseUrl: string;
  docs: string;
  provider: string;
};

export default function EnrichmentPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [handle, setHandle] = useState("charlidamelio");
  const [query, setQuery] = useState("skincare");
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [lastMeta, setLastMeta] = useState<{ demo?: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/v1/scrapecreators?action=status")
      .then((r) => r.json())
      .then((j) => setStatus(j.data))
      .catch(() => setStatus(null));
  }, []);

  async function run(action: string, params: Record<string, string>) {
    setLoading(true);
    setResult(null);
    const qs = new URLSearchParams({ action, ...params });
    try {
      const res = await fetch(`/api/v1/scrapecreators?${qs}`);
      const json = await res.json();
      setResult(json.data ?? json);
      setLastMeta(json.meta ?? null);
    } catch (e) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Social enrichment</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          ScrapeCreators API — public profile, content, shop, and ad-library data across TikTok,
          Instagram, YouTube, Facebook, and more. Complements Meta Ads, TikTok Ads, and Shopify
          connectors. Key stays server-side only.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={status?.configured ? "success" : "warning"}>
          {status?.configured ? "API key configured" : "Demo mode (no key)"}
        </Badge>
        {status?.docs ? (
          <a
            href={status.docs}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary hover:underline"
          >
            docs.scrapecreators.com
          </a>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>TikTok profile</CardTitle>
            <CardDescription>GET /v1/tiktok/profile via Unify proxy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="handle" />
            <Button size="sm" disabled={loading} onClick={() => run("tiktok_profile", { handle })}>
              Fetch profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TikTok keyword search</CardTitle>
            <CardDescription>GET /v1/tiktok/search/keyword</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="query" />
            <Button
              size="sm"
              disabled={loading}
              onClick={() => run("tiktok_search", { query, amount: "10" })}
            >
              Search
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instagram profile</CardTitle>
            <CardDescription>GET /v1/instagram/profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="handle" />
            <Button size="sm" disabled={loading} onClick={() => run("instagram_profile", { handle })}>
              Fetch profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TikTok Shop</CardTitle>
            <CardDescription>GET /v1/tiktok/shop/search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="product query" />
            <Button
              size="sm"
              disabled={loading}
              onClick={() => run("tiktok_shop", { query, amount: "10" })}
            >
              Search shop
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Response</CardTitle>
            {lastMeta?.demo ? <Badge variant="warning">demo payload</Badge> : null}
            {lastMeta && !lastMeta.demo ? <Badge variant="success">live</Badge> : null}
          </div>
        </CardHeader>
        <CardContent>
          <pre className="max-h-[420px] overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
            {loading
              ? "Loading…"
              : result
                ? JSON.stringify(result, null, 2)
                : "Run an action to see JSON here."}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proxy endpoints</CardTitle>
          <CardDescription>
            All requests go through Unify so the ScrapeCreators key never hits the browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm font-mono space-y-1 text-muted-foreground">
          <p>GET /api/v1/scrapecreators?action=status</p>
          <p>GET /api/v1/scrapecreators?action=credits</p>
          <p>GET /api/v1/scrapecreators?action=tiktok_profile&amp;handle=…</p>
          <p>GET /api/v1/scrapecreators?action=tiktok_search&amp;query=…</p>
          <p>GET /api/v1/scrapecreators?action=tiktok_shop&amp;query=…</p>
          <p>GET /api/v1/scrapecreators?action=instagram_profile&amp;handle=…</p>
          <p>GET /api/v1/scrapecreators?action=instagram_posts&amp;handle=…</p>
          <p>GET /api/v1/scrapecreators?action=youtube_video&amp;url=…</p>
          <p>GET /api/v1/scrapecreators?action=facebook_company_ads&amp;company=…</p>
          <p>GET /api/v1/scrapecreators?action=find_profiles&amp;query=…</p>
        </CardContent>
      </Card>
    </div>
  );
}
