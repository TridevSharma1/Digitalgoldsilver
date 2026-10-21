import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero, Section } from "@/components/site/ui";
import { Calculator } from "@/components/site/sections";

export const Route = createFileRoute("/calculator")({
  head: () => seo("Gold & Silver Investment Calculator", "Calculate weight, GST and estimated growth for your gold or silver investment."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero title="Investment Calculator" desc="Find out exactly how much gold or silver your money buys." />
      <Section title="Calculate your investment"><Calculator /></Section>
    </>
  );
}
