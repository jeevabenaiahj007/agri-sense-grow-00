import { CROPS, MONTHS } from "./crops";
import { cropProfile, seasonOfMonth } from "./crop-profiles";
import type { Crop, Factor, Recommendation, SiteConditions, SoilProfile } from "./types";

/** Triangular fitness: 100 inside the range, tapering outside it. */
function rangeScore(value: number, [min, max]: [number, number], tolerance = 0.35) {
  if (value >= min && value <= max) return 100;
  const span = Math.max(max - min, 1);
  const distance = value < min ? min - value : value - max;
  const allowed = span * tolerance;
  return Math.max(0, Math.round(100 - (distance / allowed) * 100));
}

/**
 * Trapezoidal fitness: 100 inside the optimal band, sloping down to 60 at the
 * absolute limits and 0 beyond them. Used when a crop profile supplies an
 * optimum as well as a tolerable range.
 */
function optimalScore(
  value: number,
  [min, max]: [number, number],
  [optMin, optMax]: [number, number],
) {
  if (value >= optMin && value <= optMax) return 100;
  if (value < min || value > max) {
    const overshoot = value < min ? min - value : value - max;
    return Math.max(0, Math.round(60 - (overshoot / Math.max(max - min, 1)) * 120));
  }
  const span = value < optMin ? Math.max(optMin - min, 0.1) : Math.max(max - optMax, 0.1);
  const distance = value < optMin ? optMin - value : value - optMax;
  return Math.round(100 - (distance / span) * 40);
}

function toleranceFactor(level: "low" | "medium" | "high") {
  return level === "high" ? 1.25 : level === "medium" ? 1 : 0.75;
}

function nutrientScore(available: number, required: number) {
  const ratio = available / Math.max(required, 1);
  if (ratio >= 1) return Math.max(70, Math.round(100 - (ratio - 1) * 25));
  return Math.round(45 + ratio * 55);
}

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Scoring weights (percent) as configured for the recommendation engine.
 * They sum to 100; advisory signals carry zero weight and are shown for
 * explanation only.
 */
export const SCORING_WEIGHTS = {
  temperature: 20,
  rainfall: 20,
  soilPh: 15,
  nutrients: 15,
  soilTexture: 10,
  humidity: 5,
  season: 5,
  waterAvailability: 5,
  salinity: 5,
} as const;

export function scoreCrop(
  crop: Crop,
  site: SiteConditions,
  soil: SoilProfile,
  month: number,
): Recommendation {
  const p = cropProfile(crop.id);

  const tempScore = p
    ? optimalScore(site.temperature, crop.tempRange, p.tempOptimal)
    : rangeScore(site.temperature, crop.tempRange);
  const humidityScore = rangeScore(site.humidity, crop.humidityRange);
  const rainScore = p
    ? optimalScore(site.rainfallAnnual, crop.rainRange, [
        p.rainfallOptimal * 0.85,
        p.rainfallOptimal * 1.15,
      ])
    : rangeScore(site.rainfallAnnual, crop.rainRange, 0.5);
  const phScore = p
    ? optimalScore(soil.ph, crop.phRange, [p.phOptimal - 0.3, p.phOptimal + 0.3])
    : rangeScore(soil.ph, crop.phRange, 0.5);
  const soilTypeScore = crop.soils.includes(soil.type) ? 100 : 42;
  const nutrient =
    (nutrientScore(soil.nitrogen, crop.n) +
      nutrientScore(soil.phosphorus, crop.p) +
      nutrientScore(soil.potassium, crop.k)) /
    3;
  const organicScore = p
    ? clamp(Math.round(55 + (soil.organicMatter - p.organicMatterReq) * 30))
    : clamp(35 + soil.organicMatter * 22);
  const salinityScore = p
    ? clamp(Math.round(100 - Math.max(0, soil.salinity - p.ecTolerance * 0.5) * 30))
    : clamp(100 - Math.max(0, soil.salinity - 1) * 35);

  const currentSeason = seasonOfMonth(month);
  const seasonScore = p
    ? p.seasons[currentSeason]
      ? 100
      : crop.plantingMonths.includes(month)
        ? 90
        : 40
    : crop.plantingMonths.includes(month)
      ? 100
      : crop.plantingMonths.some((m) => Math.abs(m - month) === 1 || Math.abs(m - month) === 11)
        ? 72
        : 38;

  // Water availability: rain + stored soil moisture against seasonal demand,
  // adjusted for how well the crop tolerates drought.
  const seasonalSupply = (site.rainfallAnnual * crop.durationDays) / 365 + site.soilMoisture * 400;
  const supplyRatio =
    (seasonalSupply / Math.max(crop.waterMmPerSeason, 1)) *
    (p ? toleranceFactor(p.droughtTolerance) : 1);
  const waterAvailabilityScore = clamp(Math.round(Math.min(supplyRatio, 1.4) * 78));

  const sunScore = clamp(40 + site.sunshineHours * 9);
  const pollutionScore = clamp(105 - site.aqi / 2.2 - site.pm25 / 3);
  const windScore = clamp(100 - Math.max(0, site.windSpeed - 22) * 3.5);

  const w = SCORING_WEIGHTS;
  const factors: Factor[] = [
    {
      label: "Temperature match",
      score: tempScore,
      weight: w.temperature / 100,
      detail: p
        ? `${site.temperature.toFixed(1)}°C now · optimum ${p.tempOptimal[0]}–${p.tempOptimal[1]}°C, tolerable ${crop.tempRange[0]}–${crop.tempRange[1]}°C.`
        : `${site.temperature.toFixed(1)}°C now vs ideal ${crop.tempRange[0]}–${crop.tempRange[1]}°C.`,
    },
    {
      label: "Rainfall & precipitation",
      score: rainScore,
      weight: w.rainfall / 100,
      detail: p
        ? `~${Math.round(site.rainfallAnnual)} mm/yr available · optimum ${p.rainfallOptimal} mm, range ${crop.rainRange[0]}–${crop.rainRange[1]} mm.`
        : `~${Math.round(site.rainfallAnnual)} mm/yr available vs ${crop.rainRange[0]}–${crop.rainRange[1]} mm needed.`,
    },
    {
      label: "Soil pH",
      score: phScore,
      weight: w.soilPh / 100,
      detail: p
        ? `pH ${soil.ph.toFixed(1)} · optimum ${p.phOptimal.toFixed(1)}, tolerable ${crop.phRange[0]}–${crop.phRange[1]}.`
        : `pH ${soil.ph.toFixed(1)} vs optimum ${crop.phRange[0]}–${crop.phRange[1]}.`,
    },
    {
      label: "Nutrient supply (NPK)",
      score: Math.round(nutrient),
      weight: w.nutrients / 100,
      detail: `Soil N/P/K ${soil.nitrogen}/${soil.phosphorus}/${soil.potassium} vs demand ${crop.n}/${crop.p}/${crop.k} kg/ha.`,
    },
    {
      label: "Soil texture",
      score: soilTypeScore,
      weight: w.soilTexture / 100,
      detail: p
        ? `${soil.type} soil vs preferred "${p.soilTexturePref}".`
        : `${soil.type} soil ${crop.soils.includes(soil.type) ? "is preferred by" : "is sub-optimal for"} ${crop.name}.`,
    },
    {
      label: "Humidity",
      score: humidityScore,
      weight: w.humidity / 100,
      detail: `${site.humidity.toFixed(0)}% RH vs ideal ${crop.humidityRange[0]}–${crop.humidityRange[1]}%.`,
    },
    {
      label: "Season & planting window",
      score: seasonScore,
      weight: w.season / 100,
      detail: p
        ? `${currentSeason} season · this crop suits ${(["kharif", "rabi", "zaid"] as const).filter((s) => p.seasons[s]).join(", ") || "no standard"} season. Sowing ${p.sowingWindow}.`
        : `Ideal sowing: ${crop.plantingMonths.map((m) => (MONTHS[m - 1] ?? "").slice(0, 3)).join(", ")}.`,
    },
    {
      label: "Water availability",
      score: waterAvailabilityScore,
      weight: w.waterAvailability / 100,
      detail: `~${Math.round(seasonalSupply)} mm supply in-season vs ${crop.waterMmPerSeason} mm demand (${p?.waterRequirement ?? "medium"} water crop, ${p?.droughtTolerance ?? "medium"} drought tolerance).`,
    },
    {
      label: "Salinity (EC)",
      score: salinityScore,
      weight: w.salinity / 100,
      detail: p
        ? `EC ${soil.salinity.toFixed(1)} dS/m vs crop threshold ${p.ecTolerance} dS/m (${p.salinityTolerance} tolerance).`
        : `EC ${soil.salinity.toFixed(1)} dS/m.`,
    },
    // Advisory signals: explained to the farmer but not weighted in the score.
    {
      label: "Sunlight (advisory)",
      score: sunScore,
      weight: 0,
      detail: `${site.sunshineHours.toFixed(1)} h/day of sunshine at this location.`,
    },
    {
      label: "Organic matter (advisory)",
      score: organicScore,
      weight: 0,
      detail: p
        ? `${soil.organicMatter.toFixed(1)}% organic carbon vs ${p.organicMatterReq}% preferred.`
        : `${soil.organicMatter.toFixed(1)}% organic carbon in topsoil.`,
    },
    {
      label: "Air quality (advisory)",
      score: pollutionScore,
      weight: 0,
      detail: `AQI ${Math.round(site.aqi)}, PM2.5 ${site.pm25.toFixed(0)} µg/m³.`,
    },
    {
      label: "Wind exposure (advisory)",
      score: windScore,
      weight: 0,
      detail: `${site.windSpeed.toFixed(0)} km/h surface wind.`,
    },
  ];

  const suitability = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0) /
      factors.reduce((sum, f) => sum + f.weight, 0),
  );

  // Confidence falls when factors disagree strongly (high variance = uncertain).
  const mean = factors.reduce((s, f) => s + f.score, 0) / factors.length;
  const variance = factors.reduce((s, f) => s + (f.score - mean) ** 2, 0) / factors.length;
  const confidence = clamp(Math.round(96 - Math.sqrt(variance) * 1.15), 45, 97);

  const diseasePressure = clamp(
    (site.humidity > 75 ? 30 : site.humidity > 60 ? 18 : 8) +
      (100 - crop.diseaseResistance) * 0.5 +
      (site.rainfall30d > 200 ? 12 : 0),
  );
  const risk = clamp(
    Math.round(diseasePressure * 0.5 + (100 - suitability) * 0.4 + crop.difficulty * 3),
  );

  const yieldFactor = 0.45 + (suitability / 100) * 0.75;
  const expectedYield = +(crop.yieldTonPerHa * yieldFactor).toFixed(2);
  const revenue = Math.round(expectedYield * crop.pricePerTon);
  const profit = revenue - crop.costPerHa;
  const waterNeed = Math.round(crop.waterMmPerSeason * (site.rainfall30d > 150 ? 0.82 : 1));
  const dailyWater = +((waterNeed * 10) / crop.durationDays).toFixed(0); // m³/ha/day

  const waterScore = clamp(100 - crop.waterMmPerSeason / 22);
  const carbonScore = clamp(100 - crop.carbonPerHa * 16);
  const soilHealthScore = clamp(
    (crop.nitrogenFixing ? 88 : 58) + soil.organicMatter * 5 - crop.n / 10,
  );
  const eco = Math.round((waterScore + carbonScore + soilHealthScore) / 3);

  const diseaseRisks = crop.diseases.map((d) => {
    let p = 100 - crop.diseaseResistance;
    if (d.trigger === "humid" && site.humidity > 70) p += 25;
    if (d.trigger === "wet" && site.rainfall30d > 180) p += 25;
    if (d.trigger === "hot" && site.temperature > 30) p += 20;
    if (d.trigger === "cool" && site.temperature < 20) p += 18;
    if (d.trigger === "cool-humid" && site.temperature < 22 && site.humidity > 70) p += 28;
    if (d.trigger === "dry" && site.rainfall30d < 40) p += 20;
    return { ...d, probability: clamp(Math.round(p), 5, 95) };
  });

  const nGap = Math.max(0, crop.n - soil.nitrogen);
  const pGap = Math.max(0, crop.p - soil.phosphorus);
  const kGap = Math.max(0, crop.k - soil.potassium);
  const fertilizer = {
    organic: `${(6 + nGap / 25).toFixed(1)} t/ha well-rotted FYM or ${(2 + nGap / 60).toFixed(1)} t/ha vermicompost, incorporated 2 weeks before sowing.`,
    chemical: `Urea ${Math.round(nGap / 0.46)} kg/ha, DAP ${Math.round(pGap / 0.46)} kg/ha, MOP ${Math.round(kGap / 0.6)} kg/ha.`,
    micro:
      soil.ph > 7.5
        ? "Zinc sulphate 25 kg/ha + chelated iron foliar spray (high pH locks micronutrients)."
        : soil.ph < 5.8
          ? "Apply 2 t/ha agricultural lime plus borax 10 kg/ha before sowing."
          : "Zinc sulphate 15 kg/ha and borax 5 kg/ha as a maintenance dose.",
    schedule: [
      `Basal (day 0): 100% P, 50% K, 25% N`,
      `Vegetative (day ${Math.round(crop.durationDays * 0.25)}): 40% N`,
      `Reproductive (day ${Math.round(crop.durationDays * 0.5)}): 35% N, 50% K`,
      `Foliar micronutrient spray at day ${Math.round(crop.durationDays * 0.4)} and ${Math.round(crop.durationDays * 0.65)}`,
    ],
  };

  const plantMonthIdx =
    crop.plantingMonths.reduce(
      (best, m) => {
        const dist = Math.min(Math.abs(m - month), 12 - Math.abs(m - month));
        return dist < best.dist ? { m, dist } : best;
      },
      { m: crop.plantingMonths[0] ?? 1, dist: 99 },
    ).m - 1;
  const harvestIdx = (plantMonthIdx + Math.round(crop.durationDays / 30)) % 12;

  const advantages = [
    crop.nitrogenFixing
      ? "Fixes atmospheric nitrogen and improves the soil for the next crop."
      : `Strong market demand score of ${crop.marketDemand}/100.`,
    `Water requirement of ${crop.waterMmPerSeason} mm is ${crop.waterMmPerSeason < 600 ? "low" : crop.waterMmPerSeason < 1200 ? "moderate" : "high"} for this agro-climate.`,
    `Field duration of ${crop.durationDays} days ${crop.durationDays < 100 ? "allows a second crop in the same year" : "fits a single main season"}.`,
    crop.exportDemand > 70
      ? `Export demand index ${crop.exportDemand}/100 opens premium buyers.`
      : `Reliable local mandi offtake.`,
  ];
  const disadvantages = [
    crop.difficulty >= 4
      ? "Management-intensive: needs regular scouting and skilled labour."
      : "Modest management burden.",
    crop.diseaseResistance < 55
      ? "Below-average disease resistance in humid spells."
      : "Reasonably disease tolerant.",
    crop.costPerHa > 1200
      ? `High establishment cost (~${crop.costPerHa} per hectare).`
      : `Input cost is manageable (~${crop.costPerHa}/ha).`,
    ...(soilTypeScore < 100
      ? [`${soil.type} soil is not the preferred texture — expect a yield penalty.`]
      : []),
  ];

  return {
    crop,
    suitability,
    confidence,
    risk,
    factors: [...factors].sort((a, b) => b.weight * b.score - a.weight * a.score),
    expectedYield,
    profit,
    revenue,
    waterNeed,
    dailyWater,
    qualityGrade: suitability > 85 ? "A (Premium)" : suitability > 70 ? "B (Standard)" : "C (Fair)",
    lossPercent: clamp(Math.round(4 + (100 - suitability) * 0.22 + diseasePressure * 0.12), 2, 45),
    sustainability: {
      water: Math.round(waterScore),
      carbon: Math.round(carbonScore),
      soilHealth: Math.round(soilHealthScore),
      eco,
    },
    diseaseRisks,
    fertilizer,
    plantingMonth: MONTHS[plantMonthIdx] ?? "",
    harvestMonth: MONTHS[harvestIdx] ?? "",
    advantages,
    disadvantages,
  };
}

export function recommendCrops(site: SiteConditions, soil: SoilProfile, month: number) {
  return CROPS.map((c) => scoreCrop(c, site, soil, month)).sort(
    (a, b) => b.suitability - a.suitability,
  );
}

export function rotationPlan(rec: Recommendation) {
  return {
    previous: rec.crop.rotateAfter,
    next: rec.crop.rotateBefore,
    restorative: rec.crop.nitrogenFixing
      ? "This crop is itself restorative — follow it with a heavy feeder like maize or wheat."
      : "Follow with green gram, cowpea or a legume green manure to rebuild nitrogen.",
  };
}

export function irrigationPlan(rec: Recommendation, site: SiteConditions) {
  const weekly = Math.round((rec.waterNeed * 10 * 7) / rec.crop.durationDays);
  const method =
    rec.crop.waterMmPerSeason > 1200
      ? site.rainfallAnnual > 1400
        ? "Rain-fed with supplemental flood irrigation"
        : "Flood / furrow with strict scheduling"
      : rec.crop.waterMmPerSeason > 500
        ? "Drip irrigation with mulch (saves 35-45% water)"
        : "Sprinkler or rain-fed with 1-2 protective irrigations";
  return {
    seasonal: rec.waterNeed,
    daily: rec.dailyWater,
    weekly,
    monthly: weekly * 4,
    method,
    note: rec.crop.irrigation,
  };
}
