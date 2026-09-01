import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiKeys } from "@/lib/demo/data";

const endpoints = [
  "GET /api/v1/campaigns",
  "GET /api/v1/customers",
  "GET /api/v1/orders",
  "GET /api/v1/analytics",
  "GET /api/v1/attribution",
  "GET /api/v1/metrics",
  "GET /api/v1/channels",
  "GET /api/v1/scrapecreators?action=status",
];

export default function DevelopersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Developers</h1>
        <p className="text-sm text-muted-foreground">
          Provider-independent REST API and enrichment proxies.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/developers/playground">
          <Button size="sm">API playground</Button>
        </Link>
        <Link href="/developers/webhooks">
          <Button size="sm" variant="outline">
            Webhooks
          </Button>
        </Link>
        <Link href="/enrichment">
          <Button size="sm" variant="outline">
            ScrapeCreators
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API keys</CardTitle>
          <CardDescription>Demo keys \u2014 replace with hashed production keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {apiKeys.map((k) => (
            <div key={k.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm">
              <div>
                <p className="font-medium">{k.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{k.prefix}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {k.scopes.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endpoints</CardTitle>
        </CardHeader>
        <CardContent className="font-mono text-sm space-y-1 text-muted-foreground">
          {endpoints.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
