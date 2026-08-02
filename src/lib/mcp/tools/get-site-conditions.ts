import { defineTool } from "@lovable.dev/mcp-js";
import { locationSchema, resolveSite, type LocationInput } from "../site";

export default defineTool({
  name: "get_site_conditions",
  title: "Get site conditions",
  description:
    "Fetch live weather, rainfall, air quality, season and climate zone for a farm location.",
  inputSchema: locationSchema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (input) => {
    const { site } = await resolveSite(input as LocationInput);
    return {
      content: [{ type: "text", text: JSON.stringify(site, null, 2) }],
      structuredContent: { site },
    };
  },
});
