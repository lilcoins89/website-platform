import Link from "next/link";
import {
  ArrowRight,
  Database,
  LineChart,
  GitBranch,
  Sparkles,
  Code2,
  Workflow,
  Shield,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Database,
    title: "Unified Data",
    body: "Bring Meta, TikTok and Shopify data into one system with a normalized schema.",
  },
  {
    icon: LineChart,
    title: "Cross-Channel Analytics",
    body: "Understand advertising performance alongside actual Shopify revenue.",
  },
  {
    icon: GitBranch,
    title: "Attribution",
    body: "Connect marketing activity to customers and purchases with multiple models.",
  },
  {
    icon: Sparkles,
    title: "AI Intelligence",
    body: "Ask questions about your business and receive data-backed answers.",
  },
  {
    icon: Code2,
    title: "Developer API",
    body: "Access normalized business data through one provider-independent API.",
  },
  {
    icon: Workflow,
    title: "ETL Infrastructure",
    body: "Automated extraction, transformation, validation and synchronization.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    body: "Secure credentials, organization isolation, audit logs and permissions.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Layers className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">Unify</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#platform" className="hover:text-foreground">
              Platform
            </a>
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <Link href="/developers" className="hover:text-foreground">
              API
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Start Building</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-12 pb-12 sm:pt-20 sm:pb-16 text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-primary">
          Marketing data infrastructure
        </p>
        <h1 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl leading-tight">
          One Data Layer for Your Marketing & Commerce
        </h1>
        <p className="mx-auto mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground">
          Connect Meta Ads, TikTok Ads and Shopify through one unified data infrastructure.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              Start Building <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#platform">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Explore Platform
            </Button>
          </a>
        </div>
      </section>

      <section id="platform" className="border-y bg-card py-16">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8">Architecture</p>
          <div className="flex flex-col items-center gap-3 text-sm">
            <div className="flex flex-wrap justify-center gap-2">
              {["Meta Ads", "TikTok Ads", "Shopify"].map((s) => (
                <span key={s} className="rounded-md border bg-background px-4 py-2 font-medium shadow-sm">
                  {s}
                </span>
              ))}
            </div>
            <div className="text-muted-foreground">\u2193</div>
            <span className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-sm">
              Unified Data Layer
            </span>
            <div className="text-muted-foreground">\u2193</div>
            <div className="flex flex-wrap justify-center gap-2">
              {["Analytics", "Attribution", "AI Intelligence"].map((s) => (
                <span key={s} className="rounded-md border bg-background px-4 py-2 font-medium shadow-sm">
                  {s}
                </span>
              ))}
            </div>
            <div className="text-muted-foreground">\u2193</div>
            <span className="rounded-md border border-dashed px-4 py-2 text-muted-foreground">
              Business Applications \u00b7 API \u00b7 Reports \u00b7 ScrapeCreators enrichment
            </span>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold tracking-tight">Built for operators and developers</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Connect \u2192 Ingest \u2192 Normalize \u2192 Analyze \u2192 Attribute \u2192 Understand \u2192 Expose through API.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-lg border bg-card p-5 shadow-sm">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            One API for your marketing and commerce data
          </h2>
          <p className="mt-2 text-muted-foreground">
            V1 executes the full pipeline for Meta Ads, TikTok Ads, and Shopify.
          </p>
          <Link href="/dashboard" className="inline-block mt-6">
            <Button size="lg">Open demo dashboard</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        Unify \u00b7 Marketing Data Abstraction Platform \u00b7 V1
      </footer>
    </div>
  );
}
