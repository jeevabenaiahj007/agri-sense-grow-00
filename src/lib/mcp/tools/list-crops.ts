import { defineTool } from "@lovable.dev/mcp-js";
import { CROPS } from "@/lib/agri/crops";
import { cropProfile } from "@/lib/agri/crop-profiles";

export default defineTool({
  name: "list_crops",
  title: "List crops",
  description:
    "List every crop in the AgriSense knowledge base with its id, category, key agronomic ranges and extended profile (scientific name, seasons, tolerances, sowing/harvest windows).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const crops = CROPS.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      tempRange: c.tempRange,
      phRange: c.phRange,
      soils: c.soils,
      durationDays: c.durationDays,
      waterMmPerSeason: c.waterMmPerSeason,
      plantingMonths: c.plantingMonths,
      profile: cropProfile(c.id) ?? null,
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(crops, null, 2) }],
      structuredContent: { crops },
    };
  },
});
