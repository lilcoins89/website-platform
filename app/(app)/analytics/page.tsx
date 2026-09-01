import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/shared/kpi-card";
import { TimeSeriesChart } from "@/components/charts/time-series";
import { channelSummaries, dailyMetrics, kpi } from "@/lib/demo/data";
import { formatCurrency, formatNumber, formatPercent, formatRoas } from "@/lib/utils";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Full metric set computed on the unified model \u2014 provider-independent.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="ROAS" value={formatRoas(kpi.roas)} />
        <KpiCard label="CAC" value={formatCurrency(kpi.cac)} />
        <KpiCard label="CPA" value={formatCurrency(kpi.cpa)} />
        <KpiCard label="AOV" value={formatCurrency(kpi.aov)} />
        <KpiCard label="CTR" value={formatPercent(kpi.ctr)} />
        <KpiCard label="CVR" value={formatPercent(kpi.cvr)} />
        <KpiCard label="CPC" value={formatCurrency(kpi.cpc)} />
        <KpiCard label="LTV" value={formatCurrency(kpi.ltv)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue and spend over time</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeSeriesChart
            data={dailyMetrics}
            currency
            type="area"
            series={[
              { key: "revenue", label: "Revenue", color: "hsl(var(--chart-1))" },
              { key: "spend", label: "Spend", color: "hsl(var(--chart-2))" },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Channel comparison</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="p-2 font-medium">Channel</th>
                <th className="p-2 font-medium text-right">Spend</th>
                <th className="p-2 font-medium text-right">Revenue</th>
                <th className="p-2 font-medium text-right">ROAS</th>
                <th className="p-2 font-medium text-right">CPA</th>
                <th className="p-2 font-medium text-right">Conv.</th>
              </tr>
            </thead>
            <tbody>
              {channelSummaries.map((c) => (
                <tr key={c.channel} className="border-b last:border-0">
                  <td className="p-2 capitalize font-medium">{c.channel}</td>
                  <td className="p-2 text-right tabular-nums">{formatCurrency(c.spend)}</td>
                  <td className="p-2 text-right tabular-nums">{formatCurrency(c.revenue)}</td>
                  <td className="p-2 text-right tabular-nums">
                    {c.channel === "shopify" ? "\u2014" : formatRoas(c.roas)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {c.channel === "shopify" ? "\u2014" : formatCurrency(c.cpa)}
                  </td>
                  <td className="p-2 text-right tabular-nums">{formatNumber(c.conversions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
