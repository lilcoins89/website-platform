"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      <MobileHeader onMenuClick={() => setMenuOpen(true)} />
      <div className="flex min-h-0 flex-1">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="surface-grid flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto min-h-full max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
