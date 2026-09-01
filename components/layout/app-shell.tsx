import { Sidebar } from "@/components/layout/sidebar";
import { DemoBanner } from "@/components/shared/demo-banner";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DemoBanner />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export { AppShell };
