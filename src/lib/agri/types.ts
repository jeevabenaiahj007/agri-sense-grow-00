export type SoilType =
  | "sandy"
  | "loamy"
  | "clay"
  | "silt"
  | "black"
  | "red"
  | "laterite"
  | "alluvial";

/** Where a data point came from — shown to the user for every reading. */
export type DataSourceType =
  | "real-time"
  | "api-derived"
  | "historical"
  | "modeled"
  | "estimated"
  | "user-entered"
  | "unavailable";

export type ConfidenceLevel = "high" | "medium" | "low" | "unknown";

export interface Provenance {
  source: DataSourceType;
  /** Human-readable provider, e.g. "Open-Meteo forecast API". */
  provider: string;
  confidence: ConfidenceLevel;
  /** ISO timestamp of the observation. */
  observedAt: string;
  /** Geographic resolution of the reading, e.g. "~11 km grid". */
  resolution: string;
}

export type ToleranceLevel = "low" | "medium" | "high";

export interface CropProfile {
  scientificName: string;
  seasons: { kharif: boolean; rabi: boolean; zaid: boolean };
  tempOptimal: [number, number];
  rainfallOptimal: number;
  phOptimal: number;
  organicMatterReq: number;
  ecTolerance: number;
  soilTexturePref: string;
  waterRequirement: "low" | "medium" | "high";
  sowingWindow: string;
  harvestWindow: string;
  droughtTolerance: ToleranceLevel;
  salinityTolerance: ToleranceLevel;
  waterloggingTolerance: ToleranceLevel;
}

export interface SoilProfile {
  type: SoilType;
  ph: number;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  organicMatter: number; // %
  moisture: number; // %
  salinity: number; // dS/m
}


export interface SiteConditions {
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  temperature: number;
  humidity: number;
  rainfallAnnual: number; // mm estimate
  rainfall30d: number; // mm
  windSpeed: number;
  uvIndex: number;
  cloudCover: number;
  pressure: number;
  sunshineHours: number; // avg per day
  soilMoisture: number; // m3/m3
  soilTemperature: number;
  season: string;
  climateZone: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  ozone: number;
  co: number;
  monthlyRain: { month: string; rain: number }[];
  /** Per-metric data provenance, keyed by metric id (e.g. "temperature"). */
  provenance: Record<string, Provenance>;

}

export interface Crop {
  id: string;
  name: string;
  emoji: string;
  category: string;
  tempRange: [number, number];
  humidityRange: [number, number];
  rainRange: [number, number]; // mm per season
  phRange: [number, number];
  soils: SoilType[];
  n: number;
  p: number;
  k: number;
  durationDays: number;
  waterMmPerSeason: number;
  yieldTonPerHa: number;
  pricePerTon: number;
  costPerHa: number;
  difficulty: number; // 1-5
  diseaseResistance: number; // 0-100
  marketDemand: number; // 0-100
  exportDemand: number; // 0-100
  carbonPerHa: number; // tCO2e
  nitrogenFixing: boolean;
  plantingMonths: number[];
  diseases: { name: string; trigger: string; symptoms: string; prevention: string; treatment: string }[];
  pests: string[];
  rotateAfter: string[];
  rotateBefore: string[];
  irrigation: string;
  notes: string;
}

export interface Factor {
  label: string;
  score: number; // 0-100
  weight: number;
  detail: string;
}

export interface Recommendation {
  crop: Crop;
  suitability: number;
  confidence: number;
  risk: number;
  factors: Factor[];
  expectedYield: number;
  profit: number;
  revenue: number;
  waterNeed: number;
  dailyWater: number;
  qualityGrade: string;
  lossPercent: number;
  sustainability: {
    water: number;
    carbon: number;
    soilHealth: number;
    eco: number;
  };
  diseaseRisks: { name: string; probability: number; symptoms: string; prevention: string; treatment: string }[];
  fertilizer: { organic: string; chemical: string; micro: string; schedule: string[] };
  plantingMonth: string;
  harvestMonth: string;
  advantages: string[];
  disadvantages: string[];
}
