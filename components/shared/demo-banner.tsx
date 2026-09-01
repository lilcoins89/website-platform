import { FlaskConical } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="flex items-center gap-2 border-b border-amber-200/80 bg-amber-50 px-4 py-2 text-xs text-amber-900">
      <FlaskConical className="h-3.5 w-3.5 shrink-0" />
      <span>
        <strong>Demo mode</strong> — metrics and connectors use clearly labeled synthetic data.
        Connect real Meta, TikTok, or Shopify accounts to replace this with live sync.
      </span>
    </div>
  );
}
