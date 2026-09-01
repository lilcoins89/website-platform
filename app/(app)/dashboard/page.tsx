import {
  DollarSign,
  Megaphone,
  ShoppingCart,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { TimeSeriesChart } from "@/components/charts/time-series";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { anomalies, channelSummaries, dailyMetrics, kpi } from "@/lib/demo/data";
import { formatCurrency, formatNumber, formatRoas, formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Cross-channel performance from the unified data layer (demo metrics).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Revenue" value={formatCurrency(kpi.revenue)} change={kpi.revenueGrowth} icon={DollarSign} />
        <KpiCard label="Ad spend" value={formatCurrency(kpi.adSpend)} icon={Megaphone} />
        <KpiCard label="ROAS" value={formatRoas(kpi.roas)} icon={TrendingUp} />
        <KpiCard label="CAC" value={formatCurrency(kpi.cac)} icon={Target} />
        <KpiCard label="Orders" value={formatNumber(kpi.orders)} icon={ShoppingCart} />
        <KpiCard label="Customers" value={formatNumber(kpi.customers)} icon={Users} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs spend</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeSeriesChart
              data={dailyMetrics}
              currency
              series={[
                { key: "revenue", label: "Revenue", color: "hsl(var(--chart-1))" },
                { key: "spend", label: "Spend", color: "hsl(var(--chart-2))" },
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Channel summary</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Channel</th>
                  <th className="pb-2 font-medium text-right">Spend</th>
                  <th className="pb-2 font-medium text-right">Revenue</th>
                  <th className="pb-2 font-medium text-right">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {channelSummaries.map((c) => (
                  <tr key={c.channel} className="border-b last:border-0">
                    <td className="py-2 capitalize font-medium">{c.channel}</td>
                    <td className="py-2 text-right tabular-nums">{formatCurrency(c.spend)}</td>
                    <td className="py-2 text-right tabular-nums">{formatCurrency(c.revenue)}</td>
                    <td className="py-2 text-right tabular-nums">
                      {c.channel === "shopify" ? "\u2014" : formatRoas(c.roas)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anomalies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {anomalies.map((a) => (
            <div key={a.id} className="flex flex-wrap items-start justify-between gap-2 rounded-md border p-3 text-sm">
              <div>
                <p className="font-medium">{a.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {a.campaignName} \u00b7 {formatPercent(a.changePercent)}
                </p>
              </div>
              <Badge variant={a.severity === "critical" ? "destructive" : "warning"}>{a.severity}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
