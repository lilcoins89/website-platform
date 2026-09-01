import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: LucideIcon;
  hint?: string;
}

export function KpiCard({ label, value, change, icon: Icon, hint }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">{value}</p>
            {typeof change === "number" && (
              <p
                className={cn(
                  "mt-1 text-xs font-medium tabular-nums",
                  change >= 0 ? "text-success" : "text-destructive"
                )}
              >
                {change >= 0 ? "+" : ""}
                {change.toFixed(1)}%
                {hint ? <span className="text-muted-foreground font-normal"> {hint}</span> : null}
              </p>
            )}
          </div>
          {Icon ? (
            <div className="rounded-md bg-muted p-2 text-muted-foreground shrink-0">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
