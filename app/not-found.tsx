import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-sm leading-6 text-muted-foreground">That route does not exist in this workspace.</p>
        <Link href="/dashboard"><Button>Back to dashboard</Button></Link>
      </div>
    </main>
  );
}
