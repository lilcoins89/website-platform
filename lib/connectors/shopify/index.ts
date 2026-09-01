import { BaseConnector, registerConnector } from "@/lib/connectors/base";
import type { Order, SyncJob } from "@/types";
import { orders as demoOrders } from "@/lib/demo/data";

export class ShopifyConnector extends BaseConnector {
  provider = "shopify" as const;
  private connected = true;

  async connect(credentials: Record<string, string>) {
    void credentials;
    this.connected = true;
    return { accountId: "shop_554433", accountName: "demo-brand.myshopify.com" };
  }

  async authenticate() {
    return this.connected;
  }

  async refreshToken() {}

  async discoverSchema() {
    return ["orders", "customers", "products", "transactions", "refunds", "discounts"];
  }

  async fetchData(_options: { since?: string; until?: string; cursor?: string }) {
    return { records: demoOrders };
  }

  normalizeData(raw: unknown[]): Order[] {
    return raw as Order[];
  }

  async sync(options: { type: "full" | "incremental" }): Promise<SyncJob> {
    const started = new Date().toISOString();
    const { records } = await this.fetchData({});
    return {
      id: `job_shop_${Date.now()}`,
      organizationId: "org_demo",
      sourceId: "src_shopify",
      provider: "shopify",
      status: "completed",
      type: options.type,
      startedAt: started,
      completedAt: new Date().toISOString(),
      recordsProcessed: records.length,
      recordsFailed: 0,
      durationMs: 1500,
    };
  }

  async disconnect() {
    this.connected = false;
  }
}

registerConnector("shopify", () => new ShopifyConnector());
