import type { AiAnalysisResult } from "@/types";
import {
  campaigns,
  channelSummaries,
  customers,
  dailyMetrics,
  kpi,
  anomalies,
} from "@/lib/demo/data";
import { formatCurrency, formatRoas, formatPercent } from "@/lib/utils";

/**
 * Rule-based AI analyst over normalized data.
 * Never invents metrics — only answers from the analytics engine / demo dataset.
 */
export function analyzeQuestion(question: string): AiAnalysisResult {
  const q = question.toLowerCase().trim();

  if (q.includes("highest roas") || (q.includes("which platform") && q.includes("roas"))) {
    const ranked = channelSummaries
      .filter((c) => c.channel !== "shopify")
      .sort((a, b) => b.roas - a.roas);
    const top = ranked[0];
    return {
      answer: `${top.channel === "meta" ? "Meta Ads" : "TikTok Ads"} has the highest ROAS at ${formatRoas(top.roas)}, generating ${formatCurrency(top.revenue)} from ${formatCurrency(top.spend)} spend.`,
      supportingMetrics: [
        { label: "Top platform ROAS", value: formatRoas(top.roas) },
        { label: "Revenue", value: formatCurrency(top.revenue) },
        { label: "Spend", value: formatCurrency(top.spend) },
      ],
      possibleCauses: ["Creative performance", "Audience quality", "Landing page CVR by channel"],
      recommendedActions: ["Shift budget toward higher-ROAS channel while watching CAC"],
      confidence: 0.92,
      dataLimitations: ["Demo data — not live account metrics"],
      chartHint: "channels",
    };
  }

  if (q.includes("compare") && (q.includes("meta") || q.includes("tiktok"))) {
    const meta = channelSummaries.find((c) => c.channel === "meta")!;
    const tt = channelSummaries.find((c) => c.channel === "tiktok")!;
    return {
      answer: `Meta: ${formatCurrency(meta.revenue)} revenue / ${formatCurrency(meta.spend)} spend (${formatRoas(meta.roas)} ROAS). TikTok: ${formatCurrency(tt.revenue)} / ${formatCurrency(tt.spend)} (${formatRoas(tt.roas)} ROAS).`,
      supportingMetrics: [
        { label: "Meta ROAS", value: formatRoas(meta.roas) },
        { label: "TikTok ROAS", value: formatRoas(tt.roas) },
        { label: "Meta CPA", value: formatCurrency(meta.cpa) },
        { label: "TikTok CPA", value: formatCurrency(tt.cpa) },
      ],
      possibleCauses: ["Funnel stage mix", "Creative format fit"],
      recommendedActions: ["Run incrementality tests before large shifts"],
      confidence: 0.9,
      dataLimitations: ["Demo dataset"],
      chartHint: "channels",
    };
  }

  if (q.includes("wasting") || (q.includes("worst") && q.includes("campaign"))) {
    const worst = [...campaigns].filter((c) => c.status === "active").sort((a, b) => a.roas - b.roas)[0];
    return {
      answer: `${worst.name} (${worst.source}) has the lowest active ROAS at ${formatRoas(worst.roas)} with ${formatCurrency(worst.spend)} spend.`,
      supportingMetrics: [
        { label: "Campaign ROAS", value: formatRoas(worst.roas) },
        { label: "Spend", value: formatCurrency(worst.spend) },
        { label: "CPA", value: formatCurrency(worst.cpa) },
      ],
      possibleCauses: ["Creative fatigue", "Audience saturation", "Bid strategy mismatch"],
      recommendedActions: ["Pause or restructure the campaign", "Refresh creative"],
      confidence: 0.88,
      dataLimitations: ["Demo data"],
      chartHint: "roas",
    };
  }

  if (q.includes("best") && q.includes("campaign")) {
    const best = [...campaigns].filter((c) => c.status === "active").sort((a, b) => b.roas - a.roas)[0];
    return {
      answer: `${best.name} is the top active campaign at ${formatRoas(best.roas)} ROAS.`,
      supportingMetrics: [
        { label: "ROAS", value: formatRoas(best.roas) },
        { label: "Revenue", value: formatCurrency(best.revenue) },
        { label: "Spend", value: formatCurrency(best.spend) },
      ],
      possibleCauses: ["Strong creative-message fit", "High-intent audience"],
      recommendedActions: ["Scale carefully with frequency caps"],
      confidence: 0.9,
      dataLimitations: ["Demo data"],
      chartHint: "roas",
    };
  }

  if (q.includes("revenue") && (q.includes("meta") || q.includes("from meta"))) {
    const meta = channelSummaries.find((c) => c.channel === "meta")!;
    return {
      answer: `Attributed Meta revenue is ${formatCurrency(meta.revenue)} over the demo window.`,
      supportingMetrics: [
        { label: "Meta revenue", value: formatCurrency(meta.revenue) },
        { label: "Meta spend", value: formatCurrency(meta.spend) },
        { label: "Meta ROAS", value: formatRoas(meta.roas) },
      ],
      possibleCauses: ["Attribution window", "Campaign mix"],
      recommendedActions: ["Validate against Shopify orders for the same period"],
      confidence: 0.85,
      dataLimitations: ["Demo attribution model"],
      chartHint: "revenue",
    };
  }

  if (q.includes("cac")) {
    return {
      answer: `Blended CAC is ${formatCurrency(kpi.cac)}. Recent anomalies: ${anomalies.map((a) => a.message).join("; ") || "none"}.`,
      supportingMetrics: [
        { label: "CAC", value: formatCurrency(kpi.cac) },
        { label: "New customers", value: String(kpi.newCustomers) },
        { label: "Ad spend", value: formatCurrency(kpi.adSpend) },
      ],
      possibleCauses: ["Channel mix shift", "Seasonality", "Creative performance"],
      recommendedActions: ["Review CPA by campaign", "Tighten targeting on high-CPA ads"],
      confidence: 0.84,
      dataLimitations: ["Demo data"],
      chartHint: "spend",
    };
  }

  if (q.includes("fall") || q.includes("drop") || q.includes("declin")) {
    const recent = dailyMetrics.slice(-7);
    const prior = dailyMetrics.slice(-14, -7);
    const rRev = recent.reduce((s, d) => s + d.revenue, 0);
    const pRev = prior.reduce((s, d) => s + d.revenue, 0) || 1;
    const change = ((rRev - pRev) / pRev) * 100;
    return {
      answer: `Last-7-day revenue is ${formatCurrency(rRev)} vs prior week ${formatCurrency(pRev)} (${formatPercent(change)}).`,
      supportingMetrics: [
        { label: "Last 7d revenue", value: formatCurrency(rRev) },
        { label: "Prior 7d revenue", value: formatCurrency(pRev) },
        { label: "Change", value: formatPercent(change) },
      ],
      possibleCauses: anomalies.map((a) => a.message),
      recommendedActions: ["Inspect underperforming campaigns", "Check inventory and site CVR"],
      confidence: 0.8,
      dataLimitations: ["Demo window only"],
      chartHint: "revenue",
    };
  }

  if (q.includes("customer") && (q.includes("most") || q.includes("top"))) {
    const top = [...customers].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
    return {
      answer: `${top.name} generated ${formatCurrency(top.totalRevenue)} across ${top.totalPurchases} orders (segment: ${top.segment}).`,
      supportingMetrics: [
        { label: "LTV", value: formatCurrency(top.ltv) },
        { label: "AOV", value: formatCurrency(top.aov) },
        { label: "Channel", value: String(top.acquisitionChannel) },
      ],
      possibleCauses: ["Strong product-market fit for segment"],
      recommendedActions: ["Build lookalikes from high-LTV customers"],
      confidence: 0.87,
      dataLimitations: ["Sample of demo customers"],
    };
  }

  return {
    answer: `Workspace overview: ${formatCurrency(kpi.revenue)} revenue, ${formatCurrency(kpi.adSpend)} ad spend, ${formatRoas(kpi.roas)} blended ROAS, CAC ${formatCurrency(kpi.cac)}. Ask about platforms, campaigns, CAC, or revenue trends for specifics.`,
    supportingMetrics: [
      { label: "Revenue", value: formatCurrency(kpi.revenue) },
      { label: "Ad spend", value: formatCurrency(kpi.adSpend) },
      { label: "ROAS", value: formatRoas(kpi.roas) },
      { label: "CAC", value: formatCurrency(kpi.cac) },
      { label: "Orders", value: String(kpi.orders) },
    ],
    possibleCauses: ["Answers are limited to metrics present in the unified model"],
    recommendedActions: [
      "Try: Which platform has the highest ROAS?",
      "Try: Which campaigns are wasting money?",
    ],
    confidence: 0.75,
    dataLimitations: ["Demo mode", "No live LLM — rule-based analyst"],
    chartHint: "revenue",
  };
}
