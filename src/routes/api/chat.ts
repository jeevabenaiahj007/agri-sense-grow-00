import { createFileRoute } from "@tanstack/react-router";
import { streamText, type ModelMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

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
        const messages = Array.isArray(body.messages) ? body.messages : null;
        if (!messages || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);

        try {
          const result = streamText({
            model: gateway("openai/gpt-5.4-mini"),
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages
                .filter((m) => typeof m.content === "string" && m.content.trim())
                .slice(-20)
                .map((m) => ({ role: m.role, content: m.content }) as ModelMessage),
            ],
          });
          return result.toTextStreamResponse();
        } catch (error) {
          const message = error instanceof Error ? error.message : "AI request failed";
          console.error("chat error:", message);
          return new Response(message, { status: 502 });
        }
      },
    },
  },
});
