import { z } from "zod";
import { searchPlaces, fetchSiteConditions, type GeoPlace } from "@/lib/agri/data";
import type { SoilProfile, SoilType } from "@/lib/agri/types";

export const soilSchema = z
  .object({
    type: z
      .enum(["sandy", "loamy", "clay", "silt", "black", "red", "laterite", "alluvial"])
      .optional(),
    ph: z.number().optional(),
    nitrogen: z.number().optional(),
    phosphorus: z.number().optional(),
    potassium: z.number().optional(),
    organicMatter: z.number().optional(),
    moisture: z.number().optional(),
    salinity: z.number().optional(),
  })
  .optional()
  .describe("Optional soil test values; sensible loamy defaults are used for anything omitted.");

const DEFAULT_SOIL: SoilProfile = {
  type: "loamy",
  ph: 6.5,
  nitrogen: 80,
  phosphorus: 40,
  potassium: 45,
  organicMatter: 1.6,
  moisture: 28,
  salinity: 0.6,
};

export function resolveSoil(input?: z.infer<typeof soilSchema>): SoilProfile {
  return { ...DEFAULT_SOIL, ...(input ?? {}) } as SoilProfile & { type: SoilType };
}

export const locationSchema = {
  location: z
    .string()
    .optional()
    .describe("Place name to geocode, e.g. 'Nashik' or 'Fresno, California'."),
  latitude: z.number().optional().describe("Latitude, used instead of location."),
  longitude: z.number().optional().describe("Longitude, used instead of location."),
};

export async function resolvePlace(input: {
  location?: string;
  latitude?: number;
  longitude?: number;
}): Promise<GeoPlace> {
  if (typeof input.latitude === "number" && typeof input.longitude === "number") {
    return {
      name: `${input.latitude.toFixed(3)}, ${input.longitude.toFixed(3)}`,
      country: "",
      latitude: input.latitude,
      longitude: input.longitude,
    };
  }
  const query = input.location?.trim();
  if (!query) throw new Error("Provide either a location name or latitude and longitude.");
  const results = await searchPlaces(query);
  const first = results[0];
  if (!first) throw new Error(`No place found for "${query}".`);
  return first;
}

export async function resolveSite(input: {
  location?: string;
  latitude?: number;
  longitude?: number;
}) {
  const place = await resolvePlace(input);
  return { place, site: await fetchSiteConditions(place) };
}
