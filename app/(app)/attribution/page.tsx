import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { attributions } from "@/lib/demo/data";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function AttributionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Attribution</h1>
        <p className="text-sm text-muted-foreground">
          Multi-touch journeys with model weights (first/last/linear/time-decay/position-based ready).
        </p>
      </div>
      {attributions.map((a) => (
        <Card key={a.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">
                Order {a.orderId} \u00b7 {formatCurrency(a.totalRevenue)}
              </CardTitle>
              <Badge variant="secondary">{a.model.replace("_", " ")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {a.touchpoints.map((t, i) => (
              <div
                key={`${a.id}-${i}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm"
              >
                <div>
                  <p className="font-medium capitalize">
                    {t.source} \u00b7 {t.campaignName ?? t.channel}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.timestamp.slice(0, 10)}</p>
                </div>
                <div className="text-right">
                  <p className="tabular-nums font-medium">{formatCurrency(t.creditedRevenue)}</p>
                  <p className="text-xs text-muted-foreground">
                    weight {formatPercent(t.weight * 100)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
