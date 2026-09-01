import { BaseConnector, registerConnector } from "@/lib/connectors/base";
import type { Campaign, SyncJob } from "@/types";
import { campaigns as demoCampaigns } from "@/lib/demo/data";

export class TikTokAdsConnector extends BaseConnector {
  provider = "tiktok" as const;
  private connected = true;

  async connect(credentials: Record<string, string>) {
    void credentials;
    this.connected = true;
    return { accountId: "adv_778899", accountName: "Demo Brand TT" };
  }

  async authenticate() {
    return this.connected;
  }

  async refreshToken() {}

  async discoverSchema() {
    return [
      "advertisers",
      "campaigns",
      "adgroups",
      "ads",
      "reports",
      "spend",
      "impressions",
      "clicks",
      "conversions",
    ];
  }

  async fetchData(_options: { since?: string; until?: string; cursor?: string }) {
    const records = demoCampaigns.filter((c) => c.source === "tiktok");
    return { records };
  }

  normalizeData(raw: unknown[]): Campaign[] {
    return raw as Campaign[];
  }

  async sync(options: { type: "full" | "incremental" }): Promise<SyncJob> {
    const started = new Date().toISOString();
    const { records } = await this.fetchData({});
    return {
      id: `job_tt_${Date.now()}`,
      organizationId: "org_demo",
      sourceId: "src_tiktok",
      provider: "tiktok",
      status: "completed",
      type: options.type,
      startedAt: started,
      completedAt: new Date().toISOString(),
      recordsProcessed: records.length,
      recordsFailed: 0,
      durationMs: 980,
    };
  }

  async disconnect() {
    this.connected = false;
  }
}

registerConnector("tiktok", () => new TikTokAdsConnector());
