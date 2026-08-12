import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CloudRain,
  Droplets,
  Gauge,
  Leaf,
  Mountain,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DataBadge } from "./DataBadge";
import type { Provenance, SiteConditions } from "@/lib/agri/types";

function Metric({
  icon: Icon,
  label,
  value,
  sub,
  prov,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  prov?: Provenance | undefined;
}) {
  return (
    <div className="rounded-xl border bg-card p-3.5 shadow-soft">
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <Icon className="size-3.5 text-primary" />
          {label}
        </span>
        {prov && <DataBadge prov={prov} />}
      </div>
      <p className="mt-1.5 font-display text-xl font-semibold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function aqiBand(aqi: number) {
  if (aqi <= 50) return { label: "Good", tone: "bg-primary/15 text-primary" };
  if (aqi <= 100) return { label: "Moderate", tone: "bg-sun/25 text-soil" };
  if (aqi <= 150) return { label: "Unhealthy (sensitive)", tone: "bg-sun/40 text-soil" };
  return { label: "Unhealthy", tone: "bg-destructive/15 text-destructive" };
}

export function ConditionsGrid({ site }: { site: SiteConditions }) {
  const band = aqiBand(site.aqi);
  const pv = site.provenance ?? {};
  const pollutionNote =
    site.aqi <= 50
      ? "Clean air — no measurable impact on photosynthesis or crop quality."
      : site.aqi <= 100
        ? "Moderate load. Minor dust deposition on leaves; occasional washing helps."
        : site.pm25 > 55 || site.ozone > 100
          ? "High particulate/ozone load reduces light interception and can scar sensitive leaves — favour tolerant cereals over leafy vegetables."
          : "Elevated pollution. Expect a small yield penalty for leafy and fruiting vegetables.";

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Every reading is tagged with its source and confidence — hover a tag to see the provider,
        observation time and geographic resolution.
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric
          icon={Thermometer}
          label="Temperature"
          value={`${site.temperature.toFixed(1)}°C`}
          sub={`Soil ${site.soilTemperature.toFixed(1)}°C`}
          prov={pv['temperature']}
        />
        <Metric
          icon={Droplets}
          label="Humidity"
          value={`${site.humidity.toFixed(0)}%`}
          sub={`Cloud ${site.cloudCover.toFixed(0)}%`}
          prov={pv['humidity']}
        />
        <Metric
          icon={CloudRain}
          label="Rainfall"
          value={`${Math.round(site.rainfallAnnual)} mm/yr`}
          sub={`${Math.round(site.rainfall30d)} mm last 30 days`}
          prov={pv['rainfallAnnual']}
        />
        <Metric
          icon={Wind}
          label="Wind"
          value={`${site.windSpeed.toFixed(0)} km/h`}
          sub={`Pressure ${site.pressure.toFixed(0)} hPa`}
          prov={pv['windSpeed']}
        />
        <Metric
          icon={Sun}
          label="Sunshine"
          value={`${site.sunshineHours.toFixed(1)} h/day`}
          sub={`UV index ${site.uvIndex.toFixed(1)}`}
          prov={pv['sunshineHours']}
        />
        <Metric
          icon={Leaf}
          label="Soil moisture"
          value={`${(site.soilMoisture * 100).toFixed(0)}%`}
          sub="Volumetric, 0–1 cm"
          prov={pv['soilMoisture']}
        />
        <Metric
          icon={Mountain}
          label="Elevation"
          value={`${Math.round(site.elevation)} m`}
          sub={site.climateZone}
          prov={pv['elevation']}
        />
        <Metric
          icon={Gauge}
          label="Season"
          value={site.season}
          sub={`Lat ${site.latitude.toFixed(2)}°`}
          prov={pv['season']}
        />
      </div>


      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="shadow-soft lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent rainfall pattern</CardTitle>
            <p className="text-xs text-muted-foreground">
              Observed monthly totals over the last 90 days at this location.
            </p>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={site.monthlyRain}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} unit="mm" width={48} />
                <RTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    color: "var(--popover-foreground)",
                  }}
                />
                <Bar dataKey="rain" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between gap-2 text-base">
              <span className="flex items-center gap-2">
                Air quality
                {pv['airQuality'] && <DataBadge prov={pv['airQuality']} />}
              </span>
              <Badge className={band.tone} variant="secondary">
                AQI {Math.round(site.aqi)} · {band.label}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {[
              { label: "PM2.5", value: site.pm25, max: 120, unit: "µg/m³" },
              { label: "PM10", value: site.pm10, max: 200, unit: "µg/m³" },
              { label: "Ozone", value: site.ozone, max: 180, unit: "µg/m³" },
              { label: "NO₂", value: site.no2, max: 120, unit: "µg/m³" },
              { label: "SO₂", value: site.so2, max: 100, unit: "µg/m³" },
              { label: "CO", value: site.co / 10, max: 100, unit: "×10 µg/m³" },
            ].map((p) => (
              <div key={p.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{p.label}</span>
                  <span className="font-mono">
                    {p.value.toFixed(0)} {p.unit}
                  </span>
                </div>
                <Progress value={Math.min(100, (p.value / p.max) * 100)} className="h-1.5" />
              </div>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">{pollutionNote}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
