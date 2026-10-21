import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero, Section } from "@/components/site/ui";
import { PlansGrid } from "@/components/site/sections";

export const Route = createFileRoute("/plans")({
  head: () => seo("Investment Plans", "Choose from Starter, Silver Saver, Gold Growth, Premium Investor and Corporate plans."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero title="Investment Plans" desc="Systematic plans for every goal and budget." />
      <Section title="Pick a plan that fits you"><PlansGrid /></Section>
    </>
  );
}
