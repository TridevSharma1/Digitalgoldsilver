import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero, Section } from "@/components/site/ui";

export const Route = createFileRoute("/about")({
  head: () => seo("About Us", "Digital Gold And Sale is a Pune-based digital gold and silver investment platform."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero title="About Us" desc="Making precious metal investing simple, secure and accessible for every Indian." />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
        {[["Our Company", "Digital Gold And Sale, based in Pune, lets anyone buy, store and redeem 24K gold and 999 silver online — starting at just ₹10."], ["Our Mission", "To bring trusted, transparent precious metal investing to every household in India through technology."], ["Our Vision", "To become India’s most trusted digital vault for generations of savers."]].map(([t, d]) => (
          <div key={t} className="card-lux card-hover p-8"><h2 className="text-xl font-bold text-gold-gradient">{t}</h2><p className="mt-3 text-muted-foreground">{d}</p></div>
        ))}
      </section>
      <Section title="Why us">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Insured bank-grade vaults", "Certified 24K & 999 purity", "Lowest charges in market", "Redeem as coins anytime"].map((t) => (
            <div key={t} className="card-lux p-6 text-center font-semibold">{t}</div>
          ))}
        </div>
      </Section>
    </>
  );
}
