"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Activity, Code2, Database, FileText, GitBranch, LayoutDashboard, LineChart, Megaphone, RefreshCw, Settings, ShieldCheck, Sparkles, Table2, Users, X, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/enrichment", label: "Creator enrichment", icon: Sparkles },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/attribution", label: "Attribution", icon: GitBranch },
  { href: "/ai", label: "AI Analyst", icon: Sparkles },
  { href: "/sources", label: "Data sources", icon: Database },
  { href: "/syncs", label: "Sync activity", icon: RefreshCw },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/explorer", label: "Data explorer", icon: Table2 },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  { href: "/data-quality", label: "Data quality", icon: ShieldCheck },
  { href: "/developers", label: "Developers", icon: Code2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const content = <>
    <div className="flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"><Layers className="size-4" /></div><div><p className="font-semibold tracking-tight">Unify</p><p className="text-[11px] text-muted-foreground">Creator intelligence</p></div></div>
      {onClose ? <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden" aria-label="Close menu"><X className="size-5" /></button> : null}
    </div>
    <nav className="flex-1 overflow-y-auto p-3"><p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p><div className="flex flex-col gap-1">{nav.map((item) => { const active = pathname === item.href || pathname.startsWith(`${item.href}/`); const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={onClose} className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors", active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}><Icon className="size-4 shrink-0" />{item.label}</Link>; })}</div></nav>
    <div className="border-t p-4"><div className="rounded-xl bg-accent/70 p-3"><p className="text-xs font-medium text-accent-foreground">Live workspace</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Shared data sync is active across your team.</p></div></div>
  </>;
  return <><aside className="hidden h-full w-64 shrink-0 flex-col border-r bg-card/90 md:flex">{content}</aside><div className={cn("fixed inset-0 z-40 transition-opacity md:hidden", open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")} aria-hidden={!open}><button type="button" className="absolute inset-0 bg-foreground/30" onClick={onClose} aria-label="Close menu overlay" /><aside className={cn("absolute left-0 top-0 flex h-full w-[min(18rem,88vw)] flex-col border-r bg-card shadow-xl transition-transform duration-200", open ? "translate-x-0" : "-translate-x-full")}>{content}</aside></div></>;
}
