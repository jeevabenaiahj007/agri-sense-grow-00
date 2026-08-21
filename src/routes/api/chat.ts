import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are AgriSense AI Assistant, a friendly agronomy helper inside the AgriSense AI web app.
You answer farmer questions about crop selection, soil health (pH, N-P-K, texture), irrigation, fertilizer schedules,
disease and pest risk, weather and air quality impacts, market/profit expectations, and sustainable practices.
You also explain how to use the app: pick a location, adjust the soil panel, read the live conditions grid,
open any of the top-10 recommended crops to see why it scored well, and bulk-import crop profiles on the /crop-import page.
Be concise (a short paragraph or a few bullets), practical, and use metric units.
Recommendations are advisory — remind users to validate with a local extension officer for high-stakes decisions.`;

type Msg = { role: "user" | "assistant"; content: string };
type Incoming = { messages?: Msg[] };

const GEMINI_MODEL = "gemini-3.5-flash";

async function askGemini(key: string, history: Msg[]) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: history.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`Gemini failed [${res.status}]: ${detail}`);
    return { ok: false as const, status: res.status, detail };
  }

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text =
    json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
  return { ok: true as const, text };
}

async function askLovable(key: string, history: Msg[]) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
    body: JSON.stringify({
      model: "google/gemini-3.6-flash",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`AI gateway failed [${res.status}]: ${detail}`);
    return { ok: false as const, status: res.status, detail };
  }
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return { ok: true as const, text: json.choices?.[0]?.message?.content?.trim() ?? "" };
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Incoming;
        const history = (Array.isArray(body.messages) ? body.messages : [])
          .filter((m) => typeof m?.content === "string" && m.content.trim())
          .slice(-20);
        if (history.length === 0) return new Response("Messages are required", { status: 400 });

        const geminiKey = process.env["GEMINI_API_KEY"];
        const lovableKey = process.env["LOVABLE_API_KEY"];

        let result = geminiKey ? await askGemini(geminiKey, history) : null;
        // Fall back to the Lovable AI gateway if the Gemini key is missing or errored.
        if ((!result || !result.ok) && lovableKey) result = await askLovable(lovableKey, history);

        if (!result) return new Response("AI is not configured", { status: 500 });
        if (!result.ok) {
          return new Response(result.detail || "AI request failed", { status: result.status });
        }
        if (!result.text) {
          return new Response("The assistant returned an empty answer.", { status: 502 });
        }

        return new Response(result.text, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
