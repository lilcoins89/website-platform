import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { question, context } = await request.json();
    if (!question?.trim()) return NextResponse.json({ error: "Question is required" }, { status: 400 });
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "llama-3.3-70b-versatile", temperature: 0.2, messages: [{ role: "system", content: "You are the Unify marketing analyst. Give concise, practical answers grounded only in the supplied live workspace context. If data is missing, say so." }, { role: "user", content: `Workspace context:\n${JSON.stringify(context ?? {})}\n\nQuestion: ${question}` }] }) });
    const body = await response.json();
    if (!response.ok) return NextResponse.json({ error: body?.error?.message ?? "Groq request failed" }, { status: response.status });
    return NextResponse.json({ answer: body.choices?.[0]?.message?.content ?? "No answer returned." });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "AI analyst failed" }, { status: 500 }); }
}
