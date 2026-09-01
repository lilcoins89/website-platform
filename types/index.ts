/** Unified data model — provider-independent entities */

export type SourceProvider = "meta" | "tiktok" | "shopify";
export type ConnectionStatus = "connected" | "disconnected" | "error" | "syncing" | "pending";
export type CampaignStatus = "active" | "paused" | "archived" | "completed";
export type SyncJobStatus = "pending" | "running" | "completed" | "failed" | "retrying";
export type Role = "owner" | "admin" | "analyst" | "developer" | "viewer";
export type AttributionModel = "first_touch" | "last_touch" | "linear" | "time_decay" | "position_based";
export type CustomerSegment = "new" | "returning" | "vip" | "high_value" | "at_risk" | "inactive";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: Role;
}

export interface Source {
  id: string;
  organizationId: string;
  provider: SourceProvider;
  name: string;
  status: ConnectionStatus;
  accountName?: string;
  accountId?: string;
  lastSyncAt?: string;
  nextSyncAt?: string;
  recordsImported: number;
  lastSyncDurationMs?: number;
  errorMessage?: string;
  dataFreshness?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  organizationId: string;
  source: SourceProvider;
  externalId: string;
  name: string;
  status: CampaignStatus;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  reach?: number;
  ctr: number;
  cpc: number;
  cpm: number;
  cpa: number;
  roas: number;
  startDate?: string;
  endDate?: string;
  currency: string;
}

export interface AdGroup {
  id: string;
  campaignId: string;
  source: SourceProvider;
  externalId: string;
  name: string;
  status: CampaignStatus;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface Ad {
  id: string;
  adGroupId: string;
  campaignId: string;
  source: SourceProvider;
  externalId: string;
  name: string;
  status: CampaignStatus;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface Customer {
  id: string;
  organizationId: string;
  externalId?: string;
  email?: string;
  name: string;
  firstPurchaseAt?: string;
  lastPurchaseAt?: string;
  totalPurchases: number;
  totalRevenue: number;
  aov: number;
  acquisitionChannel?: SourceProvider | "direct" | "organic";
  acquisitionCampaignId?: string;
  acquisitionCampaignName?: string;
  ltv: number;
  segment: CustomerSegment;
  status: "active" | "inactive";
}

export interface Product {
  id: string;
  organizationId: string;
  externalId: string;
  name: string;
  sku?: string;
  price: number;
  revenue: number;
  unitsSold: number;
}

export interface Order {
  id: string;
  organizationId: string;
  externalId: string;
  customerId: string;
  total: number;
  subtotal: number;
  refunds: number;
  discount: number;
  status: "pending" | "paid" | "fulfilled" | "refunded" | "cancelled";
  currency: string;
  createdAt: string;
  channel?: SourceProvider | "direct" | "organic";
}

export interface Conversion {
  id: string;
  organizationId: string;
  campaignId?: string;
  source: SourceProvider;
  customerId?: string;
  orderId?: string;
  value: number;
  type: string;
  occurredAt: string;
}

export interface Attribution {
  id: string;
  organizationId: string;
  orderId: string;
  customerId: string;
  model: AttributionModel;
  touchpoints: AttributionTouchpoint[];
  totalRevenue: number;
}

export interface AttributionTouchpoint {
  source: SourceProvider | "direct" | "organic";
  campaignId?: string;
  campaignName?: string;
  channel: string;
  timestamp: string;
  weight: number;
  creditedRevenue: number;
}

export interface DailyMetric {
  date: string;
  revenue: number;
  spend: number;
  orders: number;
  customers: number;
  conversions: number;
  impressions: number;
  clicks: number;
  metaSpend?: number;
  tiktokSpend?: number;
  metaRevenue?: number;
  tiktokRevenue?: number;
}

export interface ChannelSummary {
  channel: SourceProvider | "shopify";
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cac: number;
  cpa: number;
  roas: number;
  roi: number;
}

export interface KpiSnapshot {
  revenue: number;
  adSpend: number;
  roas: number;
  cac: number;
  cpa: number;
  conversionRate: number;
  customers: number;
  orders: number;
  aov: number;
  revenueGrowth: number;
  profit: number;
  ctr: number;
  cpc: number;
  cpm: number;
  cvr: number;
  ltv: number;
  newCustomers: number;
  returningCustomers: number;
  repeatPurchaseRate: number;
}

export interface SyncJob {
  id: string;
  organizationId: string;
  sourceId: string;
  provider: SourceProvider;
  status: SyncJobStatus;
  type: "full" | "incremental" | "scheduled";
  startedAt?: string;
  completedAt?: string;
  recordsProcessed: number;
  recordsFailed: number;
  durationMs?: number;
  errorMessage?: string;
  schedule?: "hourly" | "every_6_hours" | "daily" | "weekly";
}

export interface Anomaly {
  id: string;
  organizationId: string;
  type: string;
  severity: "info" | "warning" | "critical";
  message: string;
  metric: string;
  changePercent: number;
  campaignId?: string;
  campaignName?: string;
  source?: SourceProvider;
  detectedAt: string;
}

export interface ApiKey {
  id: string;
  organizationId: string;
  name: string;
  prefix: string;
  scopes: string[];
  lastUsedAt?: string;
  createdAt: string;
  revokedAt?: string;
}

export interface WebhookEndpoint {
  id: string;
  organizationId: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: string;
  lastDeliveryAt?: string;
  failureCount: number;
}

export interface Report {
  id: string;
  organizationId: string;
  name: string;
  type: "marketing" | "revenue" | "campaign" | "customer" | "attribution" | "cross_channel";
  schedule?: "daily" | "weekly" | "monthly";
  createdAt: string;
  updatedAt: string;
}

export interface AiAnalysisResult {
  answer: string;
  supportingMetrics: { label: string; value: string }[];
  possibleCauses: string[];
  recommendedActions: string[];
  confidence: number;
  dataLimitations: string[];
  chartHint?: "revenue" | "spend" | "roas" | "channels";
}

/** Connector interface — every provider implements this */
export interface Connector {
  provider: SourceProvider;
  connect(credentials: Record<string, string>): Promise<{ accountId: string; accountName: string }>;
  authenticate(): Promise<boolean>;
  refreshToken(): Promise<void>;
  discoverSchema(): Promise<string[]>;
  fetchData(options: { since?: string; until?: string; cursor?: string }): Promise<{
    records: unknown[];
    nextCursor?: string;
  }>;
  normalizeData(raw: unknown[]): Campaign[] | Customer[] | Order[];
  validateData(records: unknown[]): { valid: unknown[]; invalid: unknown[] };
  sync(options: { type: "full" | "incremental" }): Promise<SyncJob>;
  disconnect(): Promise<void>;
}
