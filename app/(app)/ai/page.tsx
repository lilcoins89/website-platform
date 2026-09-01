"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { analyzeQuestion } from "@/lib/ai/analyst";
import type { AiAnalysisResult } from "@/types";

const suggestions = [
  "Why did revenue fall this week?",
  "Which platform has the highest ROAS?",
  "Which campaign is performing best?",
  "Which campaigns are wasting money?",
  "How much revenue came from Meta?",
  "Compare Meta and TikTok.",
  "What caused CAC to increase?",
  "Which customers generate the most revenue?",
];

export default function AiPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiAnalysisResult | null>(null);

  async function run(q: string) {
    setLoading(true);
    setResult(null);
    setInput(q);
    await new Promise((r) => setTimeout(r, 350));
    setResult(analyzeQuestion(q));
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Analyst</h1>
        <p className="text-sm text-muted-foreground">
          Answers are grounded in the normalized analytics engine \u2014 metrics are never invented.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <form
            className="flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) run(input.trim());
            }}
          >
            <input
              className="flex h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              placeholder="Ask about revenue, ROAS, campaigns, CAC\u2026"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" disabled={loading || !input.trim()} className="gap-2 shrink-0">
              <Send className="h-4 w-4" />
              Ask
            </Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => run(s)}
                className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse" /> Analyzing normalized metrics\u2026
          </CardContent>
        </Card>
      ) : null}

      {result ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Answer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="leading-relaxed">{result.answer}</p>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Supporting metrics</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {result.supportingMetrics.map((m) => (
                    <div key={m.label} className="rounded-md border p-3">
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                      <p className="font-semibold tabular-nums">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Possible causes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                {result.possibleCauses.map((c) => (
                  <p key={c}>\u2022 {c}</p>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recommended actions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                {result.recommendedActions.map((c) => (
                  <p key={c}>\u2022 {c}</p>
                ))}
              </CardContent>
            </Card>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Confidence {(result.confidence * 100).toFixed(0)}%</Badge>
              {result.dataLimitations.map((d) => (
                <Badge key={d} variant="outline">
                  {d}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
