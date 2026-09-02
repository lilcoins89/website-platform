"use client";

import { FormEvent, useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const suggestions = ["Which campaign has the best ROAS?", "What should I optimize next?", "Compare creator engagement by platform."];

export default function AiPage() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run(question: string) {
    setInput(question); setLoading(true); setError(""); setAnswer("");
    try {
      const workspace = await fetch("/api/workspace", { cache: "no-store" }).then((r) => r.json());
      const response = await fetch("/api/ai/analyst", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, context: workspace }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Groq request failed");
      setAnswer(data.answer ?? "No answer returned.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to reach Groq."); }
    finally { setLoading(false); }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!loading && input.trim()) void run(input.trim()); }

  return <div className="flex flex-col gap-6">
    <header><div className="flex items-center gap-2"><h1 className="text-2xl font-semibold tracking-tight">AI Analyst</h1><Badge variant="secondary">Groq live</Badge></div><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Ask questions about your live campaigns, creator performance, and social context. Answers are grounded in the current workspace snapshot.</p></header>
    <Card><CardContent className="p-4"><form className="flex flex-col gap-2 sm:flex-row" onSubmit={submit}><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about ROAS, creators, CAC, or activity…" aria-label="Question for Groq analyst" /><Button type="submit" disabled={loading || !input.trim()}><Send data-icon="inline-start" />{loading ? "Thinking…" : "Ask Groq"}</Button></form><div className="mt-3 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void run(suggestion)} className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">{suggestion}</button>)}</div></CardContent></Card>
    {error ? <Card className="border-destructive/40"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card> : null}
    {loading ? <Card><CardContent className="flex items-center gap-2 p-6 text-sm text-muted-foreground"><Sparkles className="animate-pulse" /> Groq is analyzing live data…</CardContent></Card> : null}
    {answer ? <Card><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles /> Analyst answer</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap text-sm leading-7">{answer}</p></CardContent></Card> : null}
  </div>;
}
