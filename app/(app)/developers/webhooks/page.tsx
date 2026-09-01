import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { webhooks } from "@/lib/demo/data";
import { relativeTime } from "@/lib/utils";

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Webhooks</h1>
        <p className="text-sm text-muted-foreground">
          Delivery endpoints for sync.completed, anomaly.detected, and related events.
        </p>
      </div>
      {webhooks.map((w) => (
        <Card key={w.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base font-mono text-sm">{w.url}</CardTitle>
              <Badge variant={w.active ? "success" : "secondary"}>
                {w.active ? "active" : "inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              Events:{" "}
              {w.events.map((e) => (
                <Badge key={e} variant="outline" className="mr-1">
                  {e}
                </Badge>
              ))}
            </p>
            <p className="text-muted-foreground">
              Last delivery: {w.lastDeliveryAt ? relativeTime(w.lastDeliveryAt) : "\u2014"} \u00b7 Failures:{" "}
              {w.failureCount}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
