import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/shared/kpi-card";
import { sources, syncJobs } from "@/lib/demo/data";

export default function MonitoringPage() {
  const failed = syncJobs.filter((j) => j.status === "failed").length;
  const connected = sources.filter((s) => s.status === "connected").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Monitoring</h1>
        <p className="text-sm text-muted-foreground">
          Connector health, job duration, API latency, and queue status.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="API latency (p95)" value="42ms" />
        <KpiCard label="Sources healthy" value={`${connected}/${sources.length}`} />
        <KpiCard label="Failed syncs (24h)" value={String(failed)} />
        <KpiCard label="Queue depth" value="0" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connector health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sources.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                <span className="capitalize font-medium">{s.provider}</span>
                <Badge variant={s.status === "connected" ? "success" : "destructive"}>
                  {s.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {failed > 0 ? (
              <p>
                <Badge variant="warning" className="mr-2">
                  warning
                </Badge>
                {failed} sync job(s) failed in the recent window — see Syncs for details.
              </p>
            ) : (
              <p>No active alerts. All monitored systems nominal (demo).</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
