/**
 * Synthetic demo dataset — clearly labeled as demo data.
 * Used when real connectors are not authenticated.
 */

import type {
  Source,
  Campaign,
  Customer,
  Order,
  Product,
  DailyMetric,
  ChannelSummary,
  KpiSnapshot,
  Attribution,
  SyncJob,
  Anomaly,
  ApiKey,
  WebhookEndpoint,
  Report,
} from "@/types";
import { enrichKpi, roas, cpa, ctr, cpc, cpm } from "@/lib/analytics/metrics";

export const DEMO_MODE = true;

export const sources: Source[] = [
  {
    id: "src_meta",
    organizationId: "org_demo",
    provider: "meta",
    name: "Meta Ads",
    status: "connected",
    accountName: "Demo Brand Ad Account",
    accountId: "act_100200300",
    lastSyncAt: "2026-09-01T18:00:00Z",
    nextSyncAt: "2026-09-01T19:00:00Z",
    recordsImported: 12450,
    lastSyncDurationMs: 4200,
    dataFreshness: "12m",
    createdAt: "2026-07-01T00:00:00Z",
  },
  {
    id: "src_tiktok",
    organizationId: "org_demo",
    provider: "tiktok",
    name: "TikTok Ads",
    status: "connected",
    accountName: "Demo Brand TT",
    accountId: "adv_778899",
    lastSyncAt: "2026-09-01T17:30:00Z",
    nextSyncAt: "2026-09-01T18:30:00Z",
    recordsImported: 8320,
    lastSyncDurationMs: 3100,
    dataFreshness: "40m",
    createdAt: "2026-07-05T00:00:00Z",
  },
  {
    id: "src_shopify",
    organizationId: "org_demo",
    provider: "shopify",
    name: "Shopify",
    status: "connected",
    accountName: "demo-brand.myshopify.com",
    accountId: "shop_554433",
    lastSyncAt: "2026-09-01T18:10:00Z",
    nextSyncAt: "2026-09-01T19:10:00Z",
    recordsImported: 22100,
    lastSyncDurationMs: 5600,
    dataFreshness: "8m",
    createdAt: "2026-06-15T00:00:00Z",
  },
];

function campaign(
  id: string,
  source: "meta" | "tiktok",
  name: string,
  status: "active" | "paused",
  spend: number,
  impressions: number,
  clicks: number,
  conversions: number,
  revenue: number
): Campaign {
  return {
    id,
    organizationId: "org_demo",
    source,
    externalId: id.replace("cmp_", ""),
    name,
    status,
    spend,
    impressions,
    clicks,
    conversions,
    revenue,
    ctr: ctr(clicks, impressions),
    cpc: cpc(spend, clicks),
    cpm: cpm(spend, impressions),
    cpa: cpa(spend, conversions),
    roas: roas(revenue, spend),
    currency: "USD",
  };
}

export const campaigns: Campaign[] = [
  campaign("cmp_m1", "meta", "Prospecting — Lookalike 2%", "active", 4200, 890000, 18500, 312, 18900),
  campaign("cmp_m2", "meta", "Retargeting — Site visitors", "active", 2100, 320000, 9200, 410, 24500),
  campaign("cmp_m3", "meta", "Brand awareness — Video", "paused", 800, 1200000, 4100, 28, 900),
  campaign("cmp_t1", "tiktok", "Spark ads — UGC creators", "active", 3600, 1500000, 42000, 280, 15600),
  campaign("cmp_t2", "tiktok", "Conversion — Product catalog", "active", 2800, 980000, 31000, 195, 11200),
  campaign("cmp_t3", "tiktok", "Traffic — New collection", "paused", 600, 450000, 9000, 40, 1200),
];

function buildDailyMetrics(days: number): DailyMetric[] {
  const out: DailyMetric[] = [];
  const base = new Date("2026-08-01T00:00:00Z");
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() + i);
    const wave = 1 + 0.15 * Math.sin(i / 4);
    const revenue = Math.round(4200 * wave + (i % 5) * 120);
    const spend = Math.round(1800 * wave + (i % 3) * 40);
    const orders = Math.round(45 * wave);
    const customers = Math.round(38 * wave);
    const conversions = Math.round(52 * wave);
    const impressions = Math.round(180000 * wave);
    const clicks = Math.round(5200 * wave);
    out.push({
      date: d.toISOString().slice(0, 10),
      revenue,
      spend,
      orders,
      customers,
      conversions,
      impressions,
      clicks,
      metaSpend: Math.round(spend * 0.55),
      tiktokSpend: Math.round(spend * 0.45),
      metaRevenue: Math.round(revenue * 0.58),
      tiktokRevenue: Math.round(revenue * 0.42),
    });
  }
  return out;
}

export const dailyMetrics: DailyMetric[] = buildDailyMetrics(30);

export const kpi: KpiSnapshot = (() => {
  const revenue = dailyMetrics.reduce((s, d) => s + d.revenue, 0);
  const adSpend = dailyMetrics.reduce((s, d) => s + d.spend, 0);
  const orders = dailyMetrics.reduce((s, d) => s + d.orders, 0);
  const customers = dailyMetrics.reduce((s, d) => s + d.customers, 0);
  const conversions = dailyMetrics.reduce((s, d) => s + d.conversions, 0);
  const clicks = dailyMetrics.reduce((s, d) => s + d.clicks, 0);
  const impressions = dailyMetrics.reduce((s, d) => s + d.impressions, 0);
  const newCustomers = Math.round(customers * 0.62);
  return enrichKpi({
    revenue,
    adSpend,
    orders,
    customers,
    conversions,
    clicks,
    impressions,
    newCustomers,
    revenueGrowth: 8.4,
    ltv: 186,
    returningCustomers: customers - newCustomers,
    repeatPurchaseRate: 28.5,
  });
})();

export const channelSummaries: ChannelSummary[] = [
  {
    channel: "meta",
    spend: 7100,
    impressions: 2410000,
    clicks: 31800,
    conversions: 750,
    revenue: 44300,
    cac: 18.2,
    cpa: 9.47,
    roas: 6.24,
    roi: 523,
  },
  {
    channel: "tiktok",
    spend: 7000,
    impressions: 2930000,
    clicks: 82000,
    conversions: 515,
    revenue: 28000,
    cac: 22.1,
    cpa: 13.59,
    roas: 4.0,
    roi: 300,
  },
  {
    channel: "shopify",
    spend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: kpi.revenue,
    cac: 0,
    cpa: 0,
    roas: 0,
    roi: 0,
  },
];

export const customers: Customer[] = [
  {
    id: "cus_1",
    organizationId: "org_demo",
    email: "alex@example.com",
    name: "Alex Rivera",
    firstPurchaseAt: "2026-07-12T00:00:00Z",
    lastPurchaseAt: "2026-08-28T00:00:00Z",
    totalPurchases: 4,
    totalRevenue: 412,
    aov: 103,
    acquisitionChannel: "meta",
    acquisitionCampaignId: "cmp_m1",
    acquisitionCampaignName: "Prospecting — Lookalike 2%",
    ltv: 412,
    segment: "high_value",
    status: "active",
  },
  {
    id: "cus_2",
    organizationId: "org_demo",
    email: "jordan@example.com",
    name: "Jordan Lee",
    firstPurchaseAt: "2026-08-02T00:00:00Z",
    lastPurchaseAt: "2026-08-02T00:00:00Z",
    totalPurchases: 1,
    totalRevenue: 68,
    aov: 68,
    acquisitionChannel: "tiktok",
    acquisitionCampaignId: "cmp_t1",
    acquisitionCampaignName: "Spark ads — UGC creators",
    ltv: 68,
    segment: "new",
    status: "active",
  },
  {
    id: "cus_3",
    organizationId: "org_demo",
    email: "sam@example.com",
    name: "Sam Okonkwo",
    firstPurchaseAt: "2026-06-20T00:00:00Z",
    lastPurchaseAt: "2026-08-15T00:00:00Z",
    totalPurchases: 6,
    totalRevenue: 790,
    aov: 131.67,
    acquisitionChannel: "meta",
    acquisitionCampaignId: "cmp_m2",
    acquisitionCampaignName: "Retargeting — Site visitors",
    ltv: 790,
    segment: "vip",
    status: "active",
  },
];

export const products: Product[] = [
  {
    id: "prd_1",
    organizationId: "org_demo",
    externalId: "sku_serum",
    name: "Hydra Serum 30ml",
    sku: "SERUM-30",
    price: 48,
    revenue: 19200,
    unitsSold: 400,
  },
  {
    id: "prd_2",
    organizationId: "org_demo",
    externalId: "sku_kit",
    name: "Starter Kit",
    sku: "KIT-01",
    price: 89,
    revenue: 15130,
    unitsSold: 170,
  },
];

export const orders: Order[] = [
  {
    id: "ord_1",
    organizationId: "org_demo",
    externalId: "1001",
    customerId: "cus_1",
    total: 112,
    subtotal: 112,
    refunds: 0,
    discount: 0,
    status: "fulfilled",
    currency: "USD",
    createdAt: "2026-08-28T14:00:00Z",
    channel: "meta",
  },
  {
    id: "ord_2",
    organizationId: "org_demo",
    externalId: "1002",
    customerId: "cus_2",
    total: 68,
    subtotal: 68,
    refunds: 0,
    discount: 0,
    status: "paid",
    currency: "USD",
    createdAt: "2026-08-02T09:20:00Z",
    channel: "tiktok",
  },
];

export const attributions: Attribution[] = [
  {
    id: "att_1",
    organizationId: "org_demo",
    orderId: "ord_1",
    customerId: "cus_1",
    model: "last_touch",
    totalRevenue: 112,
    touchpoints: [
      {
        source: "meta",
        campaignId: "cmp_m1",
        campaignName: "Prospecting — Lookalike 2%",
        channel: "paid_social",
        timestamp: "2026-08-20T10:00:00Z",
        weight: 0.3,
        creditedRevenue: 33.6,
      },
      {
        source: "meta",
        campaignId: "cmp_m2",
        campaignName: "Retargeting — Site visitors",
        channel: "paid_social",
        timestamp: "2026-08-27T16:00:00Z",
        weight: 0.7,
        creditedRevenue: 78.4,
      },
    ],
  },
];

export const syncJobs: SyncJob[] = [
  {
    id: "job_1",
    organizationId: "org_demo",
    sourceId: "src_meta",
    provider: "meta",
    status: "completed",
    type: "incremental",
    startedAt: "2026-09-01T18:00:00Z",
    completedAt: "2026-09-01T18:00:04Z",
    recordsProcessed: 840,
    recordsFailed: 0,
    durationMs: 4200,
  },
  {
    id: "job_2",
    organizationId: "org_demo",
    sourceId: "src_tiktok",
    provider: "tiktok",
    status: "completed",
    type: "incremental",
    startedAt: "2026-09-01T17:30:00Z",
    completedAt: "2026-09-01T17:30:03Z",
    recordsProcessed: 620,
    recordsFailed: 0,
    durationMs: 3100,
  },
  {
    id: "job_3",
    organizationId: "org_demo",
    sourceId: "src_shopify",
    provider: "shopify",
    status: "failed",
    type: "incremental",
    startedAt: "2026-08-31T12:00:00Z",
    completedAt: "2026-08-31T12:00:08Z",
    recordsProcessed: 0,
    recordsFailed: 12,
    durationMs: 8000,
    errorMessage: "Rate limit — retry scheduled (demo)",
  },
];

export const anomalies: Anomaly[] = [
  {
    id: "an_1",
    organizationId: "org_demo",
    type: "spend_spike",
    severity: "warning",
    message: "Meta prospecting CPA up 24% vs 7-day baseline",
    metric: "cpa",
    changePercent: 24,
    campaignId: "cmp_m1",
    campaignName: "Prospecting — Lookalike 2%",
    source: "meta",
    detectedAt: "2026-09-01T12:00:00Z",
  },
  {
    id: "an_2",
    organizationId: "org_demo",
    type: "roas_drop",
    severity: "critical",
    message: "TikTok Spark ROAS below 3.0 for 3 consecutive days",
    metric: "roas",
    changePercent: -31,
    campaignId: "cmp_t1",
    campaignName: "Spark ads — UGC creators",
    source: "tiktok",
    detectedAt: "2026-08-31T09:00:00Z",
  },
];

export const apiKeys: ApiKey[] = [
  {
    id: "key_1",
    organizationId: "org_demo",
    name: "Production read",
    prefix: "unf_live_****",
    scopes: ["read:campaigns", "read:analytics"],
    lastUsedAt: "2026-09-01T10:00:00Z",
    createdAt: "2026-07-01T00:00:00Z",
  },
];

export const webhooks: WebhookEndpoint[] = [
  {
    id: "wh_1",
    organizationId: "org_demo",
    url: "https://example.com/hooks/unify",
    events: ["sync.completed", "anomaly.detected"],
    secret: "whsec_demo",
    active: true,
    createdAt: "2026-07-15T00:00:00Z",
    lastDeliveryAt: "2026-09-01T18:00:05Z",
    failureCount: 0,
  },
];

export const reports: Report[] = [
  {
    id: "rpt_1",
    organizationId: "org_demo",
    name: "Weekly marketing performance",
    type: "marketing",
    schedule: "weekly",
    createdAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-08-20T00:00:00Z",
  },
  {
    id: "rpt_2",
    organizationId: "org_demo",
    name: "Cross-channel ROAS",
    type: "cross_channel",
    schedule: "daily",
    createdAt: "2026-07-10T00:00:00Z",
    updatedAt: "2026-08-28T00:00:00Z",
  },
  {
    id: "rpt_3",
    organizationId: "org_demo",
    name: "Customer cohorts",
    type: "customer",
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-20T00:00:00Z",
  },
];
