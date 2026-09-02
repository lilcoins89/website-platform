/**
 * ScrapeCreators API client
 * Docs: https://docs.scrapecreators.com
 * Base: https://api.scrapecreators.com
 *
 * Auth: x-api-key header (server-only — never expose to the browser)
 * Enrichment layer for social / creator public data alongside Meta, TikTok Ads, Shopify.
 */

const BASE_URL = "https://api.scrapecreators.com";

export type ScrapeCreatorsPlatform =
  | "tiktok"
  | "instagram"
  | "youtube"
  | "facebook"
  | "linkedin"
  | "reddit"
  | "twitter"
  | "threads"
  | "pinterest"
  | "twitch"
  | "snapchat"
  | "bluesky";

export interface ScrapeCreatorsConfig {
  apiKey: string;
  timeoutMs?: number;
}

export class ScrapeCreatorsError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ScrapeCreatorsError";
  }
}

function getApiKey(): string | null {
  return process.env.SCRAPECREATORS_API_KEY?.trim() || null;
}

export function isScrapeCreatorsConfigured(): boolean {
  return Boolean(getApiKey());
}

async function request<T>(
  path: string,
  query: Record<string, string | number | undefined> = {}
): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new ScrapeCreatorsError(
      "SCRAPECREATORS_API_KEY is not set. Add it to .env.local (server-only).",
      401
    );
  }

  const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path}`);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const text = await res.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* keep text */
  }

  if (!res.ok) {
    throw new ScrapeCreatorsError(
      `ScrapeCreators ${res.status}: ${typeof body === "object" && body && "message" in body ? String((body as { message: string }).message) : res.statusText}`,
      res.status,
      body
    );
  }

  return body as T;
}

export async function getCreditBalance() {
  return request<unknown>("/v1/credit-balance");
}

export async function getTikTokProfile(handle: string) {
  return request<unknown>("/v1/tiktok/profile", { handle: handle.replace(/^@/, "") });
}

export async function searchTikTokKeyword(query: string, amount = 20) {
  return request<unknown>("/v1/tiktok/search/keyword", { query, amount });
}

export async function searchTikTokShop(query: string, amount = 20) {
  return request<unknown>("/v1/tiktok/shop/search", { query, amount });
}

export async function getInstagramProfile(handle: string) {
  return request<unknown>("/v1/instagram/profile", { handle: handle.replace(/^@/, "") });
}

export async function getCreatorProfile(platform: ScrapeCreatorsPlatform, handle: string) {
  if (platform === "tiktok") return getTikTokProfile(handle) as Promise<Record<string, unknown>>;
  if (platform === "instagram") return getInstagramProfile(handle) as Promise<Record<string, unknown>>;
  if (platform === "facebook") return findSocialProfiles(handle) as Promise<Record<string, unknown>>;
  if (platform === "youtube") return findSocialProfiles(handle) as Promise<Record<string, unknown>>;
  throw new ScrapeCreatorsError(`Unsupported enrichment platform: ${platform}`, 400);
}

export async function getInstagramPosts(handle: string, amount = 12) {
  return request<unknown>("/v2/instagram/user/posts", {
    handle: handle.replace(/^@/, ""),
    amount,
  });
}

export async function getYouTubeVideo(url: string) {
  return request<unknown>("/v1/youtube/video", { url });
}

export async function getYouTubeTranscript(url: string) {
  return request<unknown>("/v1/youtube/video/transcript", { url });
}

export async function getFacebookCompanyAds(companyName: string) {
  return request<unknown>("/v1/facebook/adLibrary/company/ads", { companyName });
}

export async function findSocialProfiles(query: string) {
  return request<unknown>("/v1/find-social-profiles", { query });
}

export const scrapeCreatorsDemo = {
  configured: false as const,
  message:
    "Demo mode — set SCRAPECREATORS_API_KEY in .env.local to call https://api.scrapecreators.com",
  tiktokProfile: {
    handle: "demo_brand",
    displayName: "Demo Brand",
    followers: 128400,
    following: 210,
    likes: 2450000,
    bio: "Demo profile (synthetic). Not live ScrapeCreators data.",
    verified: false,
  },
  tiktokSearch: [
    { id: "tt_demo_1", desc: "Product unboxing — demo", views: 54000, likes: 3200 },
    { id: "tt_demo_2", desc: "Behind the scenes — demo", views: 21000, likes: 1100 },
  ],
  instagramProfile: {
    handle: "demo_brand",
    followers: 89200,
    following: 340,
    posts: 412,
    bio: "Demo Instagram profile (synthetic).",
  },
  creditBalance: { credits: 0, plan: "demo" },
};

export async function safeCall<T>(
  live: () => Promise<T>,
  demo: T
): Promise<{ data: T; demo: boolean }> {
  if (!isScrapeCreatorsConfigured()) {
    return { data: demo, demo: true };
  }
  try {
    const data = await live();
    return { data, demo: false };
  } catch (e) {
    if (e instanceof ScrapeCreatorsError && e.status === 401) {
      return { data: demo, demo: true };
    }
    throw e;
  }
}
