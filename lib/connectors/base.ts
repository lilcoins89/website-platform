import type { Connector, SourceProvider, SyncJob } from "@/types";

export abstract class BaseConnector implements Connector {
  abstract provider: SourceProvider;

  abstract connect(
    credentials: Record<string, string>
  ): Promise<{ accountId: string; accountName: string }>;

  abstract authenticate(): Promise<boolean>;

  abstract refreshToken(): Promise<void>;

  abstract discoverSchema(): Promise<string[]>;

  abstract fetchData(options: {
    since?: string;
    until?: string;
    cursor?: string;
  }): Promise<{ records: unknown[]; nextCursor?: string }>;

  abstract normalizeData(raw: unknown[]): unknown[];

  validateData(records: unknown[]): { valid: unknown[]; invalid: unknown[] } {
    const valid: unknown[] = [];
    const invalid: unknown[] = [];
    for (const r of records) {
      if (r && typeof r === "object") valid.push(r);
      else invalid.push(r);
    }
    return { valid, invalid };
  }

  abstract sync(options: { type: "full" | "incremental" }): Promise<SyncJob>;

  abstract disconnect(): Promise<void>;
}

export type ConnectorRegistry = Record<SourceProvider, () => Connector>;

export const connectorRegistry: Partial<ConnectorRegistry> = {};

export function registerConnector(provider: SourceProvider, factory: () => Connector) {
  connectorRegistry[provider] = factory;
}

export function getConnector(provider: SourceProvider): Connector | null {
  const factory = connectorRegistry[provider];
  return factory ? factory() : null;
}
