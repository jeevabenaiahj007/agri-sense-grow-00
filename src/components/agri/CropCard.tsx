import { ArrowRight, Droplets, ShieldAlert, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/lib/agri/types";

function tone(score: number) {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-soil";
  return "text-destructive";
}

export function CropCard({
  rec,
  rank,
  onOpen,
}: {
  rec: Recommendation;
  rank: number;
  onOpen: () => void;
}) {
  return (
    <Card className="group overflow-hidden shadow-soft transition-shadow hover:shadow-lg">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              {rec.crop.emoji}
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold leading-tight">{rec.crop.name}</h3>
              <p className="text-xs text-muted-foreground">
                #{rank} · {rec.crop.category}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-display text-2xl font-bold ${tone(rec.suitability)}`}>
              {rec.suitability}%
            </p>
            <p className="text-[11px] text-muted-foreground">suitability</p>
          </div>
        </div>

        <Progress value={rec.suitability} className="h-2" />

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="size-3.5" />
            <span className="text-foreground">{rec.expectedYield} t/ha</span> yield
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Droplets className="size-3.5" />
            <span className="text-foreground">{rec.waterNeed} mm</span> water
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="text-foreground">{rec.crop.durationDays} d</span> duration
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ShieldAlert className="size-3.5" />
            risk <span className={tone(100 - rec.risk)}>{rec.risk}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">Profit ≈ {rec.profit.toLocaleString()} /ha</Badge>
          <Badge variant="outline">Confidence {rec.confidence}%</Badge>
          <Badge variant="outline">Eco {rec.sustainability.eco}</Badge>
        </div>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {rec.factors[0]?.label}: {rec.factors[0]?.detail}
        </p>

        <Button variant="secondary" className="w-full" onClick={onOpen}>
          Why this crop? <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
