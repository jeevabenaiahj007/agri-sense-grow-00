import { CROPS, MONTHS } from "./crops";
import type { Crop, Factor, Recommendation, SiteConditions, SoilProfile } from "./types";

/** Triangular fitness: 100 inside the range, tapering outside it. */
function rangeScore(value: number, [min, max]: [number, number], tolerance = 0.35) {
  if (value >= min && value <= max) return 100;
  const span = Math.max(max - min, 1);
  const distance = value < min ? min - value : value - max;
  const allowed = span * tolerance;
  return Math.max(0, Math.round(100 - (distance / allowed) * 100));
}

function nutrientScore(available: number, required: number) {
  const ratio = available / Math.max(required, 1);
  if (ratio >= 1) return Math.max(70, Math.round(100 - (ratio - 1) * 25));
  return Math.round(45 + ratio * 55);
}

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

export function scoreCrop(
  crop: Crop,
  site: SiteConditions,
  soil: SoilProfile,
  month: number,
): Recommendation {
  const tempScore = rangeScore(site.temperature, crop.tempRange);
  const humidityScore = rangeScore(site.humidity, crop.humidityRange);
  const rainScore = rangeScore(site.rainfallAnnual, crop.rainRange, 0.5);
  const phScore = rangeScore(soil.ph, crop.phRange, 0.5);
  const soilTypeScore = crop.soils.includes(soil.type) ? 100 : 42;
  const nutrient =
    (nutrientScore(soil.nitrogen, crop.n) +
      nutrientScore(soil.phosphorus, crop.p) +
      nutrientScore(soil.potassium, crop.k)) /
    3;
  const organicScore = clamp(35 + soil.organicMatter * 22);
  const salinityScore = clamp(100 - Math.max(0, soil.salinity - 1) * 35);
  const seasonScore = crop.plantingMonths.includes(month)
    ? 100
    : crop.plantingMonths.some((m) => Math.abs(m - month) === 1 || Math.abs(m - month) === 11)
      ? 72
      : 38;
  const sunScore = clamp(40 + site.sunshineHours * 9);
  const pollutionScore = clamp(105 - site.aqi / 2.2 - site.pm25 / 3);
  const windScore = clamp(100 - Math.max(0, site.windSpeed - 22) * 3.5);

  const factors: Factor[] = [
    {
      label: "Temperature match",
      score: tempScore,
      weight: 0.17,
      detail: `${site.temperature.toFixed(1)}°C now vs ideal ${crop.tempRange[0]}–${crop.tempRange[1]}°C.`,
    },
    {
      label: "Rainfall & water",
      score: rainScore,
      weight: 0.15,
      detail: `~${Math.round(site.rainfallAnnual)} mm/yr available vs ${crop.rainRange[0]}–${crop.rainRange[1]} mm needed.`,
    },
    {
      label: "Soil type",
      score: soilTypeScore,
      weight: 0.13,
      detail: `${soil.type} soil ${crop.soils.includes(soil.type) ? "is preferred by" : "is sub-optimal for"} ${crop.name}.`,
    },
    {
      label: "Soil pH",
      score: phScore,
      weight: 0.1,
      detail: `pH ${soil.ph.toFixed(1)} vs optimum ${crop.phRange[0]}–${crop.phRange[1]}.`,
    },
    {
      label: "Nutrient supply (NPK)",
      score: Math.round(nutrient),
      weight: 0.11,
      detail: `Soil N/P/K ${soil.nitrogen}/${soil.phosphorus}/${soil.potassium} vs demand ${crop.n}/${crop.p}/${crop.k} kg/ha.`,
    },
    {
      label: "Season & planting window",
      score: seasonScore,
      weight: 0.12,
      detail: `Ideal sowing: ${crop.plantingMonths.map((m) => MONTHS[m - 1].slice(0, 3)).join(", ")}.`,
    },
    {
      label: "Humidity",
      score: humidityScore,
      weight: 0.07,
      detail: `${site.humidity.toFixed(0)}% RH vs ideal ${crop.humidityRange[0]}–${crop.humidityRange[1]}%.`,
    },
    {
      label: "Sunlight",
      score: sunScore,
      weight: 0.05,
      detail: `${site.sunshineHours.toFixed(1)} h/day of sunshine at this location.`,
    },
    {
      label: "Organic matter",
      score: organicScore,
      weight: 0.04,
      detail: `${soil.organicMatter.toFixed(1)}% organic carbon in topsoil.`,
    },
    {
      label: "Salinity",
      score: salinityScore,
      weight: 0.03,
      detail: `EC ${soil.salinity.toFixed(1)} dS/m.`,
    },
    {
      label: "Air quality",
      score: pollutionScore,
      weight: 0.02,
      detail: `AQI ${Math.round(site.aqi)}, PM2.5 ${site.pm25.toFixed(0)} µg/m³.`,
    },
    {
      label: "Wind exposure",
      score: windScore,
      weight: 0.01,
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
  const risk = clamp(Math.round(diseasePressure * 0.5 + (100 - suitability) * 0.4 + crop.difficulty * 3));

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
      { m: crop.plantingMonths[0], dist: 99 },
    ).m - 1;
  const harvestIdx = (plantMonthIdx + Math.round(crop.durationDays / 30)) % 12;

  const advantages = [
    crop.nitrogenFixing
      ? "Fixes atmospheric nitrogen and improves the soil for the next crop."
      : `Strong market demand score of ${crop.marketDemand}/100.`,
    `Water requirement of ${crop.waterMmPerSeason} mm is ${crop.waterMmPerSeason < 600 ? "low" : crop.waterMmPerSeason < 1200 ? "moderate" : "high"} for this agro-climate.`,
    `Field duration of ${crop.durationDays} days ${crop.durationDays < 100 ? "allows a second crop in the same year" : "fits a single main season"}.`,
    crop.exportDemand > 70 ? `Export demand index ${crop.exportDemand}/100 opens premium buyers.` : `Reliable local mandi offtake.`,
  ];
  const disadvantages = [
    crop.difficulty >= 4 ? "Management-intensive: needs regular scouting and skilled labour." : "Modest management burden.",
    crop.diseaseResistance < 55 ? "Below-average disease resistance in humid spells." : "Reasonably disease tolerant.",
    crop.costPerHa > 1200 ? `High establishment cost (~${crop.costPerHa} per hectare).` : `Input cost is manageable (~${crop.costPerHa}/ha).`,
    ...(soilTypeScore < 100 ? [`${soil.type} soil is not the preferred texture — expect a yield penalty.`] : []),
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
    plantingMonth: MONTHS[plantMonthIdx],
    harvestMonth: MONTHS[harvestIdx],
    advantages,
    disadvantages,
  };
}

export function recommendCrops(site: SiteConditions, soil: SoilProfile, month: number) {
  return CROPS.map((c) => scoreCrop(c, site, soil, month)).sort((a, b) => b.suitability - a.suitability);
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
