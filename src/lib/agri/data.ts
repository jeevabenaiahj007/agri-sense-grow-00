import type { SiteConditions } from "./types";

export interface GeoPlace {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function searchPlaces(query: string): Promise<GeoPlace[]> {
  if (query.trim().length < 2) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`,
  );
  if (!res.ok) throw new Error("Location search failed");
  const json = (await res.json()) as { results?: GeoPlace[] };
  return json.results ?? [];
}

export async function reverseName(lat: number, lon: number): Promise<string> {
  return `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`;
}

function climateZone(lat: number, temp: number, rain: number) {
  const abs = Math.abs(lat);
  if (abs < 23.5) return rain > 1500 ? "Tropical humid" : rain > 700 ? "Tropical wet-dry" : "Tropical semi-arid";
  if (abs < 35) return rain > 900 ? "Subtropical humid" : "Subtropical dry";
  if (abs < 55) return temp < 8 ? "Temperate cold" : "Temperate";
  return "Boreal / polar";
}

function seasonFor(month: number, lat: number) {
  const northern = [
    "Winter",
    "Winter",
    "Spring",
    "Spring",
    "Summer",
    "Summer",
    "Monsoon",
    "Monsoon",
    "Autumn",
    "Autumn",
    "Pre-winter",
    "Winter",
  ];
  const idx = lat >= 0 ? month - 1 : (month + 5) % 12;
  return northern[idx] ?? "Season";
}

export async function fetchSiteConditions(place: GeoPlace): Promise<SiteConditions> {
  const { latitude, longitude } = place;
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,cloud_cover,surface_pressure,uv_index,soil_moisture_0_to_1cm,soil_temperature_0cm` +
    `&daily=precipitation_sum,sunshine_duration&past_days=92&forecast_days=1&timezone=auto`;
  const airUrl =
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}` +
    `&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`;
  const climateUrl =
    `https://climate-api.open-meteo.com/v1/climate?latitude=${latitude}&longitude=${longitude}` +
    `&start_date=1991-01-01&end_date=2020-12-31&models=MRI_AGCM3_2_S&daily=precipitation_sum`;

  const [wRes, aRes] = await Promise.all([fetch(weatherUrl), fetch(airUrl)]);
  if (!wRes.ok) throw new Error("Weather service unavailable");
  const w = await wRes.json();
  const a = aRes.ok ? await aRes.json() : { current: {} };

  const daily: number[] = w.daily?.precipitation_sum ?? [];
  const sunshine: number[] = w.daily?.sunshine_duration ?? [];
  const times: string[] = w.daily?.time ?? [];
  const rain92 = daily.reduce((s, v) => s + (v ?? 0), 0);
  const rain30 = daily.slice(-31).reduce((s, v) => s + (v ?? 0), 0);
  const sunHours =
    sunshine.length > 0 ? sunshine.reduce((s, v) => s + (v ?? 0), 0) / sunshine.length / 3600 : 7;

  const monthlyMap = new Map<string, number>();
  times.forEach((t, i) => {
    const label = MONTH_SHORT[new Date(t).getMonth()] ?? "Jan";
    monthlyMap.set(label, (monthlyMap.get(label) ?? 0) + (daily[i] ?? 0));
  });

  // Historical climate normals refine the annual rainfall estimate; fall back to
  // extrapolating the observed 92-day window if the climate model is slow/unavailable.
  let rainfallAnnual = (rain92 / 92) * 365;
  try {
    const cRes = await fetch(climateUrl);
    if (cRes.ok) {
      const c = await cRes.json();
      const arr: number[] = c.daily?.precipitation_sum ?? [];
      const valid = arr.filter((v) => typeof v === "number");
      if (valid.length > 3000) {
        rainfallAnnual = (valid.reduce((s, v) => s + v, 0) / valid.length) * 365;
      }
    }
  } catch {
    /* keep extrapolated estimate */
  }

  const cur = w.current ?? {};
  const ac = a.current ?? {};
  const month = new Date().getMonth() + 1;
  const temperature = cur.temperature_2m ?? 25;

  return {
    name: [place.name, place.admin1, place.country].filter(Boolean).join(", "),
    latitude,
    longitude,
    elevation: w.elevation ?? 0,
    temperature,
    humidity: cur.relative_humidity_2m ?? 60,
    rainfallAnnual,
    rainfall30d: rain30,
    windSpeed: cur.wind_speed_10m ?? 8,
    uvIndex: cur.uv_index ?? 5,
    cloudCover: cur.cloud_cover ?? 30,
    pressure: cur.surface_pressure ?? 1010,
    sunshineHours: sunHours,
    soilMoisture: cur.soil_moisture_0_to_1cm ?? 0.2,
    soilTemperature: cur.soil_temperature_0cm ?? temperature,
    season: seasonFor(month, latitude),
    climateZone: climateZone(latitude, temperature, rainfallAnnual),
    aqi: ac.us_aqi ?? 50,
    pm25: ac.pm2_5 ?? 15,
    pm10: ac.pm10 ?? 30,
    no2: ac.nitrogen_dioxide ?? 10,
    so2: ac.sulphur_dioxide ?? 5,
    ozone: ac.ozone ?? 60,
    co: ac.carbon_monoxide ?? 200,
    monthlyRain: MONTH_SHORT.filter((m) => monthlyMap.has(m)).map((m) => ({
      month: m,
      rain: Math.round(monthlyMap.get(m) ?? 0),
    })),
  };
}
