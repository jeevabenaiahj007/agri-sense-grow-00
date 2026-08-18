import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { recommendCrops } from "@/lib/agri/engine";
import { locationSchema, resolveSite, resolveSoil, soilSchema, type LocationInput } from "../site";

export default defineTool({
  name: "recommend_crops",
  title: "Recommend crops",
  description:
    "Rank the best crops for a location using live climate, soil, season and economics. Returns suitability, confidence, risk, expected yield, profit and the top explaining factors.",
  inputSchema: {
    ...locationSchema,
    soil: soilSchema,
    month: z.number().int().optional().describe("Planting month 1-12; defaults to current month."),
    limit: z.number().int().optional().describe("How many crops to return (default 10)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (input) => {
    const { site } = await resolveSite(input as LocationInput);
    const soil = resolveSoil(input.soil);
    const month =
      input.month && input.month >= 1 && input.month <= 12
        ? input.month
        : new Date().getMonth() + 1;
    const limit = Math.min(Math.max(input.limit ?? 10, 1), 25);

    const results = recommendCrops(site, soil, month)
      .slice(0, limit)
      .map((r, i) => ({
        rank: i + 1,
        cropId: r.crop.id,
        crop: r.crop.name,
        category: r.crop.category,
        suitability: r.suitability,
        confidence: r.confidence,
        risk: r.risk,
        expectedYieldTonPerHa: r.expectedYield,
        profitPerHa: r.profit,
        waterNeedMm: r.waterNeed,
        plantingMonth: r.plantingMonth,
        harvestMonth: r.harvestMonth,
        sustainability: r.sustainability,
        topFactors: r.factors
          .slice(0, 4)
          .map((f) => ({ label: f.label, score: f.score, detail: f.detail })),
      }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              location: site.name,
              season: site.season,
              climateZone: site.climateZone,
              month,
              soil,
              results,
            },
            null,
            2,
          ),
        },
      ],
      structuredContent: { results },
    };
  },
});
