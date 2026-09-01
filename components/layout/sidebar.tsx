"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  LineChart,
  Megaphone,
  Users,
  GitBranch,
  Sparkles,
  FileText,
  Table2,
  Code2,
  Activity,
  Settings,
  RefreshCw,
  ShieldCheck,
  Layers,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sources", label: "Sources", icon: Database },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/attribution", label: "Attribution", icon: GitBranch },
  { href: "/ai", label: "AI Analyst", icon: Sparkles },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/explorer", label: "Data Explorer", icon: Table2 },
  { href: "/syncs", label: "Syncs", icon: RefreshCw },
  { href: "/developers", label: "Developers", icon: Code2 },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  { href: "/data-quality", label: "Data Quality", icon: ShieldCheck },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const content = (
    <>
      <div className="flex h-14 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-none tracking-tight">Unify</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Data layer</p>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>
      <nav className="flex-1 overflow-y-auto overscroll-contain p-2 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm transition-colors min-h-[44px]",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center gap-2 rounded-md px-2 py-2.5 text-xs text-muted-foreground hover:bg-accent min-h-[44px]"
        >
          Admin panel
        </Link>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex h-full w-56 shrink-0 flex-col border-r bg-card">
        {content}
      </aside>
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-opacity",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
          aria-label="Close menu overlay"
        />
        <aside
          className={cn(
            "absolute left-0 top-0 flex h-full w-[min(18rem,85vw)] flex-col border-r bg-card shadow-xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {content}
        </aside>
      </div>
    </>
  );
}
