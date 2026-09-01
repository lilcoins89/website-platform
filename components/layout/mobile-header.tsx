"use client";

import { Menu, Layers } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b bg-card px-3 md:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Layers className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-semibold tracking-tight truncate">Unify</span>
      </div>
    </header>
  );
}
