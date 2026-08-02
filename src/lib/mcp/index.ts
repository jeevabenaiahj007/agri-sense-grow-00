import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchPlacesTool from "./tools/search-places";
import getSiteConditionsTool from "./tools/get-site-conditions";
import listCropsTool from "./tools/list-crops";
import recommendCropsTool from "./tools/recommend-crops";
import getCropPlanTool from "./tools/get-crop-plan";

// The OAuth issuer must be the direct Supabase auth host: the published
// runtime URL is a proxy whose discovery document advertises this issuer.
const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "agriwise-ai",
  title: "AgriWise AI",
  version: "0.1.0",
  instructions:
    "Crop recommendation and precision-farming tools for AgriSense AI. Use `search_places` to resolve a location, `get_site_conditions` for live weather/air-quality context, `recommend_crops` to rank the best crops for a field, `list_crops` for the crop knowledge base, and `get_crop_plan` for a full agronomic plan (fertilizer, irrigation, disease risk, economics) for one crop. All data is public: live Open-Meteo weather plus FAO-based agronomic models.",
  // exactOptionalPropertyTypes makes the SDK's tool union reject tools without
  // an explicit outputSchema; the runtime shape is correct.
  tools: [
    searchPlacesTool,
    getSiteConditionsTool,
    listCropsTool,
    recommendCropsTool,
    getCropPlanTool,
  ] as unknown as Parameters<typeof defineMcp>[0]["tools"],
});
