import { FlaskConical } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="flex items-start gap-2 border-b border-amber-200/80 bg-amber-50 px-3 py-2 text-xs text-amber-900 sm:items-center sm:px-4">
      <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:mt-0" />
      <span className="leading-snug">
        <strong>Demo mode</strong>
        <span className="hidden sm:inline">
          {" "}
          — metrics use synthetic data. Connect Meta, TikTok, or Shopify for live sync.
        </span>
        <span className="sm:hidden"> — synthetic data (not live accounts).</span>
      </span>
    </div>
  );
}
