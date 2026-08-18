import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CROPS } from "@/lib/agri/crops";
import { irrigationPlan, rotationPlan, scoreCrop } from "@/lib/agri/engine";
import { locationSchema, resolveSite, resolveSoil, soilSchema, type LocationInput } from "../site";

export default defineTool({
  name: "get_crop_plan",
  title: "Get crop plan",
  description:
    "Full agronomic plan for one crop at a location: suitability breakdown, disease risks, fertilizer schedule, irrigation plan, rotation advice, economics and pros/cons.",
  inputSchema: {
    ...locationSchema,
    cropId: z.string().describe("Crop id from recommend_crops or list_crops, e.g. 'rice'."),
    soil: soilSchema,
    month: z.number().int().optional().describe("Planting month 1-12; defaults to current month."),
  },
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (input) => {
    const crop = CROPS.find(
      (c) => c.id === input.cropId || c.name.toLowerCase() === input.cropId.toLowerCase(),
    );
    if (!crop) {
      return {
        content: [
          { type: "text", text: `Unknown crop "${input.cropId}". Use list_crops for valid ids.` },
        ],
        isError: true,
      };
    }

    const { site } = await resolveSite(input as LocationInput);
    const soil = resolveSoil(input.soil);
    const month =
      input.month && input.month >= 1 && input.month <= 12
        ? input.month
        : new Date().getMonth() + 1;

    const rec = scoreCrop(crop, site, soil, month);
    const plan = {
      location: site.name,
      season: site.season,
      crop: rec.crop.name,
      suitability: rec.suitability,
      confidence: rec.confidence,
      risk: rec.risk,
      qualityGrade: rec.qualityGrade,
      lossPercent: rec.lossPercent,
      economics: {
        expectedYieldTonPerHa: rec.expectedYield,
        revenuePerHa: rec.revenue,
        costPerHa: rec.crop.costPerHa,
        profitPerHa: rec.profit,
        marketDemand: rec.crop.marketDemand,
        exportDemand: rec.crop.exportDemand,
      },
      factors: rec.factors,
      diseaseRisks: rec.diseaseRisks,
      fertilizer: rec.fertilizer,
      irrigation: irrigationPlan(rec, site),
      rotation: rotationPlan(rec),
      sustainability: rec.sustainability,
      calendar: {
        plantingMonth: rec.plantingMonth,
        harvestMonth: rec.harvestMonth,
        durationDays: rec.crop.durationDays,
      },
      advantages: rec.advantages,
      disadvantages: rec.disadvantages,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(plan, null, 2) }],
      structuredContent: { plan },
    };
  },
});
