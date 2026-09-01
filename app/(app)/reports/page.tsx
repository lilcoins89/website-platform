import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reports } from "@/lib/demo/data";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Marketing, revenue, campaign, customer, attribution, and cross-channel reports.
          </p>
        </div>
        <Button size="sm">New report</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{r.name}</CardTitle>
                <Badge variant="secondary">{r.type.replace("_", " ")}</Badge>
              </div>
              <CardDescription>
                {r.schedule ? `Scheduled ${r.schedule}` : "On demand"} · Updated{" "}
                {r.updatedAt.slice(0, 10)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button size="sm" variant="outline">
                Open
              </Button>
              <Button size="sm" variant="ghost">
                Export
              </Button>
              <Button size="sm" variant="ghost">
                Duplicate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
