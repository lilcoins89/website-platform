import { NextRequest, NextResponse } from "next/server";
import {
  isScrapeCreatorsConfigured,
  getCreditBalance,
  getTikTokProfile,
  searchTikTokKeyword,
  searchTikTokShop,
  getInstagramProfile,
  getInstagramPosts,
  getYouTubeVideo,
  getYouTubeTranscript,
  getFacebookCompanyAds,
  findSocialProfiles,
  getCreatorProfile,
  scrapeCreatorsDemo,
  safeCall,
  ScrapeCreatorsError,
} from "@/lib/scrapecreators/client";

/**
 * Unify proxy for ScrapeCreators enrichment API.
 * GET /api/v1/scrapecreators?action=...
 * Requires SCRAPECREATORS_API_KEY for live data; otherwise labeled demo payloads.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get("action") || "status";

  try {
    switch (action) {
      case "status": {
        return NextResponse.json({
          data: {
            configured: isScrapeCreatorsConfigured(),
            baseUrl: "https://api.scrapecreators.com",
            docs: "https://docs.scrapecreators.com",
            provider: "scrapecreators",
          },
          meta: { demo: !isScrapeCreatorsConfigured() },
        });
      }
      case "credits": {
        const { data, demo } = await safeCall(
          () => getCreditBalance(),
          scrapeCreatorsDemo.creditBalance
        );
        return NextResponse.json({ data, meta: { demo, provider: "scrapecreators" } });
      }
      case "profile": {
        const platform = searchParams.get("platform") as import("@/lib/scrapecreators/client").ScrapeCreatorsPlatform | null;
        const handle = searchParams.get("handle") || "";
        if (!platform || !handle) return NextResponse.json({ error: "platform and handle are required" }, { status: 400 });
        const data = await getCreatorProfile(platform, handle);
        return NextResponse.json({ data, meta: { demo: false, provider: "scrapecreators", platform, handle } });
      }
      case "tiktok_profile": {
        const handle = searchParams.get("handle") || "demo_brand";
        const { data, demo } = await safeCall(
          () => getTikTokProfile(handle),
          { ...scrapeCreatorsDemo.tiktokProfile, handle }
        );
        return NextResponse.json({ data, meta: { demo, provider: "scrapecreators" } });
      }
      case "tiktok_search": {
        const query = searchParams.get("query") || "marketing";
        const amount = Number(searchParams.get("amount") || 20);
        const { data, demo } = await safeCall(
          () => searchTikTokKeyword(query, amount),
          { query, results: scrapeCreatorsDemo.tiktokSearch }
        );
        return NextResponse.json({ data, meta: { demo, provider: "scrapecreators" } });
      }
      case "tiktok_shop": {
        const query = searchParams.get("query") || "shoes";
        const amount = Number(searchParams.get("amount") || 20);
        const { data, demo } = await safeCall(
          () => searchTikTokShop(query, amount),
          {
            query,
            results: [
              { title: "Demo product A", price: 49.99, sold: 1200 },
              { title: "Demo product B", price: 29.99, sold: 840 },
            ],
          }
        );
        return NextResponse.json({ data, meta: { demo, provider: "scrapecreators" } });
      }
      case "instagram_profile": {
        const handle = searchParams.get("handle") || "demo_brand";
        const { data, demo } = await safeCall(
          () => getInstagramProfile(handle),
          { ...scrapeCreatorsDemo.instagramProfile, handle }
        );
        return NextResponse.json({ data, meta: { demo, provider: "scrapecreators" } });
      }
      case "instagram_posts": {
        const handle = searchParams.get("handle") || "demo_brand";
        const amount = Number(searchParams.get("amount") || 12);
        const { data, demo } = await safeCall(
          () => getInstagramPosts(handle, amount),
          {
            handle,
            posts: [
              { id: "ig_demo_1", caption: "Demo post", likes: 420, comments: 18 },
              { id: "ig_demo_2", caption: "Launch teaser", likes: 910, comments: 44 },
            ],
          }
        );
        return NextResponse.json({ data, meta: { demo, provider: "scrapecreators" } });
      }
      case "youtube_video": {
        const url = searchParams.get("url");
        if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });
        const { data, demo } = await safeCall(
          () => getYouTubeVideo(url),
          { url, title: "Demo video", views: 10000, demo: true }
        );
        return NextResponse.json({ data, meta: { demo, provider: "scrapecreators" } });
      }
      case "youtube_transcript": {
        const url = searchParams.get("url");
        if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });
        const { data, demo } = await safeCall(
          () => getYouTubeTranscript(url),
          { url, transcript: "Demo transcript — set SCRAPECREATORS_API_KEY for live data." }
        );
        return NextResponse.json({ data, meta: { demo, provider: "scrapecreators" } });
      }
      case "facebook_company_ads": {
        const companyName = searchParams.get("company") || "Demo Brand";
        const { data, demo } = await safeCall(
          () => getFacebookCompanyAds(companyName),
          {
            companyName,
            ads: [{ id: "fb_ad_demo", headline: "Demo ad creative", status: "active" }],
          }
        );
        return NextResponse.json({ data, meta: { demo, provider: "scrapecreators" } });
      }
      case "find_profiles": {
        const query = searchParams.get("query") || "demo brand";
        const { data, demo } = await safeCall(
          () => findSocialProfiles(query),
          {
            query,
            profiles: [
              { platform: "tiktok", handle: "demo_brand" },
              { platform: "instagram", handle: "demo_brand" },
            ],
          }
        );
        return NextResponse.json({ data, meta: { demo, provider: "scrapecreators" } });
      }
      default:
        return NextResponse.json(
          {
            error: `Unknown action: ${action}`,
            actions: [
              "status",
              "credits",
              "tiktok_profile",
              "tiktok_search",
              "tiktok_shop",
              "instagram_profile",
              "instagram_posts",
              "youtube_video",
              "youtube_transcript",
              "facebook_company_ads",
              "find_profiles",
            ],
          },
          { status: 400 }
        );
    }
  } catch (e) {
    if (e instanceof ScrapeCreatorsError) {
      return NextResponse.json(
        { error: e.message, status: e.status, body: e.body },
        { status: e.status >= 400 && e.status < 600 ? e.status : 502 }
      );
    }
    console.error("[scrapecreators]", e);
    return NextResponse.json({ error: "ScrapeCreators proxy failed" }, { status: 502 });
  }
}
