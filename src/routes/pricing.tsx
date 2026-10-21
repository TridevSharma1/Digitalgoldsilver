import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero, Section } from "@/components/site/ui";
import { LivePrices } from "@/components/site/sections";

export const Route = createFileRoute("/pricing")({
  head: () => seo("Live Gold & Silver Pricing", "Today and yesterday rates for 24K gold and 999 silver with charges explained."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero title="Live Pricing" desc="Transparent rates. No hidden charges." />
      <Section title="Today's rates"><LivePrices /></Section>
      <Section title="Charges">
        <div className="card-lux mx-auto max-w-3xl overflow-hidden">
          {[["GST on purchase", "3%"], ["Vault storage", "Free"], ["Buy / Sell spread", "From 2.5%"], ["Coin redemption", "Making + delivery"], ["Wallet withdrawal", "Free"]].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b p-5 last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-semibold text-primary">{v}</span></div>
          ))}
        </div>
      </Section>
    </>
  );
}
