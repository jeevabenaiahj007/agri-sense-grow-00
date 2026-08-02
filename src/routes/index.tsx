import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Leaf, Loader2, Moon, Sprout, Sun } from "lucide-react";
import { LocationPanel } from "@/components/agri/LocationPanel";
import { SoilPanel, DEFAULT_SOIL } from "@/components/agri/SoilPanel";
import { ConditionsGrid } from "@/components/agri/ConditionsGrid";
import { CropCard } from "@/components/agri/CropCard";
import { CropDetail } from "@/components/agri/CropDetail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSiteConditions, type GeoPlace } from "@/lib/agri/data";
import { recommendCrops } from "@/lib/agri/engine";
import type { Recommendation, SoilProfile } from "@/lib/agri/types";

const TITLE = "AgriSense AI — Explainable Crop Recommendations";
const DESCRIPTION =
  "Analyse live weather, air quality, soil and season for any field, and get the top 10 crops with yield, profit, disease risk and a full explanation of why.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://agri-sense-grow-00.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://agri-sense-grow-00.lovable.app/" }],
  }),
  component: Dashboard,
});

const DEFAULT_PLACE: GeoPlace = {
  name: "Nashik",
  admin1: "Maharashtra",
  country: "India",
  latitude: 19.9975,
  longitude: 73.7898,
};

function Dashboard() {
  const [place, setPlace] = useState<GeoPlace>(DEFAULT_PLACE);
  const [soil, setSoil] = useState<SoilProfile>(DEFAULT_SOIL);
  const [selected, setSelected] = useState<Recommendation | null>(null);
  const [dark, setDark] = useState(false);

  const { data: site, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["site", place.latitude, place.longitude],
    queryFn: () => fetchSiteConditions(place),
    staleTime: 10 * 60 * 1000,
  });

  const recommendations = useMemo(() => {
    if (!site) return [];
    return recommendCrops(site, soil, new Date().getMonth() + 1).slice(0, 10);
  }, [site, soil]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="surface-field">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
              <Sprout className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold">
                AgriSense AI — Explainable Crop Recommendations
              </h1>
              <p className="text-sm opacity-85">
                Intelligent crop recommendation & precision farming platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/15 text-current">
              Explainable AI
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="hover:bg-white/15"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-4">
          <LocationPanel place={place} onSelect={setPlace} />
          <SoilPanel soil={soil} onChange={setSoil} />
        </aside>

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">
                {site ? site.name : place.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {site
                  ? `${site.climateZone} · ${site.season} season · live conditions`
                  : "Loading live environmental data…"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? <Loader2 className="size-4 animate-spin" /> : <Leaf className="size-4" />}
              Refresh conditions
            </Button>
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          )}

          {isError && (
            <Card className="border-destructive/40">
              <CardContent className="flex items-center gap-3 p-5 text-sm">
                <AlertTriangle className="size-5 text-destructive" />
                Could not load environmental data for this location. Try refreshing or picking a
                nearby town.
              </CardContent>
            </Card>
          )}

          {site && <ConditionsGrid site={site} />}

          {recommendations.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-xl font-semibold">Top 10 recommended crops</h2>
                <p className="text-sm text-muted-foreground">
                  Ranked by a weighted multi-factor model over climate, soil, season, air quality and
                  economics. Open any crop to see exactly why it scored the way it did.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recommendations.map((rec, i) => (
                  <CropCard
                    key={rec.crop.id}
                    rec={rec}
                    rank={i + 1}
                    onOpen={() => setSelected(rec)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t px-5 py-6 text-center text-xs text-muted-foreground">
        Weather, climate and air-quality data from Open-Meteo. Agronomic ranges follow FAO-56 crop
        water guidance. Recommendations are advisory — validate with a local extension officer.
      </footer>

      <CropDetail rec={selected} site={site ?? null} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}
