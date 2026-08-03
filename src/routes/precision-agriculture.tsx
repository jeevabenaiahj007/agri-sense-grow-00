import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";

const TITLE = "Precision Agriculture Basics: A Practical Guide for Farmers";
const DESCRIPTION =
  "What precision agriculture is, the data it runs on — weather, soil, air quality — and how AI crop recommendations turn that data into field decisions.";
const URL = "https://agri-sense-grow-00.lovable.app/precision-agriculture";

export const Route = createFileRoute("/precision-agriculture")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          mainEntityOfPage: URL,
          author: { "@type": "Organization", name: "AgriSense AI" },
        }),
      },
    ],
  }),
  component: PrecisionAgriculturePage,
});

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold text-foreground">{heading}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function PrecisionAgriculturePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="surface-field">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-8">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
            <Sprout className="size-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">
              Precision Agriculture Basics: A Practical Guide for Farmers
            </h1>
            <p className="text-sm opacity-85">
              How field-level data becomes better planting decisions
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-5 py-10">
        <p className="text-base leading-relaxed text-foreground">
          Precision agriculture is the practice of managing a farm at the level of the individual
          field — or even the individual square metre — instead of treating every hectare the same.
          It replaces calendar-based habits with decisions grounded in measured conditions: what the
          weather is actually doing, what the soil actually holds, and what a specific crop actually
          needs at this point in its cycle.
        </p>

        <Section heading="The data precision farming runs on">
          <p>
            Four data layers do most of the work. <strong>Weather</strong> — temperature, humidity,
            rainfall and recent trends — determines heat and water stress. <strong>Soil</strong> —
            texture, pH, organic matter and nitrogen, phosphorus and potassium levels — determines
            what a crop can absorb. <strong>Air quality</strong>, often overlooked, affects
            photosynthesis and leaf health through particulates and ground-level ozone.{" "}
            <strong>Season and location</strong> set the planting window and the climate zone that
            frames everything else.
          </p>
          <p>
            None of these layers is decisive alone. A soil with excellent phosphorus is still a poor
            match for a crop whose temperature range the site never reaches. Precision agriculture
            is fundamentally about weighing the layers together.
          </p>
        </Section>

        <Section heading="From measurement to recommendation">
          <p>
            Once conditions are quantified, each candidate crop can be scored against them: how well
            the temperature band matches, whether rainfall covers the water requirement or
            irrigation must close the gap, whether soil pH sits inside the tolerated range, and
            whether the nutrient supply meets demand. Economics and disease pressure add further
            weight — a crop that grows well but has no local market, or one that thrives in exactly
            the humidity that invites blight, is not automatically the right choice.
          </p>
          <p>
            The output is a ranking, not a verdict. The value of a good model is that it makes the
            trade-offs visible so a farmer can override them with knowledge the data does not
            capture.
          </p>
        </Section>

        <Section heading="Why explainability matters more than accuracy">
          <p>
            A recommendation a farmer cannot interrogate is a recommendation a farmer should not
            follow. Knowing that a crop scored well because rainfall covers 80% of its water need,
            but scored poorly on soil pH, tells you exactly which intervention — lime, or a
            different crop — changes the outcome. An opaque score tells you nothing actionable.
          </p>
          <p>
            This is why every recommendation in AgriSense AI ships with its factor breakdown, yield
            and profit estimates, disease probabilities and a sustainability score.
          </p>
        </Section>

        <Section heading="Getting started without new hardware">
          <p>
            Precision agriculture does not require sensors in the ground on day one. Public weather,
            climate and air-quality data covers most of the environmental picture for any
            coordinate, and a basic soil test — pH plus NPK — covers the rest. Start there, track
            what the model predicted against what the field delivered, and add instrumentation only
            where the gap justifies it.
          </p>
        </Section>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Try it on your own field
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick a location, enter your soil profile, and see the top 10 crops ranked with a full
            explanation of every factor.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open the crop recommender
          </Link>
        </div>
      </main>

      <footer className="border-t px-5 py-6 text-center text-xs text-muted-foreground">
        Weather, climate and air-quality data from Open-Meteo. Agronomic ranges follow FAO-56 crop
        water guidance.
      </footer>
    </div>
  );
}
