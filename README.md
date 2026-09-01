# Unify

**One data layer for Meta Ads, TikTok Ads, and Shopify.**

Unify is a marketing data abstraction and analytics platform. It connects advertising and commerce sources, normalizes them into a single schema, and exposes analytics, attribution, AI analysis, and a developer API — so product and growth teams never have to reason about provider-specific data formats.

> **V1 scope:** Meta Ads · TikTok Ads · Shopify only.  
> Architecture is designed so additional connectors can plug in later without rewriting analytics, the API, or the dashboard.

---

## Why Unify

| Problem | How Unify helps |
|---------|-----------------|
| Data lives in three different tools | One normalized model for campaigns, customers, orders, spend, and revenue |
| ROAS and CAC are calculated differently per platform | Shared metric engine (`ROAS`, `CAC`, `CPA`, `AOV`, `CVR`, …) |
| Hard to link ads to Shopify purchases | Attribution models (first/last touch, linear, time decay, position-based) |
| Analysts rebuild the same reports | Dashboard, reports, data explorer, and AI analyst on the same data |
| Engineering wants a clean integration surface | Provider-independent REST API (`GET /api/v1/campaigns`, …) |

---

## Product surface

| Area | Route | Description |
|------|-------|-------------|
| Landing | `/` | Product positioning and architecture overview |
| Auth | `/login`, `/signup` | Demo sign-in (any credentials) |
| Dashboard | `/dashboard` | KPI cards, charts, channel table, anomalies |
| Sources | `/sources` | Connect / sync Meta, TikTok, Shopify |
| Analytics | `/analytics` | Full metric set + cross-channel comparison |
| Campaigns | `/campaigns` | Search, filter, sort, anomaly detection |
| Customers | `/customers` | Segments, LTV, acquisition channel |
| Attribution | `/attribution` | Multi-model attribution + journeys |
| AI Analyst | `/ai` | Grounded Q&A over normalized metrics |
| Reports | `/reports` | Saved / scheduled report shells |
| Data Explorer | `/explorer` | Table browser + export actions |
| Syncs | `/syncs` | Job history and failures |
| Developers | `/developers` | API keys, endpoints, playground, webhooks |
| Monitoring | `/monitoring` | Health, latency, connector status |
| Data quality | `/data-quality` | Validation and freshness checks |
| Settings | `/settings` | Org, roles, sync schedule |
| Admin | `/admin` | Platform overview |

### REST API (demo payloads)

```
GET /api/v1/campaigns
GET /api/v1/customers
GET /api/v1/orders
GET /api/v1/conversions
GET /api/v1/revenue
GET /api/v1/spend
GET /api/v1/analytics
GET /api/v1/attribution
GET /api/v1/channels
GET /api/v1/metrics
```

Responses use a **provider-independent** schema.

---

## Architecture

```
Meta Ads  ──┐
TikTok Ads ─┼──→ Connector Layer → Ingestion → Normalize → Unified Model
Shopify   ──┘              ↓
                   Analytics · Attribution · AI · API · Dashboard
```

- **Connectors** implement a shared interface (`connect`, `fetchData`, `normalizeData`, `sync`, …).
- **Analytics** only sees normalized entities (`Campaign`, `Customer`, `Order`, …).
- **Monad** (optional) is a silent rules layer — not used to store analytics data.

### Demo mode

When live OAuth is not configured, the app runs on clearly labeled **synthetic data**. API responses include `meta.demo: true`.

---

## Tech stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **UI:** Tailwind CSS, Lucide icons, Recharts
- **Structure:** Modular `lib/connectors`, `lib/analytics`, `lib/ai`, `lib/monad`
- **CI:** GitHub Actions (install → typecheck → build)

---

## Getting started

### Prerequisites

- Node.js 20+ (22 recommended)
- npm 10+

### Install & run

```bash
git clone https://github.com/lilcoins89/website-platform.git
cd website-platform
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Click **Start Building** or sign in with any email/password.
- Explore Dashboard → Sources → Campaigns → AI Analyst → Developers.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | TypeScript check |

Copy `.env.example` to `.env.local` when wiring real connectors.

---

## Mobile & responsive web

Unify is a **responsive website platform**, not a native app:

- Viewport-aware layout (`100dvh`)
- **Mobile navigation drawer** with touch-sized targets (≥44px)
- Sticky mobile header with menu control
- Tables scroll horizontally on narrow screens
- Landing and auth adapt from phone → desktop

Verify with a phone browser or Chrome DevTools (~390×844).

---

## Project layout

```
app/                 # App Router pages + API routes
components/          # UI, layout, charts
lib/connectors/      # Meta, TikTok, Shopify + registry
lib/analytics/       # Metric formulas
lib/ai/              # Grounded analyst
lib/demo/            # Synthetic dataset
.github/workflows/   # CI
```

---

## Security notes

- Never expose provider access tokens to the client.
- API keys should be hashed at rest; scopes enforced server-side.
- Organization isolation is required for multi-tenant production data.

---

## License

Private — [lilcoins89/website-platform](https://github.com/lilcoins89/website-platform)

---

## Positioning

> **One API for your marketing and commerce data.**

```
CONNECT → INGEST → NORMALIZE → STORE → ANALYZE → ATTRIBUTE → UNDERSTAND → AUTOMATE → EXPOSE
```

Executed for **Meta Ads + TikTok Ads + Shopify** in V1.
