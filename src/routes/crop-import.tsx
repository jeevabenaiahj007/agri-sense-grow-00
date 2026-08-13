import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Download, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  clearOverrides,
  csvTemplate,
  loadOverrides,
  parseProfileFile,
  saveOverrides,
  type ParseResult,
} from "@/lib/agri/profile-import";
import { CROP_PROFILES } from "@/lib/agri/crop-profiles";

export const Route = createFileRoute("/crop-import")({
  head: () => ({
    meta: [
      { title: "Bulk Crop Profile Import — AgriSense AI" },
      {
        name: "description",
        content:
          "Import or update AgriSense crop profiles in bulk from CSV or JSON, with full schema validation before anything is saved.",
      },
      { property: "og:title", content: "Bulk Crop Profile Import — AgriSense AI" },
      {
        property: "og:description",
        content: "Validate and bulk-load crop agronomic parameters from CSV or JSON files.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CropImportPage,
});

function CropImportPage() {
  const [result, setResult] = useState<ParseResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [savedCount, setSavedCount] = useState(() => Object.keys(loadOverrides()).length);
  const inputRef = useRef<HTMLInputElement>(null);

  const knownIds = useMemo(() => new Set(Object.keys(CROP_PROFILES)), []);

  async function onFile(file: File) {
    const text = await file.text();
    setFileName(file.name);
    const parsed = parseProfileFile(text, file.name);
    setResult(parsed);
    if (parsed.errors.length) {
      toast.error(`${parsed.errors.length} row(s) failed validation`);
    } else {
      toast.success(`${parsed.valid.length} profile(s) ready to import`);
    }
  }

  function commit() {
    if (!result?.valid.length) return;
    const next = saveOverrides(result.valid);
    setSavedCount(Object.keys(next).length);
    setResult(null);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
    toast.success("Crop profiles updated — recommendations now use your values.");
  }

  function download() {
    const blob = new Blob([csvTemplate()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agrisense-crop-profiles-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    clearOverrides();
    setSavedCount(0);
    toast.success("Reverted to the built-in crop profiles.");
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-5 py-10">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold">Bulk crop profile import</h1>
        <p className="text-sm text-muted-foreground">
          Upload a CSV or JSON file to add or update agronomic parameters for crops. Every row is
          validated against the crop-profile schema, and nothing is saved until the whole preview
          looks right.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link to="/" className="underline underline-offset-4">
            Back to the dashboard
          </Link>
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="text-base">1. Choose a file</CardTitle>
          <Button variant="outline" size="sm" onClick={download}>
            <Download className="mr-2 size-4" /> CSV template
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.json,text/csv,application/json"
            aria-label="Crop profile file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
            className="w-full cursor-pointer rounded-md border bg-background p-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:text-primary-foreground"
          />
          <p className="text-xs text-muted-foreground">
            CSV columns: id, scientificName, kharif, rabi, zaid, tempMin, tempMax, rainfallOptimal,
            phOptimal, organicMatterReq, ecTolerance, soilTexturePref, waterRequirement,
            sowingWindow, harvestWindow, droughtTolerance, salinityTolerance,
            waterloggingTolerance. JSON accepts the same fields as an array of objects (with a
            nested <code>seasons</code> object and <code>tempOptimal</code> as [min, max]).
          </p>
          <p className="text-xs text-muted-foreground">
            {savedCount > 0
              ? `${savedCount} custom profile(s) currently active.`
              : "No custom profiles yet — the built-in ICAR/FAO profiles are in use."}
            {savedCount > 0 && (
              <Button variant="ghost" size="sm" className="ml-2 h-6 px-2" onClick={reset}>
                <RotateCcw className="mr-1 size-3" /> Reset to defaults
              </Button>
            )}
          </p>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2 text-base">
              2. Validation preview
              <Badge variant="secondary">{fileName}</Badge>
              <Badge variant="outline">{result.format.toUpperCase()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-1 text-primary">
                <CheckCircle2 className="size-4" /> {result.valid.length} valid
              </span>
              <span className="inline-flex items-center gap-1 text-destructive">
                <AlertTriangle className="size-4" /> {result.errors.length} rejected
              </span>
            </div>

            {result.errors.length > 0 && (
              <ul className="space-y-1 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-xs">
                {result.errors.map((e, i) => (
                  <li key={i}>
                    <strong>Row {e.row}</strong> ({e.id}): {e.message}
                  </li>
                ))}
              </ul>
            )}

            {result.valid.length > 0 && (
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="p-2">Crop id</th>
                      <th className="p-2">Action</th>
                      <th className="p-2">Temp °C</th>
                      <th className="p-2">Rain mm</th>
                      <th className="p-2">pH</th>
                      <th className="p-2">Water</th>
                      <th className="p-2">Seasons</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.valid.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="p-2 font-medium">{p.id}</td>
                        <td className="p-2">{knownIds.has(p.id) ? "Update" : "New"}</td>
                        <td className="p-2">
                          {p.tempOptimal[0]}–{p.tempOptimal[1]}
                        </td>
                        <td className="p-2">{p.rainfallOptimal}</td>
                        <td className="p-2">{p.phOptimal}</td>
                        <td className="p-2">{p.waterRequirement}</td>
                        <td className="p-2">
                          {Object.entries(p.seasons)
                            .filter(([, v]) => v)
                            .map(([k]) => k)
                            .join(", ") || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Button onClick={commit} disabled={result.valid.length === 0}>
              <Upload className="mr-2 size-4" />
              Import {result.valid.length} profile(s)
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
