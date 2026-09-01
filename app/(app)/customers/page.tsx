import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { customers } from "@/lib/demo/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">
          Segments, LTV, and acquisition channel from the unified model.
        </p>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Segment</th>
                <th className="p-3 font-medium">Channel</th>
                <th className="p-3 font-medium text-right">Orders</th>
                <th className="p-3 font-medium text-right">Revenue</th>
                <th className="p-3 font-medium text-right">LTV</th>
                <th className="p-3 font-medium text-right">AOV</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="p-3">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary">{c.segment}</Badge>
                  </td>
                  <td className="p-3 capitalize">{c.acquisitionChannel}</td>
                  <td className="p-3 text-right tabular-nums">{formatNumber(c.totalPurchases)}</td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(c.totalRevenue)}</td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(c.ltv)}</td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(c.aov)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
