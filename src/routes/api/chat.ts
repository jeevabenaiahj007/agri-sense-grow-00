import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are AgriSense AI Assistant, a friendly agronomy helper inside the AgriSense AI web app.
You answer farmer questions about crop selection, soil health (pH, N-P-K, texture), irrigation, fertilizer schedules,
disease and pest risk, weather and air quality impacts, market/profit expectations, and sustainable practices.
You also explain how to use the app: pick a location, adjust the soil panel, read the live conditions grid,
and open any of the top-10 recommended crops to see why it scored well.
Be concise (a short paragraph or a few bullets), practical, and use metric units.
Recommendations are advisory — remind users to validate with a local extension officer for high-stakes decisions.`;

type Incoming = { messages?: { role: "user" | "assistant"; content: string }[] };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Incoming;
        const history = (Array.isArray(body.messages) ? body.messages : [])
          .filter((m) => typeof m?.content === "string" && m.content.trim())
          .slice(-20);
        if (history.length === 0) return new Response("Messages are required", { status: 400 });

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured", { status: 500 });

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
          body: JSON.stringify({
            model: "openai/gpt-5.4-mini",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
          }),
        });

        if (!upstream.ok) {
          const detail = await upstream.text().catch(() => "");
          console.error(`AI gateway failed [${upstream.status}]: ${detail}`);
          return new Response(detail || "AI request failed", { status: upstream.status });
        }

        const json = (await upstream.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const text = json.choices?.[0]?.message?.content?.trim() ?? "";
        if (!text) return new Response("The assistant returned an empty answer.", { status: 502 });

        return new Response(text, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
