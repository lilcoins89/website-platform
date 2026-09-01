"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { campaigns, customers, orders, dailyMetrics } from "@/lib/demo/data";

const tables = {
  campaigns,
  customers,
  orders,
  daily_metrics: dailyMetrics,
} as const;

type TableKey = keyof typeof tables;

export default function ExplorerPage() {
  const [table, setTable] = useState<TableKey>("campaigns");
  const rows = tables[table] as Record<string, unknown>[];
  const cols = rows[0] ? Object.keys(rows[0]).slice(0, 8) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Data Explorer</h1>
          <p className="text-sm text-muted-foreground">Browse normalized tables and export samples.</p>
        </div>
        <Button size="sm" variant="outline">
          Export CSV
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(tables) as TableKey[]).map((k) => (
          <Button
            key={k}
            size="sm"
            variant={table === k ? "default" : "outline"}
            onClick={() => setTable(k)}
          >
            {k}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm capitalize">{table.replace("_", " ")}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                {cols.map((c) => (
                  <th key={c} className="p-3 font-medium whitespace-nowrap">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 25).map((r, i) => (
                <tr key={i} className="border-b last:border-0">
                  {cols.map((c) => (
                    <td key={c} className="p-3 whitespace-nowrap max-w-[180px] truncate">
                      {String(r[c] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
