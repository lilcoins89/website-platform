# ScrapeCreators live key setup

Unify proxies ScrapeCreators so the API key never reaches the browser.

## 1. Get a key

1. Sign up at https://scrapecreators.com
2. Copy your API key from the dashboard

## 2. Configure locally

Create or edit `.env.local` in the project root (gitignored):

```bash
SCRAPECREATORS_API_KEY=your_key_here
```

Restart the Next.js dev server after saving.

## 3. Verify

```bash
curl -s "http://localhost:3000/api/v1/scrapecreators?action=status" | jq
```

When configured, `data.configured` is `true`. Open `/enrichment` and run a TikTok or Instagram action — responses should show **live** instead of **demo payload**.

## 4. Production

Set `SCRAPECREATORS_API_KEY` in your host secrets (Vercel/Environment Variables, etc.). Never commit the key.

Docs: https://docs.scrapecreators.com  
Base URL: https://api.scrapecreators.com
