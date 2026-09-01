import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const members = [
  { name: "Alex Morgan", email: "alex@demo.io", role: "owner" },
  { name: "Jamie Kim", email: "jamie@demo.io", role: "admin" },
  { name: "Sam Lee", email: "sam@demo.io", role: "analyst" },
  { name: "Dev User", email: "dev@demo.io", role: "developer" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Organization, workspace, roles, and sync schedule preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Demo Brand Inc.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 max-w-xl">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <Input defaultValue="Demo Brand Inc." />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Workspace</label>
            <Input defaultValue="Production" />
          </div>
          <Button className="w-fit" size="sm">
            Save changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team & roles</CardTitle>
          <CardDescription>Owner · Admin · Analyst · Developer · Viewer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {members.map((m) => (
            <div
              key={m.email}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm"
            >
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.email}</p>
              </div>
              <Badge variant="secondary">{m.role}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default sync schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <select className="h-9 rounded-md border bg-card px-3 text-sm">
            <option>Hourly</option>
            <option>Every 6 hours</option>
            <option>Daily</option>
            <option>Weekly</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Server-only API keys (never commit real secrets)</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            ScrapeCreators: set <code className="text-xs bg-muted px-1 rounded">SCRAPECREATORS_API_KEY</code> in{" "}
            <code className="text-xs bg-muted px-1 rounded">.env.local</code>. Get a key at{" "}
            <a className="text-primary hover:underline" href="https://scrapecreators.com" target="_blank" rel="noreferrer">
              scrapecreators.com
            </a>
            . Then open <a className="text-primary hover:underline" href="/enrichment">/enrichment</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
