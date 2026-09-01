import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sources } from "@/lib/demo/data";
import { relativeTime } from "@/lib/utils";

export default function DataQualityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Data quality</h1>
        <p className="text-sm text-muted-foreground">
          Missing data, duplicates, invalid values, stale connections, and schema drift.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {sources.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="capitalize">{s.provider}</CardTitle>
                <Badge variant={s.status === "connected" ? "success" : "destructive"}>
                  {s.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-success">✓ Connected</p>
              <p className="text-success">
                ✓ Last sync {s.lastSyncAt ? relativeTime(s.lastSyncAt) : "—"}
              </p>
              {s.provider === "meta" ? (
                <p className="text-warning-foreground">
                  ⚠ 2,134 records require validation (demo flag)
                </p>
              ) : (
                <p className="text-success">✓ No open validation issues</p>
              )}
              <p className="text-success">✓ Schema version current</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
