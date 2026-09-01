import { BaseConnector, registerConnector } from "@/lib/connectors/base";
import type { Campaign, SyncJob } from "@/types";
import { campaigns as demoCampaigns } from "@/lib/demo/data";

export class MetaAdsConnector extends BaseConnector {
  provider = "meta" as const;
  private connected = true;

  async connect(credentials: Record<string, string>) {
    void credentials;
    this.connected = true;
    return { accountId: "act_100200300", accountName: "Demo Brand Ad Account" };
  }

  async authenticate() {
    return this.connected;
  }

  async refreshToken() {}

  async discoverSchema() {
    return [
      "campaigns",
      "adsets",
      "ads",
      "insights",
      "spend",
      "impressions",
      "clicks",
      "conversions",
    ];
  }

  async fetchData(_options: { since?: string; until?: string; cursor?: string }) {
    const records = demoCampaigns.filter((c) => c.source === "meta");
    return { records };
  }

  normalizeData(raw: unknown[]): Campaign[] {
    return raw as Campaign[];
  }

  async sync(options: { type: "full" | "incremental" }): Promise<SyncJob> {
    const started = new Date().toISOString();
    const { records } = await this.fetchData({});
    return {
      id: `job_meta_${Date.now()}`,
      organizationId: "org_demo",
      sourceId: "src_meta",
      provider: "meta",
      status: "completed",
      type: options.type,
      startedAt: started,
      completedAt: new Date().toISOString(),
      recordsProcessed: records.length,
      recordsFailed: 0,
      durationMs: 1200,
    };
  }

  async disconnect() {
    this.connected = false;
  }
}

registerConnector("meta", () => new MetaAdsConnector());
