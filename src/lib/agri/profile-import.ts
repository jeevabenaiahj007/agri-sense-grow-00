import { z } from "zod";
import type { CropProfile } from "./types";

export const STORAGE_KEY = "agrisense.crop-profile-overrides.v1";

const tolerance = z.enum(["low", "medium", "high"]);

export const cropProfileSchema = z.object({
  id: z.string().min(1, "id is required"),
  scientificName: z.string().min(1),
  seasons: z.object({
    kharif: z.boolean(),
    rabi: z.boolean(),
    zaid: z.boolean(),
  }),
  tempOptimal: z.tuple([z.number().min(-20).max(60), z.number().min(-20).max(60)]),
  rainfallOptimal: z.number().min(0).max(6000),
  phOptimal: z.number().min(3).max(10),
  organicMatterReq: z.number().min(0).max(20),
  ecTolerance: z.number().min(0).max(30),
  soilTexturePref: z.string().min(1),
  waterRequirement: z.enum(["low", "medium", "high"]),
  sowingWindow: z.string().min(1),
  harvestWindow: z.string().min(1),
  droughtTolerance: tolerance,
  salinityTolerance: tolerance,
  waterloggingTolerance: tolerance,
});

export type ImportedProfile = { id: string } & CropProfile;

export interface RowError {
  row: number;
  id: string;
  message: string;
}

export interface ParseResult {
  valid: ImportedProfile[];
  errors: RowError[];
  format: "csv" | "json";
}

export const CSV_TEMPLATE_HEADERS = [
  "id",
  "scientificName",
  "kharif",
  "rabi",
  "zaid",
  "tempMin",
  "tempMax",
  "rainfallOptimal",
  "phOptimal",
  "organicMatterReq",
  "ecTolerance",
  "soilTexturePref",
  "waterRequirement",
  "sowingWindow",
  "harvestWindow",
  "droughtTolerance",
  "salinityTolerance",
  "waterloggingTolerance",
];

export function csvTemplate(): string {
  return [
    CSV_TEMPLATE_HEADERS.join(","),
    "rice,Oryza sativa,true,false,false,25,32,1500,6.5,1.5,3,Clay to clay loam,high,June – July,October – November,low,medium,high",
  ].join("\n");
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const bool = (v: string) => /^(true|yes|1|y)$/i.test(v.trim());
const num = (v: string) => (v.trim() === "" ? NaN : Number(v));

function rowFromCsv(headers: string[], cells: string[]): unknown {
  const get = (k: string) => cells[headers.indexOf(k)] ?? "";
  return {
    id: get("id").toLowerCase(),
    scientificName: get("scientificName"),
    seasons: { kharif: bool(get("kharif")), rabi: bool(get("rabi")), zaid: bool(get("zaid")) },
    tempOptimal: [num(get("tempMin")), num(get("tempMax"))],
    rainfallOptimal: num(get("rainfallOptimal")),
    phOptimal: num(get("phOptimal")),
    organicMatterReq: num(get("organicMatterReq")),
    ecTolerance: num(get("ecTolerance")),
    soilTexturePref: get("soilTexturePref"),
    waterRequirement: get("waterRequirement").toLowerCase(),
    sowingWindow: get("sowingWindow"),
    harvestWindow: get("harvestWindow"),
    droughtTolerance: get("droughtTolerance").toLowerCase(),
    salinityTolerance: get("salinityTolerance").toLowerCase(),
    waterloggingTolerance: get("waterloggingTolerance").toLowerCase(),
  };
}

function validateRows(rows: unknown[], format: "csv" | "json", offset: number): ParseResult {
  const valid: ImportedProfile[] = [];
  const errors: RowError[] = [];
  rows.forEach((raw, i) => {
    const parsed = cropProfileSchema.safeParse(raw);
    const id = String((raw as { id?: unknown })?.id ?? "—");
    if (parsed.success) {
      const t = parsed.data.tempOptimal;
      if (t[0] >= t[1]) {
        errors.push({ row: i + offset, id, message: "tempMin must be lower than tempMax" });
        return;
      }
      valid.push(parsed.data as ImportedProfile);
    } else {
      errors.push({
        row: i + offset,
        id,
        message: parsed.error.issues
          .map((iss) => `${iss.path.join(".") || "row"}: ${iss.message}`)
          .join("; "),
      });
    }
  });
  return { valid, errors, format };
}

export function parseProfileFile(text: string, fileName: string): ParseResult {
  const trimmed = text.trim();
  const isJson =
    fileName.toLowerCase().endsWith(".json") || trimmed.startsWith("[") || trimmed.startsWith("{");

  if (isJson) {
    let data: unknown;
    try {
      data = JSON.parse(trimmed);
    } catch (e) {
      return {
        valid: [],
        errors: [{ row: 0, id: "—", message: `Invalid JSON: ${(e as Error).message}` }],
        format: "json",
      };
    }
    const rows = Array.isArray(data) ? data : [data];
    return validateRows(rows, "json", 1);
  }

  const lines = trimmed.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    return {
      valid: [],
      errors: [{ row: 0, id: "—", message: "CSV needs a header row and at least one data row" }],
      format: "csv",
    };
  }
  const headers = splitCsvLine(lines[0]!);
  const missing = CSV_TEMPLATE_HEADERS.filter((h) => !headers.includes(h));
  if (missing.length) {
    return {
      valid: [],
      errors: [{ row: 0, id: "—", message: `Missing CSV columns: ${missing.join(", ")}` }],
      format: "csv",
    };
  }
  const rows = lines.slice(1).map((l) => rowFromCsv(headers, splitCsvLine(l)));
  return validateRows(rows, "csv", 2);
}

/* ---------- override store (browser only) ---------- */

let cache: Record<string, CropProfile> | null = null;

export function loadOverrides(): Record<string, CropProfile> {
  if (cache) return cache;
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as Record<string, CropProfile>) : {};
  } catch {
    cache = {};
  }
  return cache;
}

export function saveOverrides(profiles: ImportedProfile[]): Record<string, CropProfile> {
  const next = { ...loadOverrides() };
  for (const { id, ...profile } of profiles) next[id] = profile as CropProfile;
  cache = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function clearOverrides() {
  cache = {};
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
}
