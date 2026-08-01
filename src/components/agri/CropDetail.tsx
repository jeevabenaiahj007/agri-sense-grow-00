import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { irrigationPlan, rotationPlan } from "@/lib/agri/engine";
import type { Recommendation, SiteConditions } from "@/lib/agri/types";

interface Props {
  rec: Recommendation | null;
  site: SiteConditions | null;
  onOpenChange: (open: boolean) => void;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-lg font-semibold">{value}</p>
    </div>
  );
}

export function CropDetail({ rec, site, onOpenChange }: Props) {
  if (!rec || !site) return null;
  const irrigation = irrigationPlan(rec, site);
  const rotation = rotationPlan(rec);
  const radarData = rec.factors.slice(0, 8).map((f) => ({ factor: f.label, score: f.score }));

  return (
    <Dialog open={!!rec} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span aria-hidden>{rec.crop.emoji}</span> {rec.crop.name}
            <Badge variant="secondary">{rec.suitability}% suitable</Badge>
            <Badge variant="outline">{rec.confidence}% confidence</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="why">
          <TabsList className="flex w-full flex-wrap">
            <TabsTrigger value="why">Why this crop</TabsTrigger>
            <TabsTrigger value="yield">Yield</TabsTrigger>
            <TabsTrigger value="disease">Disease</TabsTrigger>
            <TabsTrigger value="inputs">Fertilizer & water</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="eco">Sustainability</TabsTrigger>
          </TabsList>

          <TabsContent value="why" className="space-y-4 pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="72%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="factor" fontSize={10} />
                  <RTooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Radar
                    dataKey="score"
                    stroke="var(--color-chart-1)"
                    fill="var(--color-chart-1)"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5">
              {rec.factors.map((f) => (
                <div key={f.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {f.label}{" "}
                      <span className="text-xs text-muted-foreground">
                        (weight {Math.round(f.weight * 100)}%)
                      </span>
                    </span>
                    <span className="font-mono text-xs">{f.score}/100</span>
                  </div>
                  <Progress value={f.score} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">{f.detail}</p>
                </div>
              ))}
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-primary">Advantages</h4>
                <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {rec.advantages.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-destructive">Watch-outs</h4>
                <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {rec.disadvantages.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="yield" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Yield per hectare" value={`${rec.expectedYield} t`} />
              <Stat label="Yield per acre" value={`${(rec.expectedYield * 0.405).toFixed(2)} t`} />
              <Stat label="Quality grade" value={rec.qualityGrade} />
              <Stat label="Possible loss" value={`${rec.lossPercent}%`} />
              <Stat label="Planting month" value={rec.plantingMonth} />
              <Stat label="Harvest month" value={rec.harvestMonth} />
              <Stat label="Field duration" value={`${rec.crop.durationDays} days`} />
              <Stat label="Difficulty" value={`${rec.crop.difficulty}/5`} />
            </div>
            <p className="text-sm text-muted-foreground">
              Weather impact: current conditions modify the varietal potential of{" "}
              {rec.crop.yieldTonPerHa} t/ha by a factor derived from the suitability score. Rainfall
              in the last 30 days was {Math.round(site.rainfall30d)} mm and mean sunshine is{" "}
              {site.sunshineHours.toFixed(1)} h/day, both fed into this estimate.
            </p>
          </TabsContent>

          <TabsContent value="disease" className="space-y-4 pt-4">
            {rec.diseaseRisks.map((d) => (
              <div key={d.name} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{d.name}</h4>
                  <Badge variant={d.probability > 55 ? "destructive" : "secondary"}>
                    {d.probability}% probability
                  </Badge>
                </div>
                <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div>
                    <dt className="inline font-medium text-foreground">Symptoms: </dt>
                    <dd className="inline">{d.symptoms}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Prevention: </dt>
                    <dd className="inline">{d.prevention}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Treatment: </dt>
                    <dd className="inline">{d.treatment}</dd>
                  </div>
                </dl>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              Likely pests: {rec.crop.pests.join(", ")}. Scout twice weekly from 3 weeks after
              sowing.
            </p>
          </TabsContent>

          <TabsContent value="inputs" className="space-y-4 pt-4">
            <div className="rounded-xl border p-4">
              <h4 className="mb-2 font-semibold">Fertilizer plan</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Organic: </span>
                {rec.fertilizer.organic}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Chemical: </span>
                {rec.fertilizer.chemical}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Micronutrients: </span>
                {rec.fertilizer.micro}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                {rec.fertilizer.schedule.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border p-4">
              <h4 className="mb-2 font-semibold">Irrigation planner</h4>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat label="Season need" value={`${irrigation.seasonal} mm`} />
                <Stat label="Daily" value={`${irrigation.daily} m³/ha`} />
                <Stat label="Weekly" value={`${irrigation.weekly} m³/ha`} />
                <Stat label="Monthly" value={`${irrigation.monthly} m³/ha`} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Recommended method: <span className="font-medium text-foreground">{irrigation.method}</span>. {irrigation.note}.
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <h4 className="mb-2 font-semibold">Crop rotation</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Best preceding crops: </span>
                {rotation.previous.join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Best following crops: </span>
                {rotation.next.join(", ")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{rotation.restorative}</p>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Reference price" value={`${rec.crop.pricePerTon}/t`} />
              <Stat label="Gross revenue" value={`${rec.revenue.toLocaleString()}/ha`} />
              <Stat label="Input cost" value={`${rec.crop.costPerHa.toLocaleString()}/ha`} />
              <Stat label="Net profit" value={`${rec.profit.toLocaleString()}/ha`} />
            </div>
            <div className="space-y-3">
              {[
                { label: "Domestic demand", value: rec.crop.marketDemand },
                { label: "Export demand", value: rec.crop.exportDemand },
                { label: "Disease resistance", value: rec.crop.diseaseResistance },
                { label: "Overall risk", value: rec.risk },
              ].map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-mono text-xs">{m.value}/100</span>
                  </div>
                  <Progress value={m.value} className="h-1.5" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Prices are indicative reference values per tonne. Connect a live mandi/market feed for
              real-time pricing.
            </p>
          </TabsContent>

          <TabsContent value="eco" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Eco score" value={`${rec.sustainability.eco}/100`} />
              <Stat label="Water efficiency" value={`${rec.sustainability.water}/100`} />
              <Stat label="Carbon score" value={`${rec.sustainability.carbon}/100`} />
              <Stat label="Soil health" value={`${rec.sustainability.soilHealth}/100`} />
            </div>
            <p className="text-sm text-muted-foreground">
              Estimated footprint: {rec.crop.waterMmPerSeason * 10} m³ water per hectare per season
              and {rec.crop.carbonPerHa} t CO₂e emissions.{" "}
              {rec.crop.nitrogenFixing
                ? "This legume fixes nitrogen biologically, cutting urea demand for the next crop."
                : "Pair with a legume in rotation to offset nitrogen mining."}
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
