import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { syncJobs } from "@/lib/demo/data";
import { formatDuration, formatNumber, relativeTime } from "@/lib/utils";

export default function SyncsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sync history</h1>
        <p className="text-sm text-muted-foreground">
          Full, incremental, and scheduled jobs with status, duration, and errors.
        </p>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="p-3 font-medium">Job</th>
                <th className="p-3 font-medium">Provider</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Records</th>
                <th className="p-3 font-medium text-right">Failed</th>
                <th className="p-3 font-medium">Duration</th>
                <th className="p-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {syncJobs.map((j) => (
                <tr key={j.id} className="border-b last:border-0">
                  <td className="p-3 font-mono text-xs">{j.id}</td>
                  <td className="p-3 capitalize">{j.provider}</td>
                  <td className="p-3">{j.type}</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        j.status === "completed"
                          ? "success"
                          : j.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {j.status}
                    </Badge>
                    {j.errorMessage ? (
                      <p className="text-xs text-destructive mt-1 max-w-[200px]">{j.errorMessage}</p>
                    ) : null}
                  </td>
                  <td className="p-3 text-right tabular-nums">{formatNumber(j.recordsProcessed)}</td>
                  <td className="p-3 text-right tabular-nums">{formatNumber(j.recordsFailed)}</td>
                  <td className="p-3">{j.durationMs ? formatDuration(j.durationMs) : "—"}</td>
                  <td className="p-3 text-muted-foreground">
                    {j.completedAt ? relativeTime(j.completedAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
