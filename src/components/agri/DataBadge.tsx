import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Provenance } from "@/lib/agri/types";

const SOURCE_LABEL: Record<Provenance["source"], string> = {
  "real-time": "Live",
  "api-derived": "Derived",
  historical: "Historical",
  modeled: "Modeled",
  estimated: "Estimated",
  "user-entered": "You entered",
  unavailable: "Unavailable",
};

const CONFIDENCE_TONE: Record<Provenance["confidence"], string> = {
  high: "bg-primary/15 text-primary",
  medium: "bg-sun/30 text-soil",
  low: "bg-destructive/15 text-destructive",
  unknown: "bg-muted text-muted-foreground",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return iso;
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 0)} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  return days > 400 ? `${Math.round(days / 365)} yr ago` : `${days} days ago`;
}

/** Small provenance chip: where a reading came from and how much to trust it. */
export function DataBadge({ prov }: { prov: Provenance }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`inline-flex cursor-help items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${CONFIDENCE_TONE[prov.confidence]}`}
        >
          {SOURCE_LABEL[prov.source]}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-56 text-xs">
        <p className="font-semibold">{prov.provider}</p>
        <p>Source: {SOURCE_LABEL[prov.source]}</p>
        <p>Confidence: {prov.confidence}</p>
        <p>Observed: {timeAgo(prov.observedAt)}</p>
        <p>Resolution: {prov.resolution}</p>
      </TooltipContent>
    </Tooltip>
  );
}
