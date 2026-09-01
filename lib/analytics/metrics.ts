import type { Campaign, DailyMetric, KpiSnapshot } from "@/types";

/** Pure metric formulas — no provider-specific logic */

export function roas(revenue: number, spend: number): number {
  if (spend === 0) return 0;
  return revenue / spend;
}

export function cac(spend: number, newCustomers: number): number {
  if (newCustomers === 0) return 0;
  return spend / newCustomers;
}

export function cpa(spend: number, conversions: number): number {
  if (conversions === 0) return 0;
  return spend / conversions;
}

export function aov(revenue: number, orders: number): number {
  if (orders === 0) return 0;
  return revenue / orders;
}

export function cvr(conversions: number, clicks: number): number {
  if (clicks === 0) return 0;
  return (conversions / clicks) * 100;
}

export function ctr(clicks: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

export function cpc(spend: number, clicks: number): number {
  if (clicks === 0) return 0;
  return spend / clicks;
}

export function cpm(spend: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (spend / impressions) * 1000;
}

export function roi(revenue: number, spend: number): number {
  if (spend === 0) return 0;
  return ((revenue - spend) / spend) * 100;
}

export function sumField(rows: DailyMetric[], key: keyof DailyMetric): number {
  return rows.reduce((s, r) => s + (Number(r[key]) || 0), 0);
}

export function campaignFromTotals(c: Campaign): Campaign {
  return {
    ...c,
    ctr: ctr(c.clicks, c.impressions),
    cpc: cpc(c.spend, c.clicks),
    cpm: cpm(c.spend, c.impressions),
    cpa: cpa(c.spend, c.conversions),
    roas: roas(c.revenue, c.spend),
  };
}

export function enrichKpi(
  partial: Partial<KpiSnapshot> &
    Pick<
      KpiSnapshot,
      | "revenue"
      | "adSpend"
      | "orders"
      | "customers"
      | "conversions"
      | "clicks"
      | "impressions"
      | "newCustomers"
    >
): KpiSnapshot {
  const { revenue, adSpend, orders, customers, conversions, clicks, impressions, newCustomers } =
    partial;
  return {
    revenue,
    adSpend,
    orders,
    customers,
    conversions,
    clicks,
    roas: roas(revenue, adSpend),
    cac: cac(adSpend, newCustomers),
    cpa: cpa(adSpend, conversions),
    conversionRate: cvr(conversions, clicks),
    aov: aov(revenue, orders),
    revenueGrowth: partial.revenueGrowth ?? 0,
    profit: revenue - adSpend,
    ctr: ctr(clicks, impressions),
    cpc: cpc(adSpend, clicks),
    cpm: cpm(adSpend, impressions),
    cvr: cvr(conversions, clicks),
    ltv: partial.ltv ?? 0,
    newCustomers,
    returningCustomers: partial.returningCustomers ?? customers - newCustomers,
    repeatPurchaseRate: partial.repeatPurchaseRate ?? 0,
  };
}
