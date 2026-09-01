"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const samples = [
  { label: "Campaigns", path: "/api/v1/campaigns" },
  { label: "Analytics", path: "/api/v1/analytics" },
  { label: "Customers", path: "/api/v1/customers" },
  { label: "ScrapeCreators status", path: "/api/v1/scrapecreators?action=status" },
];

export default function PlaygroundPage() {
  const [path, setPath] = useState("/api/v1/campaigns");
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch(path);
      const json = await res.json();
      setBody(JSON.stringify(json, null, 2));
    } catch (e) {
      setBody(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">API playground</h1>
        <p className="text-sm text-muted-foreground">Hit local Unify endpoints and inspect JSON.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {samples.map((s) => (
          <Button key={s.path} size="sm" variant="outline" onClick={() => setPath(s.path)}>
            {s.label}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-mono">{path}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button size="sm" onClick={run} disabled={loading}>
            {loading ? "Loading\u2026" : "Send GET"}
          </Button>
          <pre className="max-h-[480px] overflow-auto rounded-md bg-muted p-3 text-xs">
            {body || "Response will appear here."}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
