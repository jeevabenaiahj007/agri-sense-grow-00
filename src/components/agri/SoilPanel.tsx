import { FlaskConical, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SoilProfile, SoilType } from "@/lib/agri/types";

export const DEFAULT_SOIL: SoilProfile = {
  type: "loamy",
  ph: 6.8,
  nitrogen: 70,
  phosphorus: 40,
  potassium: 45,
  organicMatter: 1.4,
  moisture: 22,
  salinity: 0.6,
};

const SOIL_TYPES: { value: SoilType; label: string }[] = [
  { value: "loamy", label: "Loamy — balanced, best all-round" },
  { value: "sandy", label: "Sandy — fast draining, low retention" },
  { value: "clay", label: "Clay — heavy, holds water" },
  { value: "silt", label: "Silty — fine, fertile" },
  { value: "black", label: "Black cotton (vertisol)" },
  { value: "red", label: "Red soil (ferruginous)" },
  { value: "laterite", label: "Laterite — leached, acidic" },
  { value: "alluvial", label: "Alluvial — river deposited" },
];

interface Props {
  soil: SoilProfile;
  onChange: (soil: SoilProfile) => void;
}

function Row({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="font-mono text-xs font-semibold">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v ?? min)}
        aria-label={label}
      />
    </div>
  );
}

export function SoilPanel({ soil, onChange }: Props) {
  const set = (patch: Partial<SoilProfile>) => onChange({ ...soil, ...patch });

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FlaskConical className="size-4 text-primary" /> Soil profile
          <DataBadge
            prov={{
              source: isDefault ? "estimated" : "user-entered",
              provider: isDefault
                ? "Typical medium-fertility field defaults"
                : "Values you entered from your soil health card",
              confidence: isDefault ? "low" : "high",
              observedAt: new Date().toISOString(),
              resolution: isDefault ? "regional average" : "your field",
            }}
          />
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => onChange(DEFAULT_SOIL)}>
          <RotateCcw className="size-3.5" /> Reset
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Soil type</Label>
          <Select value={soil.type} onValueChange={(v) => set({ type: v as SoilType })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOIL_TYPES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Row label="pH" value={soil.ph} unit="" min={3.5} max={9.5} step={0.1} onChange={(ph) => set({ ph })} />
        <Row
          label="Nitrogen (N)"
          value={soil.nitrogen}
          unit=" kg/ha"
          min={0}
          max={300}
          step={5}
          onChange={(nitrogen) => set({ nitrogen })}
        />
        <Row
          label="Phosphorus (P)"
          value={soil.phosphorus}
          unit=" kg/ha"
          min={0}
          max={150}
          step={5}
          onChange={(phosphorus) => set({ phosphorus })}
        />
        <Row
          label="Potassium (K)"
          value={soil.potassium}
          unit=" kg/ha"
          min={0}
          max={400}
          step={5}
          onChange={(potassium) => set({ potassium })}
        />
        <Row
          label="Organic matter"
          value={soil.organicMatter}
          unit=" %"
          min={0}
          max={6}
          step={0.1}
          onChange={(organicMatter) => set({ organicMatter })}
        />
        <Row
          label="Salinity (EC)"
          value={soil.salinity}
          unit=" dS/m"
          min={0}
          max={6}
          step={0.1}
          onChange={(salinity) => set({ salinity })}
        />
        <p className="text-xs text-muted-foreground">
          No lab report? The defaults reflect a typical medium-fertility field. Adjust any value from
          your soil health card for a sharper recommendation.
        </p>
      </CardContent>
    </Card>
  );
}
