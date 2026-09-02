export type CampaignRow = {
  id: string;
  name: string;
  source: string;
  status: string;
  spend: number;
  revenue: number;
  roas: number;
  cpa: number;
  impressions: number;
  clicks: number;
  conversions: number;
  updated_at: string;
};

export type CreatorRow = {
  id: string;
  handle: string;
  platform: string;
  display_name: string | null;
  bio: string | null;
  followers: number;
  engagement_rate: number;
  profile_url: string | null;
  raw_data: Record<string, unknown>;
  enriched_at: string | null;
};
