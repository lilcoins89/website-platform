import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/shared/kpi-card";
import { sources, syncJobs, apiKeys } from "@/lib/demo/data";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide view of users, orgs, jobs, and system health.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Organizations" value="1" />
        <KpiCard label="Users" value="4" />
        <KpiCard label="Connected sources" value={String(sources.length)} />
        <KpiCard label="API keys" value={String(apiKeys.length)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent sync jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {syncJobs.map((j) => (
              <div key={j.id} className="flex justify-between border-b pb-2 last:border-0">
                <span className="font-mono text-xs">{j.id}</span>
                <span className="capitalize">
                  {j.provider} · {j.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System health</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>API: healthy</p>
            <p>Workers: healthy</p>
            <p>Cache: healthy (demo)</p>
            <p>Storage: healthy (demo)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
