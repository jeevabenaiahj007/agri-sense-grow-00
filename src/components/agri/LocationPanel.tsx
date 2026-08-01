import { useState } from "react";
import { Crosshair, Loader2, MapPin, Search, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { searchPlaces, type GeoPlace } from "@/lib/agri/data";
import { toast } from "sonner";

interface Props {
  place: GeoPlace | null;
  onSelect: (place: GeoPlace) => void;
}

export function LocationPanel({ place, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoPlace[]>([]);
  const [busy, setBusy] = useState(false);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const found = await searchPlaces(query);
      setResults(found);
      if (found.length === 0) toast.error("No matching location found");
    } catch {
      toast.error("Location search failed. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  function useGps() {
    if (!("geolocation" in navigator)) {
      toast.error("GPS is not available on this device");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(false);
        onSelect({
          name: `My field (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setResults([]);
      },
      () => {
        setBusy(false);
        toast.error("Could not read GPS position");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const mapSrc = place
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${place.longitude - 0.09}%2C${place.latitude - 0.06}%2C${place.longitude + 0.09}%2C${place.latitude + 0.06}&layer=mapnik&marker=${place.latitude}%2C${place.longitude}`
    : null;

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="size-4 text-primary" /> Field location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={runSearch} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Village, district, state or country"
            aria-label="Search location"
          />
          <Button type="submit" size="icon" disabled={busy} aria-label="Search">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          </Button>
        </form>

        <Button variant="secondary" className="w-full" onClick={useGps} disabled={busy}>
          <Crosshair className="size-4" /> Use my current GPS position
        </Button>

        {results.length > 0 && (
          <ul className="max-h-52 space-y-1 overflow-y-auto rounded-lg border p-1">
            {results.map((r) => (
              <li key={`${r.latitude}-${r.longitude}-${r.name}`}>
                <button
                  className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  onClick={() => {
                    onSelect(r);
                    setResults([]);
                  }}
                >
                  <span className="font-medium">{r.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {[r.admin1, r.country].filter(Boolean).join(", ")} · {r.latitude.toFixed(2)},{" "}
                    {r.longitude.toFixed(2)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {mapSrc && (
          <div className="overflow-hidden rounded-xl border">
            <iframe
              title="Field map"
              src={mapSrc}
              className="h-56 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex items-center gap-2 border-t bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              <Satellite className="size-3.5" />
              {place?.name} · {place?.latitude.toFixed(4)}, {place?.longitude.toFixed(4)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
