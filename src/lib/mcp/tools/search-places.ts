import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { searchPlaces } from "@/lib/agri/data";

export default defineTool({
  name: "search_places",
  title: "Search places",
  description:
    "Geocode a place name into candidate locations (name, region, country, latitude, longitude).",
  inputSchema: { query: z.string().min(1).describe("Town, city or region name to look up.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ query }) => {
    const results = await searchPlaces(query);
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      structuredContent: { results },
    };
  },
});
